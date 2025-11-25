import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { PlusCircle, Trash2, ImagePlus, X, ArrowLeft, ArrowRight, Search, Save, Building2, Home, Hourglass, Settings, Palette, Ruler, FolderOpen, Truck, Calculator } from "lucide-react";
import toast from "react-hot-toast";
import useSettingStore from "../stores/useSettingStore";
import { createPortal } from "react-dom";
import { useTranslation } from "react-i18next";
import LoadingSpinner from "./LoadingSpinner";

const SettingsManager = () => {
  const {
    categories,
    sizesLetters,
    sizesNumbers,
    colorsList,
    loadingMeta,
    fetchMetaData,
    createCategory,
    deleteCategory,
    createSize,
    deleteSize,
    createColor,
    deleteColor,
  } = useSettingStore();

  const [newCategory, setNewCategory] = useState({ name: "", image: null });
  const [newSize, setNewSize] = useState({ type: "letters", value: "" });
  const [newColor, setNewColor] = useState({ name: "", hex: "#000000" });
  const [isLoading, setIsLoading] = useState(true);

  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === "ar";

  useEffect(() => {
    fetchMetaData();
    setIsLoading(false)
  }, [fetchMetaData]);

  const [categoryImageUrl, setCategoryImageUrl] = useState(null);
  useEffect(() => {
    if (newCategory.image) {
      const url = URL.createObjectURL(newCategory.image);
      setCategoryImageUrl(url);
      return () => URL.revokeObjectURL(url);
    } else {
      setCategoryImageUrl(null);
    }
  }, [newCategory.image]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setNewCategory((prev) => ({ ...prev, image: file }));
    }
  };

  const handleAddCategory = async (e) => {
    e.preventDefault();
    try {
      await createCategory(newCategory);
      toast.success(t('success_to_add_category'));
      setNewCategory({ name: "", image: null });
    } catch (error) {
      toast.error(t("failed_to_add_category"));
    }
  };

  const handleAddSize = async (e) => {
    e.preventDefault();
    try {
      await createSize({
        type: newSize.type,
        value: newSize.value
      });
      setNewSize({ type: newSize.type, value: "" });
      toast.success(t("success_to_add_size"));
    } catch (error) {
      toast.error(t("failed_to_add_size"));
    }
  };

  const handleAddColor = async (e) => {
    e.preventDefault();
    try {
      await createColor(newColor);
      setNewColor({ name: "", hex: "#000000" });
      toast.success(t("success_to_add_color"));
    } catch (error) {
      toast.error(t("failed_to_add_color"));
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-purple-50 dark:from-gray-900 dark:to-gray-800">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 dark:from-gray-900 dark:to-gray-800 py-8 px-4">
      <motion.div
        className="max-w-6xl mx-auto"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {/* Header */}
        <div className="mb-8 text-center">
          <motion.h1 
            className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            {t("settings.title")}
          </motion.h1>
          <motion.p 
            className="text-gray-600 dark:text-gray-300"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            {t("settings.subtitle")}
          </motion.p>
        </div>

        {/* Categories Section */}
        <motion.div
          className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 p-6 mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-6 flex items-center gap-3">
            <FolderOpen className="w-7 h-7 text-blue-500" />
            {t("categories")}
          </h2>

          {/* Add Category Form */}
          <form onSubmit={handleAddCategory} className="flex flex-col lg:flex-row gap-4 items-end mb-8">
            <div className="flex-1 grid grid-cols-1 lg:grid-cols-3 gap-4">
              {/* Category Name */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  {t("category_name")}
                </label>
                <input
                  type="text"
                  placeholder={t("category_name")}
                  value={newCategory.name}
                  onChange={(e) =>
                    setNewCategory((prev) => ({ ...prev, name: e.target.value }))
                  }
                  className="w-full bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-xl py-3 px-4 text-gray-800 dark:text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  disabled={loadingMeta}
                  required
                />
              </div>

              {/* Image Upload */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  {t("upload_image")}
                </label>
                <label
                  htmlFor="category-image"
                  className={`flex items-center justify-center gap-2 w-full py-3 px-4 rounded-xl cursor-pointer text-white font-medium transition-all duration-200 ${
                    newCategory.image 
                      ? "bg-green-500 hover:bg-green-600" 
                      : "bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600"
                  }`}
                >
                  <ImagePlus className="w-5 h-5" />
                  {newCategory.image ? t("image_selected") : t("upload_image")}
                </label>
                <input
                  id="category-image"
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                  disabled={loadingMeta}
                  required
                />
              </div>

              {/* Image Preview */}
              {categoryImageUrl && (
                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                    {t("image_preview")}
                  </label>
                  <img
                    src={categoryImageUrl}
                    alt={t("image_preview")}
                    className="w-16 h-16 rounded-xl object-cover border-2 border-blue-500 shadow-md"
                  />
                </div>
              )}
            </div>

            <motion.button
              type="submit"
              className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white py-3 px-6 rounded-xl font-semibold transition-all duration-200 disabled:opacity-50 flex items-center gap-2 shadow-md"
              disabled={loadingMeta || !newCategory.name || !newCategory.image}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <PlusCircle className="w-5 h-5" />
              {t("add")}
            </motion.button>
          </form>

          {/* Categories List */}
          <div>
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">
              {t("existing_categories")} ({categories.length})
            </h3>
            {categories.length === 0 ? (
              <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                <FolderOpen className="w-12 h-12 mx-auto mb-3 opacity-50" />
                {t("no_categories_found")}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {categories.map((cat, index) => (
                  cat && (
                    <motion.div
                      key={cat._id}
                      className="bg-white dark:bg-gray-700 rounded-xl p-4 border border-gray-200 dark:border-gray-600 shadow-sm hover:shadow-md transition-all duration-200"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.1 * index }}
                    >
                      <div className="flex items-center gap-4">
                        {cat.imageUrl && (
                          <img
                            src={cat.imageUrl}
                            alt={cat.name}
                            className="w-16 h-16 rounded-xl object-cover border border-gray-300 dark:border-gray-500"
                          />
                        )}
                        <div className="flex-1 min-w-0">
                          <h4 className="font-semibold text-gray-800 dark:text-white text-lg truncate">
                            {cat.name}
                          </h4>
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            ID: {cat._id.slice(-6)}
                          </p>
                        </div>
                        <motion.button
                          onClick={async () => {
                            await deleteCategory(cat._id);
                            toast.success(t("delete_category_done"));
                          }}
                          className="p-2 text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-xl transition-all duration-200"
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          disabled={loadingMeta}
                        >
                          <Trash2 className="w-5 h-5" />
                        </motion.button>
                      </div>
                    </motion.div>
                  )
                ))}
              </div>
            )}
          </div>
        </motion.div>

        {/* Sizes and Colors Section */}
        <motion.div
          className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 p-6 mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-6 flex items-center gap-3">
            <Ruler className="w-7 h-7 text-purple-500" />
            {t("sizes_and_colors")}
          </h2>

          {/* Add Size and Color Forms */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            {/* Add Size Form */}
            <div className="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-4">
              <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4 flex items-center gap-2">
                <Ruler className="w-5 h-5 text-blue-500" />
                {t("add_size")}
              </h3>
              <form onSubmit={handleAddSize} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <select
                    value={newSize.type}
                    onChange={(e) =>
                      setNewSize((prev) => ({ ...prev, type: e.target.value }))
                    }
                    className="bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-xl py-3 px-4 text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                    disabled={loadingMeta}
                  >
                    <option value="letters">{t("letters")}</option>
                    <option value="numbers">{t("numbers")}</option>
                  </select>
                  <input
                    type="text"
                    placeholder={t("size_value")}
                    value={newSize.value}
                    onChange={(e) =>
                      setNewSize((prev) => ({ ...prev, value: e.target.value }))
                    }
                    className="bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-xl py-3 px-4 text-gray-800 dark:text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                    disabled={loadingMeta}
                    required
                  />
                </div>
                <motion.button
                  type="submit"
                  className="w-full bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white py-3 px-4 rounded-xl font-semibold transition-all duration-200 disabled:opacity-50 flex items-center justify-center gap-2 shadow-md"
                  disabled={loadingMeta || !newSize.value}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <PlusCircle className="w-5 h-5" />
                  {t("add_size")}
                </motion.button>
              </form>
            </div>

            {/* Add Color Form */}
            <div className="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-4">
              <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4 flex items-center gap-2">
                <Palette className="w-5 h-5 text-green-500" />
                {t("add_color")}
              </h3>
              <form onSubmit={handleAddColor} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <input
                    type="text"
                    placeholder={t("color_name")}
                    value={newColor.name}
                    onChange={(e) =>
                      setNewColor((prev) => ({ ...prev, name: e.target.value }))
                    }
                    className="bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-xl py-3 px-4 text-gray-800 dark:text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                    disabled={loadingMeta}
                    required
                  />
                  <div className="flex items-center gap-3">
                    <input
                      type="color"
                      value={newColor.hex}
                      onChange={(e) =>
                        setNewColor((prev) => ({ ...prev, hex: e.target.value }))
                      }
                      className="w-12 h-12 rounded-xl cursor-pointer border border-gray-300 dark:border-gray-600 shadow-md"
                      disabled={loadingMeta}
                    />
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      {newColor.hex}
                    </span>
                  </div>
                </div>
                <motion.button
                  type="submit"
                  className="w-full bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white py-3 px-4 rounded-xl font-semibold transition-all duration-200 disabled:opacity-50 flex items-center justify-center gap-2 shadow-md"
                  disabled={loadingMeta || !newColor.name}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <PlusCircle className="w-5 h-5" />
                  {t("add_color")}
                </motion.button>
              </form>
            </div>
          </div>

          {/* Sizes and Colors Lists */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Letter Sizes */}
            <div className="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-4">
              <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4 flex items-center gap-2">
                <Ruler className="w-5 h-5 text-blue-500" />
                {t("letters")} ({sizesLetters.length})
              </h3>
              {sizesLetters.length === 0 ? (
                <p className="text-center text-gray-500 dark:text-gray-400 py-4">
                  {t("no_letter_sizes")}
                </p>
              ) : (
                <div className="flex flex-wrap gap-2">
                  {sizesLetters.map((size, index) => (
                    size && (
                      <motion.div
                        key={size._id}
                        className="flex items-center gap-2 bg-white dark:bg-gray-700 rounded-full px-3 py-2 shadow-sm border border-gray-200 dark:border-gray-600"
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.05 * index }}
                      >
                        <span className="text-sm font-medium text-gray-800 dark:text-white">
                          {size.name}
                        </span>
                        <motion.button
                          onClick={async () => {
                            await deleteSize(size._id);
                            toast.success(t("delete_size_done"));
                          }}
                          className="text-red-500 hover:text-red-600 transition-colors duration-200"
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          disabled={loadingMeta}
                        >
                          <Trash2 className="w-4 h-4" />
                        </motion.button>
                      </motion.div>
                    )
                  ))}
                </div>
              )}
            </div>

            {/* Number Sizes */}
            <div className="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-4">
              <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4 flex items-center gap-2">
                <Ruler className="w-5 h-5 text-green-500" />
                {t("numbers")} ({sizesNumbers.length})
              </h3>
              {sizesNumbers.length === 0 ? (
                <p className="text-center text-gray-500 dark:text-gray-400 py-4">
                  {t("no_number_sizes")}
                </p>
              ) : (
                <div className="flex flex-wrap gap-2">
                  {sizesNumbers.map((size, index) => (
                    size && (
                      <motion.div
                        key={size._id}
                        className="flex items-center gap-2 bg-white dark:bg-gray-700 rounded-full px-3 py-2 shadow-sm border border-gray-200 dark:border-gray-600"
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.05 * index }}
                      >
                        <span className="text-sm font-medium text-gray-800 dark:text-white">
                          {size.name}
                        </span>
                        <motion.button
                          onClick={async () => {
                            await deleteSize(size._id);
                            toast.success(t("delete_size_done"));
                          }}
                          className="text-red-500 hover:text-red-600 transition-colors duration-200"
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          disabled={loadingMeta}
                        >
                          <Trash2 className="w-4 h-4" />
                        </motion.button>
                      </motion.div>
                    )
                  ))}
                </div>
              )}
            </div>

            {/* Colors */}
            <div className="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-4">
              <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4 flex items-center gap-2">
                <Palette className="w-5 h-5 text-purple-500" />
                {t("colors")} ({colorsList.length})
              </h3>
              {colorsList.length === 0 ? (
                <p className="text-center text-gray-500 dark:text-gray-400 py-4">
                  {t("no_colors")}
                </p>
              ) : (
                <div className="flex flex-wrap gap-3">
                  {colorsList.map((color, index) => (
                    color && (
                      <motion.div
                        key={color._id}
                        className="flex items-center gap-2 bg-white dark:bg-gray-700 rounded-full px-3 py-2 shadow-sm border border-gray-200 dark:border-gray-600"
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.05 * index }}
                      >
                        <span
                          className="w-4 h-4 rounded-full border border-gray-300 shadow-sm"
                          style={{ backgroundColor: color.hex }}
                        />
                        <span className="text-sm font-medium text-gray-800 dark:text-white">
                          {color.name}
                        </span>
                        <motion.button
                          onClick={async () => {
                            await deleteColor(color._id);
                            toast.success(t("delete_color_done"));
                          }}
                          className="text-red-500 hover:text-red-600 transition-colors duration-200"
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          disabled={loadingMeta}
                        >
                          <Trash2 className="w-4 h-4" />
                        </motion.button>
                      </motion.div>
                    )
                  ))}
                </div>
              )}
            </div>
          </div>
        </motion.div>

        {/* Other Settings */}
        <SomeComponent/>
      </motion.div>
    </div>
  );
};

