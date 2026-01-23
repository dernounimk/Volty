import { useEffect, useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import toast from "react-hot-toast";
import { useOrderStore } from "../stores/useOrderStore.js";
import { createPortal } from "react-dom";
import { Trash, Copy, CheckCheck, CheckCircle, XCircle, Search, Filter, Eye, Phone, MapPin, Calendar, Package, User, Hash } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import useSettingStore from '../stores/useSettingStore.js';
import dayjs from "dayjs";
import LoadingSpinner from "./LoadingSpinner.jsx";

const OrderList = () => {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === 'ar';

  const { orders, fetchOrders, deleteOrder, toggleOrderConfirmation, updateDeliveryPhone } = useOrderStore();
  const { colorsList } = useSettingStore();
  const [isLoading, setIsLoading] = useState(true);

  const [selectedOrders, setSelectedOrders] = useState([]);
  const [selectAll, setSelectAll] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const [selectedOrderId, setSelectedOrderId] = useState(null);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [deliveryPhone, setDeliveryPhone] = useState("");
  const [loading, setLoading] = useState(false);
  const [pressTimer, setPressTimer] = useState(null);
  const [isSelectionMode, setIsSelectionMode] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchTypeIndex, setSearchTypeIndex] = useState(0);
  const searchTypes = ['orderNumber', 'fullName', 'phoneNumber'];
  const [statusFilter, setStatusFilter] = useState('all');
  const [sortOrder, setSortOrder] = useState('desc');
  const [stateFilter, setStateFilter] = useState('all');
  
  useEffect(() => {
    console.log("📊 حالة الطلبات:", {
      totalOrders: orders?.length,
      orders: orders
    });
  }, [orders]);

  const filteredSortedOrders = useMemo(() => {
    console.log("🔍 بدء فلترة الطلبات:", {
      total: orders?.length,
      statusFilter,
      stateFilter,
      searchQuery,
    });
    
    let result = Array.isArray(orders) ? [...orders] : [];
    console.log("📋 الطلبات الأولية:", result.length);

    if (statusFilter !== 'all') {
      const isConfirmed = statusFilter === 'confirmed';
      result = result.filter(order => order?.isConfirmed === isConfirmed);
      console.log(`🔄 بعد فلترة الحالة (${statusFilter}):`, result.length);
    }

    if (stateFilter !== 'all') {
      result = result.filter(order => order?.wilaya === stateFilter);
      console.log(`🗺️ بعد فلترة الولاية (${stateFilter}):`, result.length);
    }

    if (searchQuery) {
      const field = searchTypes[searchTypeIndex];
      result = result.filter(order =>
        (order?.[field] ?? '').toString().toLowerCase().includes(searchQuery.toLowerCase())
      );
      console.log(`🔎 بعد البحث (${field}):`, result.length);
    }

    result.sort((a, b) => {
      const dateA = a?.createdAt ? new Date(a.createdAt) : new Date(0);
      const dateB = b?.createdAt ? new Date(b.createdAt) : new Date(0);
      return sortOrder === 'desc' ? dateB - dateA : dateA - dateB;
    });

    console.log("✅ الطلبات بعد الترتيب:", result.length);
    return result;
  }, [orders, statusFilter, sortOrder, searchQuery, searchTypeIndex, stateFilter]);

  useEffect(() => {
    if (selectedOrder?.deliveryPhone) {
      setDeliveryPhone(selectedOrder.deliveryPhone);
    }
  }, [selectedOrder]);

  useEffect(() => {
    if (selectedOrders.length === 0) {
      setIsSelectionMode(false);
      setSelectAll(false);
    } else {
      setSelectAll(selectedOrders.length === orders.length && orders.length > 0);
    }
  }, [selectedOrders, orders]);

  const handleSave = async (orderId) => {
    if (!orderId) return;
    
    setLoading(true);
    try {
      const updatedOrder = await updateDeliveryPhone(orderId, deliveryPhone.trim());
      toast.success(t("orders.numberSaved"));
      setSelectedOrder((prev) => ({...prev, deliveryPhone: updatedOrder.deliveryPhone }));
    } catch (e) {
      toast.error(e.message);
    }
    setLoading(false);
  };

  const navigate = useNavigate();

  const hasMixedStatus = selectedOrders.length > 0 && 
    orders.some(o => selectedOrders.includes(o?._id) && o?.isConfirmed) &&
    orders.some(o => selectedOrders.includes(o?._id) && !o?.isConfirmed);

  const allConfirmed = selectedOrders.length > 0 && 
    selectedOrders.every(id => orders.find(o => o?._id === id)?.isConfirmed);

  const toggleConfirmation = async () => {
    if (selectedOrders.length === 0 || hasMixedStatus) return;
    try {
      await toggleOrderConfirmation(selectedOrders);
      toast.success(
        allConfirmed
          ? t("orders.unconfirmSuccess", { count: selectedOrders.length })
          : t("orders.confirmSuccess", { count: selectedOrders.length })
      );
    } catch (error) {
      toast.error(t("orders.toggleError"));
    }
  };

  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      try {
        console.log("🚀 بدء تحميل الطلبات...");
        await fetchOrders();
      } catch (error) {
        console.error("❌ خطأ في جلب الطلبات:", error);
        toast.error(t("orders.loadError"));
      } finally {
        setIsLoading(false);
      }
    };
    
    loadData();
  }, [fetchOrders, t]);

  const handleOrderSelection = (orderId) => {
    if (selectedOrders.includes(orderId)) {
      setSelectedOrders(prev => prev.filter(id => id !== orderId));
    } else {
      setSelectedOrders(prev => [...prev, orderId]);
    }
  };

  const handleRowClick = (order, event) => {
    if (isSelectionMode) {
      handleOrderSelection(order._id);
      return;
    }

    if (!pressTimer) {
      setSelectedOrder(order);
    }
  };

  const handleLongPressStart = (orderId) => {
    if (pressTimer) return;
    
    const timer = setTimeout(() => {
      setIsSelectionMode(true);
      handleOrderSelection(orderId);
      setPressTimer(null);
    }, 500);

    setPressTimer(timer);
  };

  const handleLongPressEnd = () => {
    if (pressTimer) {
      clearTimeout(pressTimer);
      setPressTimer(null);
    }
  };

  const handleLongPressCancel = () => {
    if (pressTimer) {
      clearTimeout(pressTimer);
      setPressTimer(null);
    }
  };

  const getFullColorData = (colorId) => {
    if (!colorId) return null;
    return colorsList.find(c => c._id === colorId) || 
    { _id: colorId, name: colorId, hex: '#cccccc' };
  };

  const handleDelete = async () => {
    try {
      if (selectedOrderId) {
        await deleteOrder(selectedOrderId);
        toast.success(t("orders.deleteSingle"));
      } else if (selectedOrders.length > 0) {
        await Promise.all(selectedOrders.map((id) => deleteOrder(id)));
        toast.success(t("orders.deleteSuccess", { count: selectedOrders.length }));
        setSelectedOrders([]);
        setSelectAll(false);
      }
    } catch (error) {
      toast.error(t("orders.deleteError"));
    } finally {
      setShowPopup(false);
      setSelectedOrderId(null);
    }
  };

  function highlightText(text = '', query, highlight) {
    if (!highlight || !query || !text) return text;
    const regex = new RegExp(`(${query})`, 'gi');
    const parts = text.split(regex);
    return parts.map((part, i) =>
      regex.test(part) ? (
        <span key={i} className="bg-yellow-400 text-black rounded px-0.5">{part}</span>
      ) : (
        part
      )
    );
  }

  const searchFields = [
    { key: 'orderNumber', label: t("orders.orderNumber"), icon: Hash },
    { key: 'fullName', label: t("orders.fullName"), icon: User },
    { key: 'phoneNumber', label: t("orders.phoneNumber"), icon: Phone }
  ];

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  if (!Array.isArray(orders) || orders.length === 0) {
    return (
      <div className="min-h-screen py-8 px-4">
        <motion.div
          className="max-w-2xl mx-auto bg-[var(--color-bg-opacity)] backdrop-blur-xl rounded-2xl shadow-lg border border-[var(--color-border)] p-8 text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <Package className="w-16 h-16 text-[var(--color-text-secondary)] mx-auto mb-4" />
          <h3 className="text-2xl font-bold text-[var(--color-text)] mb-4">{t("orders.noOrders")}</h3>
          <p className="text-[var(--color-text-secondary)] mb-6">لا توجد طلبات في النظام حالياً</p>
          <button 
            onClick={fetchOrders}
            className="bg-gradient-to-r from-[var(--color-electric)] to-[var(--color-accent)] text-white px-6 py-3 rounded-xl hover:opacity-90 transition-all duration-200 shadow-md"
          >
            إعادة تحميل الطلبات
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-8 px-4">
      <motion.div
        className="max-w-7xl mx-auto"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {/* Header */}
        <div className="mb-8 text-center">
          <motion.h1 
            className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-[var(--color-electric)] to-[var(--color-accent)] bg-clip-text text-transparent mb-2"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            {t("orders.title")}
          </motion.h1>
          <motion.p 
            className="text-[var(--color-text-secondary)]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            {t("orders.subtitle")}
          </motion.p>
        </div>

        {/* Statistics Cards */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <div className="bg-[var(--color-bg-opacity)] backdrop-blur-xl rounded-2xl p-6 border border-[var(--color-border)] shadow-sm">
            <div className="text-2xl font-bold text-[var(--color-text)] mb-2">
              {orders.length}
            </div>
            <div className="text-[var(--color-text-secondary)] text-sm">
              إجمالي الطلبات
            </div>
          </div>
          
          <div className="bg-[var(--color-bg-opacity)] backdrop-blur-xl rounded-2xl p-6 border border-[var(--color-border)] shadow-sm">
            <div className="text-2xl font-bold text-[var(--color-text)] mb-2">
              {orders.filter(o => o.isConfirmed).length}
            </div>
            <div className="text-[var(--color-text-secondary)] text-sm">
              الطلبات المؤكدة
            </div>
          </div>
          
          <div className="bg-[var(--color-bg-opacity)] backdrop-blur-xl rounded-2xl p-6 border border-[var(--color-border)] shadow-sm">
            <div className="text-2xl font-bold text-[var(--color-text)] mb-2">
              {orders.filter(o => !o.isConfirmed).length}
            </div>
            <div className="text-[var(--color-text-secondary)] text-sm">
              الطلبات المعلقة
            </div>
          </div>
          
          <div className="bg-[var(--color-bg-opacity)] backdrop-blur-xl rounded-2xl p-6 border border-[var(--color-border)] shadow-sm">
            <div className="text-2xl font-bold text-[var(--color-text)] mb-2">
              {filteredSortedOrders.length}
            </div>
            <div className="text-[var(--color-text-secondary)] text-sm">
              الطلبات المفلترة
            </div>
          </div>
        </motion.div>

        {/* Filters Section */}
        <motion.div
          className="bg-[var(--color-bg-opacity)] backdrop-blur-xl rounded-2xl shadow-lg border border-[var(--color-border)] p-6 mb-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
            {/* Search Input */}
            <div className="relative flex-1 w-full">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[var(--color-text-secondary)] w-5 h-5" />
              <input
                type="text"
                placeholder={`${t("orders.searchBy")} ${searchFields[searchTypeIndex].label}`}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-[var(--color-bg)] border border-[var(--color-border)] rounded-xl text-[var(--color-text)] placeholder-[var(--color-text-secondary)] focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)] focus:border-transparent transition-all duration-200"
              />
            </div>

            {/* Filters */}
            <div className="flex flex-wrap gap-3 items-center">
              {/* Select All */}
              <label className={`inline-flex gap-2 items-center cursor-pointer select-none rounded-xl px-4 py-3 transition-all duration-200 ${
                selectAll 
                  ? "bg-gradient-to-r from-[var(--color-electric)] to-[var(--color-accent)] text-white shadow-md" 
                  : "bg-[var(--color-bg)] border border-[var(--color-border)] text-[var(--color-text)] hover:border-[var(--color-accent)]"
              }`}>
                <input
                  type="checkbox"
                  className="peer w-5 h-5 appearance-none rounded cursor-pointer checked:bg-white focus:outline-none transition-colors"
                  checked={selectAll}
                  onChange={(e) => {
                    const checked = e.target.checked;
                    setSelectAll(checked);
                    setSelectedOrders(checked? filteredSortedOrders.map(o => o._id): []);
                    setIsSelectionMode(checked);
                  }}
                />
                <span className="absolute w-5 h-5 flex items-center justify-center pointer-events-none">
                  <CheckCheck className={`${selectAll? 'text-[var(--color-electric)]': 'text-transparent'}`} />
                </span>
                <span>{t("orders.selectAll")}</span>
              </label>

              {/* Status Filter */}
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="bg-[var(--color-bg)] border border-[var(--color-border)] text-[var(--color-text)] rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)] focus:border-transparent transition-all duration-200 min-w-[180px]"
              >
                <option value="all">{t("orders.all")}</option>
                <option value="confirmed">{t("orders.confirmed")}</option>
                <option value="unconfirmed">{t("orders.pending")}</option>
              </select>

              {/* State Filter */}
              <select
                value={stateFilter}
                onChange={(e) => setStateFilter(e.target.value)}
                className="bg-[var(--color-bg)] border border-[var(--color-border)] text-[var(--color-text)] rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)] focus:border-transparent transition-all duration-200 min-w-[180px]"
              >
                <option value="all">كل الولايات</option>
                <option value="16 - الجزائر">16 - الجزائر</option>
                <option value="31 - وهران">31 - وهران</option>
                <option value="25 - قسنطينة">25 - قسنطينة</option>
                <option value="19 - سطيف">19 - سطيف</option>
                <option value="9 - البليدة">9 - البليدة</option>
                <option value="35 - بومرداس">35 - بومرداس</option>
                <option value="42 - تيبازة">42 - تيبازة</option>
                <option value="27 - مستغانم">27 - مستغانم</option>
                <option value="29 - معسكر">29 - معسكر</option>
                <option value="48 - غليزان">48 - غليزان</option>
              </select>

              {/* Sort Order */}
              <button
                onClick={() => setSortOrder(sortOrder === 'desc'? 'asc': 'desc')}
                className={`flex items-center gap-2 px-4 py-3 rounded-xl font-medium transition-all duration-200 ${
                  sortOrder !== 'desc'
                    ? "bg-gradient-to-r from-[var(--color-electric)] to-[var(--color-accent)] text-white shadow-md"
                    : "bg-[var(--color-bg)] border border-[var(--color-border)] text-[var(--color-text)] hover:border-[var(--color-accent)]"
                }`}
              >
                <Filter className="w-4 h-4" />
                {sortOrder === 'desc' ? 'الأحدث أولاً' : 'الأقدم أولاً'}
              </button>

              {/* Search Type Toggle */}
              <button
                onClick={() => setSearchTypeIndex((prev) => (prev + 1) % searchFields.length)}
                className="flex items-center gap-2 px-4 py-3 bg-gradient-to-r from-[var(--color-electric)] to-[var(--color-accent)] text-white rounded-xl hover:opacity-90 transition-all duration-200 shadow-md"
                title={t("orders.changeSearch")}
              >
                {(() => {
                  const IconComponent = searchFields[searchTypeIndex].icon;
                  return <IconComponent className="w-4 h-4" />;
                })()}
                {searchFields[searchTypeIndex].label}
              </button>
            </div>
          </div>

          {/* Results Count */}
          <div className="mt-4 text-sm text-[var(--color-text-secondary)]">
            عرض {filteredSortedOrders.length} من أصل {orders.length} طلب
          </div>
        </motion.div>

        {/* Selection Actions */}
        {selectedOrders.length > 0 && (
          <motion.div 
            className="bg-gradient-to-r from-[var(--color-electric)] to-[var(--color-accent)] text-white p-4 rounded-2xl mb-6 shadow-lg"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <p className="text-sm font-medium">
                {t("orders.selected", { count: selectedOrders.length })}
              </p>
              
              <div className="flex flex-wrap gap-2">
                <motion.button
                  onClick={toggleConfirmation}
                  className={`px-4 py-2 rounded-xl text-sm font-medium flex items-center gap-2 transition-all duration-200 ${
                    hasMixedStatus
                      ? "bg-[var(--color-border)] cursor-not-allowed"
                      : allConfirmed
                        ? "bg-yellow-600 hover:bg-yellow-700"
                        : "bg-green-600 hover:bg-green-700"
                  }`}
                  disabled={hasMixedStatus}
                  whileHover={{ scale: hasMixedStatus ? 1 : 1.05 }}
                  whileTap={{ scale: hasMixedStatus ? 1 : 0.95 }}
                >
                  <CheckCircle className="h-4 w-4" />
                  {allConfirmed ? t("orders.unconfirmSelected") : t("orders.confirmSelected")}
                </motion.button>

                <motion.button
                  onClick={() => setShowPopup(true)}
                  className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-xl text-sm font-medium flex items-center gap-2 transition-all duration-200"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Trash className="h-4 w-4" />
                  {t("orders.deleteSelected")}
                </motion.button>

                <motion.button
                  onClick={() => {
                    setSelectedOrders([]);
                    setSelectAll(false);
                    setIsSelectionMode(false);
                  }}
                  className="bg-[var(--color-bg-gray)] hover:bg-[var(--color-border)] text-[var(--color-text)] px-4 py-2 rounded-xl text-sm font-medium flex items-center gap-2 transition-all duration-200"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <XCircle className="h-4 w-4" />
                  {t("orders.cancelSelection")}
                </motion.button>
              </div>
            </div>
          </motion.div>
        )}

        {/* Orders Table */}
        <motion.div
          className="bg-[var(--color-bg-opacity)] backdrop-blur-xl rounded-2xl shadow-lg border border-[var(--color-border)] overflow-hidden"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead className="bg-[var(--color-bg-gray)]">
                <tr>
                  <th className="px-6 py-4 text-left font-semibold text-[var(--color-text)] uppercase tracking-wider">
                    {t("orders.headers.num")}
                  </th>
                  <th className="px-6 py-4 text-left font-semibold text-[var(--color-text)] uppercase tracking-wider">
                    {t("orders.headers.customer")}
                  </th>
                  <th className="px-6 py-4 text-left font-semibold text-[var(--color-text)] uppercase tracking-wider">
                    {t("orders.headers.phone")}
                  </th>
                  <th className="px-6 py-4 text-left font-semibold text-[var(--color-text)] uppercase tracking-wider">
                    {t("orders.headers.wilaya")}
                  </th>
                  <th className="px-6 py-4 text-left font-semibold text-[var(--color-text)] uppercase tracking-wider">
                    {t("orders.headers.status")}
                  </th>
                  <th className="px-6 py-4 text-left font-semibold text-[var(--color-text)] uppercase tracking-wider">
                    التاريخ
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--color-border)]">
                {Array.isArray(filteredSortedOrders) && filteredSortedOrders.map((order, index) => (
                  <motion.tr 
                    key={order?._id}
                    onClick={(e) => handleRowClick(order, e)}
                    onMouseDown={() => handleLongPressStart(order._id)}
                    onMouseUp={handleLongPressEnd}
                    onMouseLeave={handleLongPressCancel}
                    onTouchStart={() => handleLongPressStart(order._id)}
                    onTouchEnd={handleLongPressEnd}
                    onTouchMove={handleLongPressCancel}
                    className={`transition-all duration-200 cursor-pointer ${
                      selectedOrders.includes(order?._id) 
                        ? 'bg-[var(--color-accent)]/10' 
                        : 'hover:bg-[var(--color-bg-gray)]'
                    }`}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 * index }}
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className={`w-3 h-3 rounded-full transition-all duration-200 ${
                          selectedOrders.includes(order?._id) 
                            ? 'bg-[var(--color-accent)]' 
                            : 'bg-[var(--color-border)]'
                        }`} />
                        <span className="font-mono text-sm font-semibold text-[var(--color-text)]">
                          {searchTypeIndex === 0 ? highlightText(order?.orderNumber, searchQuery, true) : order?.orderNumber}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <User className="w-4 h-4 text-[var(--color-text-secondary)]" />
                        <span className="text-[var(--color-text)]">
                          {searchTypeIndex === 1 ? highlightText(order?.fullName, searchQuery, true) : order?.fullName}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <Phone className="w-4 h-4 text-[var(--color-text-secondary)]" />
                        <span className="text-[var(--color-text)]">
                          {searchTypeIndex === 2 ? highlightText(order?.phoneNumber, searchQuery, true) : order?.phoneNumber}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <MapPin className="w-4 h-4 text-[var(--color-text-secondary)]" />
                        <span className="text-[var(--color-text)]">{order?.wilaya}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <motion.div
                        className={`inline-flex items-center gap-2 px-3 py-1 rounded-full font-semibold text-sm ${
                          order?.isConfirmed
                            ? "bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-300 border border-green-200 dark:border-green-700"
                            : "bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-300 border border-yellow-200 dark:border-yellow-700"
                        }`}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        {order?.isConfirmed ? (
                          <>
                            <CheckCircle className="h-4 w-4" />
                            <span>{t("orders.confirmed")}</span>
                          </>
                        ) : (
                          <>
                            <XCircle className="h-4 w-4" />
                            <span>{t("orders.pending")}</span>
                          </>
                        )}
                      </motion.div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <Calendar className="w-4 h-4 text-[var(--color-text-secondary)]" />
                        <span className="text-sm text-[var(--color-text-secondary)]">
                          {dayjs(order?.createdAt).format("DD/MM/YYYY")}
                        </span>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>
      </motion.div>

      {/* Order Details Modal */}
      <OrderDetailsModal
        selectedOrder={selectedOrder}
        setSelectedOrder={setSelectedOrder}
        colorsList={colorsList}
        navigate={navigate}
        isRTL={isRTL}
        t={t}
      />

      {/* Delete Confirmation Modal */}
      <DeleteConfirmationModal
        showPopup={showPopup}
        setShowPopup={setShowPopup}
        selectedOrderId={selectedOrderId}
        selectedOrders={selectedOrders}
        handleDelete={handleDelete}
        t={t}
      />
    </div>
  );
};

// Order Details Modal Component
const OrderDetailsModal = ({ selectedOrder, setSelectedOrder, colorsList, navigate, isRTL, t }) => {
  if (!selectedOrder) return null;

  const getFullColorData = (colorId) => {
    if (!colorId) return null;
    return colorsList.find(c => c._id === colorId) || 
    { _id: colorId, name: colorId, hex: '#cccccc' };
  };

  const copyToClipboard = (text) => {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text)
        .then(() => toast.success(t("orders.copyPhone")))
        .catch(() => {
          const tempInput = document.createElement("input");
          tempInput.value = text;
          document.body.appendChild(tempInput);
          tempInput.select();
          document.execCommand("copy");
          document.body.removeChild(tempInput);
          toast.success(t("orders.copyPhone"));
        });
    } else {
      const tempInput = document.createElement("input");
      tempInput.value = text;
      document.body.appendChild(tempInput);
      tempInput.select();
      document.execCommand("copy");
      document.body.removeChild(tempInput);
      toast.success(t("orders.copyPhone"));
    }
  };

  return createPortal(
    <AnimatePresence>
      {selectedOrder && (
        <motion.div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className="bg-[var(--color-bg)] rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto border border-[var(--color-border)]"
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0.8 }}
          >
            {/* Header */}
            <div className="p-6 border-b border-[var(--color-border)] flex justify-between items-center bg-gradient-to-r from-[var(--color-electric)]/10 to-[var(--color-accent)]/10 rounded-t-2xl">
              <h3 className="text-xl font-bold text-[var(--color-text)] flex items-center gap-2">
                <Package className="w-6 h-6" />
                {t("orders.detailsTitle")}
              </h3>
              <button
                onClick={() => setSelectedOrder(null)}
                className="p-2 rounded-xl text-[var(--color-text-secondary)] hover:text-[var(--color-text)] hover:bg-[var(--color-bg-gray)] transition-all"
              >
                <XCircle size={24} />
              </button>
            </div>

            {/* Content */}
            <div className="p-6 space-y-6">
              {/* Order Summary */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <DetailCard 
                  icon={Hash}
                  label={t("orders.fields.orderNumber")}
                  value={selectedOrder.orderNumber}
                />
                <DetailCard 
                  icon={User}
                  label={t("orders.fields.customer")}
                  value={selectedOrder.fullName}
                />
                <DetailCard 
                  icon={Phone}
                  label={t("orders.fields.phone")}
                  value={selectedOrder.phoneNumber}
                  onCopy={() => copyToClipboard(selectedOrder.phoneNumber)}
                />
                <DetailCard 
                  icon={MapPin}
                  label={t("orders.fields.wilaya")}
                  value={selectedOrder.wilaya}
                />
                <DetailCard 
                  icon={MapPin}
                  label={t("orders.fields.baladia")}
                  value={selectedOrder.baladia}
                />
                <DetailCard 
                  icon={Calendar}
                  label={t("orders.fields.date")}
                  value={dayjs(selectedOrder.createdAt).format("HH:mm YYYY/MM/DD")}
                />
                <DetailCard 
                  icon={CheckCircle}
                  label={t("orders.fields.status")}
                  value={selectedOrder.isConfirmed ? t("orders.confirmed") : t("orders.pending")}
                  highlight={selectedOrder.isConfirmed}
                />
                <DetailCard 
                  icon={DollarSign}
                  label={t("orders.fields.total")}
                  value={`${selectedOrder.totalAmount} ${t("analytics.revenueUnit")}`}
                />
                <DetailCard 
                  icon={Truck}
                  label={t("orders.fields.deliveryPrice")}
                  value={`${selectedOrder.deliveryPrice} ${t("analytics.revenueUnit")}`}
                />
              </div>

              {/* Additional Details */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-[var(--color-bg-gray)] rounded-xl p-4">
                  <h4 className="font-semibold text-[var(--color-text)] mb-3 flex items-center gap-2">
                    <Info className="w-4 h-4" />
                    معلومات إضافية
                  </h4>
                  <div className="space-y-2 text-sm">
                    <p>
                      <span className="font-medium">مكان التسليم:</span>{' '}
                      {selectedOrder.deliveryPlace === "home" ? t("orders.deliveryOptions.home") : t("orders.deliveryOptions.office")}
                    </p>
                    <p>
                      <span className="font-medium">الكوبون:</span>{' '}
                      {selectedOrder.coupon ? `${selectedOrder.coupon.code} ${t("giftCoupon.discount", { amount: selectedOrder.coupon.discountAmount })}` : t("لا يوجد")}
                    </p>
                    {selectedOrder.confirmedAt && (
                      <p>
                        <span className="font-medium">تم التأكيد في:</span>{' '}
                        {dayjs(selectedOrder.confirmedAt).format("HH:mm YYYY/MM/DD")}
                      </p>
                    )}
                  </div>
                </div>

                {/* Note */}
                <div className="bg-[var(--color-bg-gray)] rounded-xl p-4">
                  <h4 className="font-semibold text-[var(--color-text)] mb-3 flex items-center gap-2">
                    <MessageSquare className="w-4 h-4" />
                    {t("orders.fields.note")}
                  </h4>
                  <p className="text-sm text-[var(--color-text-secondary)]">
                    {selectedOrder.note || t("orders.fields.noNote")}
                  </p>
                </div>
              </div>

              {/* Products */}
              <div>
                <h4 className="font-semibold text-[var(--color-text)] mb-4 text-lg flex items-center gap-2">
                  <Package className="w-5 h-5" />
                  {t("orders.fields.products")}
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {Array.isArray(selectedOrder.products) && selectedOrder.products.map((item, idx) => {
                    const colorObj = getFullColorData(item?.selectedColor);
                    
                    return (
                      <motion.div
                        key={idx}
                        className="flex gap-4 items-center bg-[var(--color-bg)] p-4 rounded-xl border border-[var(--color-border)] cursor-pointer hover:shadow-md transition-all duration-200"
                        onClick={() => {
                          if (item?.product?._id) {
                            navigate(`/product/${item.product._id}`);
                          } else {
                            toast.error(t("orders.fields.noImage"));
                          }
                        }}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        {/* Product Image */}
                        {item?.product?.images && item.product.images.length > 0 ? (
                          <img
                            src={item.product.images[0]}
                            alt={item.product.name}
                            className="w-20 h-20 rounded-xl object-cover border border-[var(--color-border)]"
                          />
                        ) : (
                          <div className="w-20 h-20 rounded-xl bg-[var(--color-bg-gray)] flex items-center justify-center border border-[var(--color-border)]">
                            <Package className="w-8 h-8 text-[var(--color-text-secondary)]" />
                          </div>
                        )}

                        <div className="flex-1 min-w-0">
                          <p className="font-semibold text-[var(--color-text)] text-lg leading-tight truncate">
                            {item?.product?.name || t("orders.fields.product")}
                          </p>
                          
                          <div className="flex items-center justify-between mt-2">
                            <p className="text-lg font-bold text-green-600 dark:text-green-400">
                              {(item?.price || 0).toLocaleString()} {t("analytics.revenueUnit")}
                            </p>
                            <p className="text-sm text-[var(--color-text-secondary)]">
                              × {item?.quantity || 1}
                            </p>
                          </div>

                          {/* Size and Color */}
                          <div className="flex items-center gap-2 mt-3 flex-wrap">
                            {item?.selectedSize && (
                              <span className="text-xs font-semibold bg-[var(--color-accent)]/10 text-[var(--color-accent)] px-3 py-1 rounded-full">
                                {item.selectedSize}
                              </span>
                            )}
                            {colorObj && (
                              <div className="flex items-center gap-2">
                                <span
                                  className="w-4 h-4 rounded-full border border-[var(--color-border)]"
                                  style={{ backgroundColor: colorObj.hex }}
                                  title={colorObj.name}
                                />
                                <span className="text-xs text-[var(--color-text-secondary)]">
                                  {colorObj.name}
                                </span>
                              </div>
                            )}
                          </div>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
                
                {(!Array.isArray(selectedOrder.products) || selectedOrder.products.length === 0) && (
                  <div className="text-center py-8 text-[var(--color-text-secondary)]">
                    <Package className="w-12 h-12 mx-auto mb-3 opacity-50" />
                    {t("orders.noProducts")}
                  </div>
                )}
              </div>
            </div>

            {/* Footer */}
            <div className="p-6 border-t border-[var(--color-border)] flex justify-center">
              <button
                onClick={() => setSelectedOrder(null)}
                className="px-8 py-3 bg-[var(--color-bg-gray)] hover:bg-[var(--color-border)] text-[var(--color-text)] rounded-xl font-medium transition-all duration-200"
              >
                {t("orders.fields.close")}
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body
  );
};

// Detail Card Component
const DetailCard = ({ icon: Icon, label, value, onCopy, highlight = false }) => (
  <div className="bg-[var(--color-bg)] rounded-xl p-4 border border-[var(--color-border)]">
    <div className="flex items-center gap-3 mb-2">
      <Icon className={`w-5 h-5 ${highlight ? 'text-green-500' : 'text-[var(--color-text-secondary)]'}`} />
      <span className="text-sm font-medium text-[var(--color-text-secondary)]">{label}</span>
    </div>
    <div className="flex items-center justify-between">
      <span className={`text-lg font-semibold ${highlight ? 'text-green-600 dark:text-green-400' : 'text-[var(--color-text)]'}`}>
        {value}
      </span>
      {onCopy && (
        <button
          onClick={onCopy}
          className="p-2 text-[var(--color-text-secondary)] hover:text-[var(--color-accent)] transition-colors duration-200"
          title="نسخ"
        >
          <Copy className="w-4 h-4" />
        </button>
      )}
    </div>
  </div>
);

// Delete Confirmation Modal Component
const DeleteConfirmationModal = ({ showPopup, setShowPopup, selectedOrderId, selectedOrders, handleDelete, t }) => {
  if (!showPopup) return null;

  return createPortal(
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <motion.div
          className="bg-[var(--color-bg)] rounded-2xl shadow-2xl p-6 w-96 border border-[var(--color-border)]"
          initial={{ scale: 0.8 }}
          animate={{ scale: 1 }}
          exit={{ scale: 0.8 }}
        >
          <div className="text-center mb-4">
            <Trash className="w-12 h-12 text-red-500 mx-auto mb-3" />
            <h3 className="text-xl font-bold text-[var(--color-text)] mb-2">
              {t("orders.confirmDelete")}
            </h3>
            <p className="text-[var(--color-text-secondary)]">
              {selectedOrderId
                ? t("orders.confirmSingle")
                : t("orders.confirmMultiple", { count: selectedOrders.length })}
            </p>
          </div>
          <div className="flex justify-center gap-4">
            <button
              onClick={handleDelete}
              className="px-6 py-3 bg-red-500 hover:bg-red-600 text-white rounded-xl font-medium transition-all duration-200 shadow-md"
            >
              {t("orders.confirmYes")}
            </button>
            <button
              onClick={() => { setShowPopup(false); setSelectedOrderId(null); }}
              className="px-6 py-3 bg-[var(--color-bg-gray)] hover:bg-[var(--color-border)] text-[var(--color-text)] rounded-xl font-medium transition-all duration-200"
            >
              {t("orders.confirmCancel")}
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>,
    document.body
  );
};

// Missing Icons
const DollarSign = ({ className }) => <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" /></svg>;
const Truck = ({ className }) => <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17a2 2 0 11-4 0 2 2 0 014 0zm10 0a2 2 0 11-4 0 2 2 0 014 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h1m8-1a1 1 0 01-1 1H9m4-1V8a1 1 0 011-1h2.586a1 1 0 01.707.293l3.414 3.414a1 1 0 01.293.707V16a1 1 0 01-1 1h-1m-6-1a1 1 0 001 1h1M5 17a2 2 0 104 0m-4 0a2 2 0 114 0m6 0a2 2 0 104 0m-4 0a2 2 0 114 0" /></svg>;
const Info = ({ className }) => <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>;
const MessageSquare = ({ className }) => <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" /></svg>;

export default OrderList;