export default SettingsManager;

const DeliverySettingsPopup = ({ onClose, settings, handleChange, handleSubmit, DeliveryDaysSelector, t }) => {
  const [search, setSearch] = useState("");

  const filteredSettings = settings.filter(({ state }) =>
    state.toLowerCase().includes(search.toLowerCase())
  );

  return createPortal(
    <div
      className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <AnimatePresence>
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          transition={{ duration: 0.3 }}
          onClick={(e) => e.stopPropagation()}
          className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-6xl max-h-[85vh] overflow-y-auto border border-gray-200 dark:border-gray-700"
        >
          {/* Header */}
          <div className="p-6 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center bg-gradient-to-r from-blue-50 to-purple-50 dark:from-gray-700 dark:to-gray-700 rounded-t-2xl">
            <h2 className="text-2xl font-bold text-gray-800 dark:text-white flex items-center gap-3">
              <Truck className="w-7 h-7 text-blue-500" />
              {t("deliverySettings.title")}
            </h2>
            <button
              onClick={onClose}
              className="p-2 rounded-xl text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 transition-all"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Content */}
          <div className="p-6">
            {/* Search */}
            <div className="relative mb-6">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder={t("searchState")}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-xl text-gray-800 dark:text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
              />
            </div>

            {/* Settings Form */}
            <form onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredSettings.map(({ state, officePrice, homePrice, deliveryDays }, i) => (
                  <motion.div
                    key={state}
                    className="bg-white dark:bg-gray-700 rounded-xl p-6 border border-gray-200 dark:border-gray-600 shadow-sm hover:shadow-md transition-all duration-200"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.05 * i }}
                  >
                    <h3 className="font-semibold text-lg text-gray-800 dark:text-white mb-4 border-b border-gray-200 dark:border-gray-600 pb-2">
                      {state}
                    </h3>

                    <div className="space-y-4">
                      {/* Office Price */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 flex items-center gap-2">
                          <Building2 className="w-4 h-4 text-blue-500" />
                          {t("deliverySettings.officePrice")}
                        </label>
                        <div className="relative">
                          <input
                            type="number"
                            value={officePrice}
                            onChange={(e) => handleChange(i, "officePrice", e.target.value)}
                            className="w-full bg-gray-50 dark:bg-gray-600 border border-gray-300 dark:border-gray-500 rounded-xl py-2 px-4 pr-12 text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                          />
                          <span className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500 text-sm">DA</span>
                        </div>
                      </div>

                      {/* Home Price */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 flex items-center gap-2">
                          <Home className="w-4 h-4 text-green-500" />
                          {t("deliverySettings.homePrice")}
                        </label>
                        <div className="relative">
                          <input
                            type="number"
                            value={homePrice}
                            onChange={(e) => handleChange(i, "homePrice", e.target.value)}
                            className="w-full bg-gray-50 dark:bg-gray-600 border border-gray-300 dark:border-gray-500 rounded-xl py-2 px-4 pr-12 text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                          />
                          <span className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500 text-sm">DA</span>
                        </div>
                      </div>

                      {/* Delivery Days */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 flex items-center gap-2">
                          <Hourglass className="w-4 h-4 text-purple-500" />
                          {t("deliverySettings.deliveryDays")}
                        </label>
                        <DeliveryDaysSelector
                          index={i}
                          selected={deliveryDays}
                          handleChange={handleChange}
                        />
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* Save Button */}
              <div className="flex justify-center mt-8">
                <motion.button
                  type="submit"
                  className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white py-3 px-8 rounded-xl font-semibold transition-all duration-200 flex items-center gap-3 shadow-md"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Save className="w-5 h-5" />
                  {t("deliverySettings.save")}
                </motion.button>
              </div>
            </form>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>,
    document.body
  );
};

// ==========================
// Other Settings Component
// ==========================
const SomeComponent = () => {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === "ar";
  const [showPopup, setShowPopup] = useState(false);

  const {
    deliverySettings,
    updateDeliverySettings,
    orderCalculation,
    updateOrderCalculation,
    loadingMeta,
  } = useSettingStore();

  const [settings, setSettings] = useState(deliverySettings);

  useEffect(() => {
    setSettings(deliverySettings);
  }, [deliverySettings]);

  function handleChange(index, field, value) {
    setSettings((prev) => {
      const newSettings = [...prev];
      newSettings[index][field] = Number(value) || 0;
      return newSettings;
    });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    try {
      await updateDeliverySettings(settings);
      toast.success(t("settingsUpdated"));
    } catch (error) {
      toast.error(t("settingsUpdatedFailed"));
    }
  }

  function DeliveryDaysSelector({ index, selected, handleChange }) {
    const options = [1, 2, 3, 4, 5];
    const defaultDay = 3;
    const current = selected ? parseInt(selected) : defaultDay;

    function prev() {
      const prevIndex = (current - 2 + options.length) % options.length;
      handleChange(index, "deliveryDays", options[prevIndex].toString());
    }

    function next() {
      const nextIndex = current % options.length;
      handleChange(index, "deliveryDays", options[nextIndex].toString());
    }

    return (
      <div className="flex items-center justify-center gap-3 bg-gray-50 dark:bg-gray-600 rounded-xl p-2">
        <motion.button
          type="button"
          onClick={prev}
          className="p-2 text-gray-600 dark:text-gray-300 hover:text-blue-500 transition-colors duration-200"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          <ArrowLeft className="w-4 h-4" />
        </motion.button>
        <span className="px-3 py-1 font-semibold bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-500 rounded-lg text-gray-800 dark:text-white min-w-[40px] text-center">
          {current}
        </span>
        <motion.button
          type="button"
          onClick={next}
          className="p-2 text-gray-600 dark:text-gray-300 hover:text-blue-500 transition-colors duration-200"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          <ArrowRight className="w-4 h-4" />
        </motion.button>
      </div>
    );
  }

  return (
    <motion.div
      className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 p-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.6 }}
    >
      <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-6 flex items-center gap-3">
        <Settings className="w-7 h-7 text-purple-500" />
        {t("other")}
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Delivery Settings */}
        <div className="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-6">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4 flex items-center gap-2">
            <Truck className="w-5 h-5 text-blue-500" />
            {t("orderSetting")}
          </h3>
          <motion.button
            onClick={() => setShowPopup(true)}
            className="w-full bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white py-3 px-4 rounded-xl font-semibold transition-all duration-200 flex items-center justify-center gap-3 shadow-md"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <Settings className="w-5 h-5" />
            {t("showSetting")}
          </motion.button>
        </div>

        {/* Revenue Calculation */}
        <div className="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-6">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4 flex items-center gap-2">
            <Calculator className="w-5 h-5 text-green-500" />
            {t("calcRevenue")}
          </h3>
          <div className="relative flex bg-gray-200 dark:bg-gray-600 rounded-full p-1 select-none overflow-hidden">
            <div
              className={`absolute top-1 bottom-1 w-1/2 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full transition-transform duration-300 ease-in-out`}
              style={{
                transform: orderCalculation === "confirmed" 
                  ? "translateX(0%)" 
                  : "translateX(100%)",
              }}
            />
            <motion.button
              disabled={loadingMeta}
              onClick={() => updateOrderCalculation("confirmed")}
              className={`relative flex-1 z-10 px-4 py-2 rounded-full text-center text-sm font-medium transition-colors duration-200 ${
                orderCalculation === "confirmed" 
                  ? "text-white" 
                  : "text-gray-600 dark:text-gray-400"
              }`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {t("confirmedOrders")}
            </motion.button>
            <motion.button
              disabled={loadingMeta}
              onClick={() => updateOrderCalculation("all")}
              className={`relative flex-1 z-10 px-4 py-2 rounded-full text-center text-sm font-medium transition-colors duration-200 ${
                orderCalculation === "all" 
                  ? "text-white" 
                  : "text-gray-600 dark:text-gray-400"
              }`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {t("allOrders")}
            </motion.button>
          </div>
        </div>
      </div>

      {showPopup && (
        <DeliverySettingsPopup
          onClose={() => setShowPopup(false)}
          settings={deliverySettings}
          handleChange={handleChange}
          handleSubmit={handleSubmit}
          DeliveryDaysSelector={DeliveryDaysSelector}
          t={t}
        />
      )}
    </motion.div>
  );
};