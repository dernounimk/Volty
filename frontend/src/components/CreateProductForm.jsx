import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { PlusCircle, Loader, X, Upload, Image as ImageIcon, Tag, Palette, Ruler, Package, DollarSign, FileText, Layers, Zap } from "lucide-react";
import toast from "react-hot-toast";
import axios from "../lib/axios";
import { useTranslation } from "react-i18next";
import useSettingStore from '../stores/useSettingStore';

const CreateProductForm = () => {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === 'ar';
  
  const { 
    categories, 
    sizesLetters, 
    sizesNumbers, 
    colorsList, 
    fetchMetaData,
    loadingMeta 
  } = useSettingStore();

  const [newProduct, setNewProduct] = useState({
    name: "",
    description: "",
    priceBefore: "",
    priceAfter: null,
    category: "",
    sizes: [],
    colors: [],
    images: [],
  });

  const [showNumbers, setShowNumbers] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  useEffect(() => {
    const loadSettings = async () => {
      try {
        await fetchMetaData();
        
        if (categories.length > 0) {
          setNewProduct(prev => ({ 
            ...prev, 
            category: categories[0]._id 
          }));
        }
      } catch (error) {
        console.error("خطأ في جلب الإعدادات:", error);
        toast.error(t("productForm.errors.loadSettings"));
      }
    };
    
    loadSettings();
  }, [fetchMetaData, t, categories.length]);

  const toggleSelection = (field, value) => {
    setNewProduct((prev) => {
      if (field === 'colors') {
        const exists = prev.colors.some(c => 
          (typeof c === 'object' && c._id === value._id) || 
          (typeof c === 'string' && c === value._id)
        );
        
        if (exists) {
          return { 
            ...prev, 
            colors: prev.colors.filter(c => 
              (typeof c === 'object' ? c._id !== value._id : c !== value._id)
            ) 
          };
        } else {
          return { ...prev, colors: [...prev.colors, value] };
        }
      } else {
        if (prev[field].includes(value)) {
          return { ...prev, [field]: prev[field].filter(item => item !== value) };
        } else {
          return { ...prev, [field]: [...prev[field], value] };
        }
      }
    });
  };

  const handleImageChange = async (e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;

    setIsUploading(true);
    
    try {
      for (const file of files) {
        const reader = new FileReader();
        reader.onloadend = () => {
          setNewProduct((prev) => ({
            ...prev,
            images: [...prev.images, reader.result],
          }));
        };
        reader.readAsDataURL(file);
      }
      toast.success(t("productForm.imagesUploaded"));
    } catch (error) {
      toast.error(t("productForm.errors.upload"));
    } finally {
      setIsUploading(false);
    }
  };

  const removeImage = (index) => {
    setNewProduct((prev) => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!newProduct.name.trim()) return toast.error(t("productForm.errors.name"));
    if (!newProduct.priceBefore || isNaN(newProduct.priceBefore)) return toast.error(t("productForm.errors.priceBefore"));
    if (
      newProduct.priceAfter &&
      parseFloat(newProduct.priceAfter) >= parseFloat(newProduct.priceBefore)
    )
      return toast.error(t("productForm.errors.priceAfter"));
    if (newProduct.images.length < 1) return toast.error(t("productForm.errors.images"));

    setLoading(true);
    try {
      await axios.post("/products", {
        name: newProduct.name,
        description: newProduct.description,
        priceBeforeDiscount: parseFloat(newProduct.priceBefore),
        priceAfterDiscount: newProduct.priceAfter ? parseFloat(newProduct.priceAfter) : null,
        category: newProduct.category,
        sizes: newProduct.sizes,
        colors: newProduct.colors.map(c => typeof c === 'object' ? c._id : c),
        images: newProduct.images,
      });

      toast.success(t("productForm.success"));

      // Reset form
      setNewProduct({
        name: "",
        description: "",
        priceBefore: "",
        priceAfter: "",
        category: categories.length > 0 ? categories[0]._id : "",
        sizes: [],
        colors: [],
        images: [],
      });
    } catch (err) {
      console.error("Error creating product:", err);
      toast.error(t("productForm.errors.create"));
    }
    setLoading(false);
  };

  if (loadingMeta) {
    return (
      <div className="flex justify-center items-center h-64 rounded-2xl">
        <div className="text-center">
          <Loader className="h-8 w-8 animate-spin text-[var(--color-accent)] mx-auto mb-4" />
          <span className="text-[var(--color-text-secondary)]">{t("loading")}</span>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      className="min-h-screen py-8 px-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="max-w-2xl mx-auto">
        <motion.div
          className="bg-[var(--color-bg-opacity)] backdrop-blur-xl rounded-2xl shadow-lg border border-[var(--color-border)] p-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          {/* Header */}
          <div className="text-center mb-8">
            <motion.h2 
              className="text-3xl font-bold bg-gradient-to-r from-[var(--color-electric)] to-[var(--color-accent)] bg-clip-text text-transparent mb-2 flex items-center justify-center gap-2"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <Package className="w-8 h-8" />
              {t("productForm.title")}
            </motion.h2>
            <p className="text-[var(--color-text-secondary)]">
              {t("productForm.subtitle")}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Product Name */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
            >
              <label className="block text-sm font-semibold text-[var(--color-text)] mb-2 flex items-center gap-2">
                <Tag className="w-4 h-4 text-[var(--color-accent)]" />
                {t("productForm.name")} *
              </label>
              <input
                type="text"
                value={newProduct.name}
                onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
                className="w-full bg-[var(--color-bg)] border border-[var(--color-border)] rounded-xl py-3 px-4 text-[var(--color-text)] placeholder-[var(--color-text-secondary)] focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)] focus:border-transparent transition-all duration-200"
                placeholder={t("productForm.namePlaceholder")}
              />
            </motion.div>

            {/* Description */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
            >
              <label className="block text-sm font-semibold text-[var(--color-text)] mb-2 flex items-center gap-2">
                <FileText className="w-4 h-4 text-[var(--color-accent)]" />
                {t("productForm.description")}
              </label>
              <textarea
                value={newProduct.description}
                onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })}
                rows="4"
                className="w-full bg-[var(--color-bg)] border border-[var(--color-border)] rounded-xl py-3 px-4 text-[var(--color-text)] placeholder-[var(--color-text-secondary)] focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)] focus:border-transparent transition-all duration-200 resize-none"
                placeholder={t("productForm.descriptionPlaceholder")}
              />
            </motion.div>

            {/* Prices */}
            <motion.div
              className="grid grid-cols-1 md:grid-cols-2 gap-4"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 }}
            >
              <div>
                <label className="block text-sm font-semibold text-[var(--color-text)] mb-2 flex items-center gap-2">
                  <DollarSign className="w-4 h-4 text-[var(--color-accent)]" />
                  {t("productForm.priceBefore")} *
                </label>
                <div className="relative">
                  <input
                    type="number"
                    value={newProduct.priceBefore}
                    onChange={(e) => setNewProduct({ ...newProduct, priceBefore: e.target.value })}
                    className="w-full bg-[var(--color-bg)] border border-[var(--color-border)] rounded-xl py-3 px-4 pr-12 text-[var(--color-text)] placeholder-[var(--color-text-secondary)] focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)] focus:border-transparent transition-all duration-200"
                    placeholder="0.00"
                    min="0"
                    step="0.01"
                  />
                  <span className="absolute right-4 top-1/2 transform -translate-y-1/2 text-[var(--color-text-secondary)]">DA</span>
                </div>
              </div>
              <div>
                <label className="block text-sm font-semibold text-[var(--color-text)] mb-2 flex items-center gap-2">
                  <DollarSign className="w-4 h-4 text-[var(--color-accent)]" />
                  {t("productForm.priceAfter")}
                </label>
                <div className="relative">
                  <input
                    type="number"
                    value={newProduct.priceAfter || ""}
                    onChange={(e) => setNewProduct({ ...newProduct, priceAfter: e.target.value || null })}
                    className="w-full bg-[var(--color-bg)] border border-[var(--color-border)] rounded-xl py-3 px-4 pr-12 text-[var(--color-text)] placeholder-[var(--color-text-secondary)] focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)] focus:border-transparent transition-all duration-200"
                    placeholder="0.00"
                    min="0"
                    step="0.01"
                  />
                  <span className="absolute right-4 top-1/2 transform -translate-y-1/2 text-[var(--color-text-secondary)]">DA</span>
                </div>
              </div>
            </motion.div>

            {/* Category */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.6 }}
            >
              <label className="block text-sm font-semibold text-[var(--color-text)] mb-2 flex items-center gap-2">
                <Layers className="w-4 h-4 text-[var(--color-accent)]" />
                {t("productForm.category")} *
              </label>
              <select
                value={newProduct.category}
                onChange={(e) => setNewProduct({ ...newProduct, category: e.target.value })}
                className="w-full bg-[var(--color-bg)] border border-[var(--color-border)] rounded-xl py-3 px-4 text-[var(--color-text)] focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)] focus:border-transparent transition-all duration-200"
                required
              >
                {categories.map((cat) => (
                  <option key={cat._id} value={cat._id}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </motion.div>

            {/* Sizes */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.7 }}
            >
              <div className="flex items-center justify-between mb-4">
                <label className="block text-sm font-semibold text-[var(--color-text)] flex items-center gap-2">
                  <Ruler className="w-4 h-4 text-[var(--color-accent)]" />
                  {t("productForm.sizes")}
                </label>
                <button
                  type="button"
                  onClick={() => {
                    setShowNumbers((prev) => !prev);
                    setNewProduct((prev) => ({ ...prev, sizes: [] }));
                  }}
                  className="px-4 py-2 bg-gradient-to-r from-[var(--color-electric)] to-[var(--color-accent)] text-white rounded-xl hover:opacity-90 transition-all duration-200 text-sm font-medium shadow-sm"
                >
                  {showNumbers 
                    ? t("productForm.showLetters") 
                    : t("productForm.showNumbers")}
                </button>
              </div>
              <div className="flex flex-wrap gap-2">
                {(showNumbers ? sizesNumbers : sizesLetters).map((size) => (
                  <motion.button
                    type="button"
                    key={size._id || size}
                    onClick={() => toggleSelection("sizes", size.name || size)}
                    className={`px-4 py-2 rounded-xl border-2 font-medium transition-all duration-200 ${
                      newProduct.sizes.includes(size.name || size)
                        ? "bg-gradient-to-r from-[var(--color-electric)] to-[var(--color-accent)] border-transparent text-white shadow-md"
                        : "bg-[var(--color-bg)] border-[var(--color-border)] text-[var(--color-text)] hover:border-[var(--color-accent)]"
                    }`}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    {size.name || size}
                  </motion.button>
                ))}
              </div>
            </motion.div>

            {/* Colors */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.8 }}
            >
              <label className="block text-sm font-semibold text-[var(--color-text)] mb-4 flex items-center gap-2">
                <Palette className="w-4 h-4 text-[var(--color-accent)]" />
                {t("productForm.colors")}
              </label>
              <div className="flex flex-wrap gap-3">
                {colorsList.map((colorObj) => {
                  const isSelected = newProduct.colors.some(c => 
                    (typeof c === 'object' ? c._id === colorObj._id : c === colorObj._id)
                  );
                  
                  return (
                    <motion.button
                      type="button"
                      key={colorObj._id}
                      onClick={() => toggleSelection("colors", colorObj)}
                      className={`p-3 rounded-xl border-2 flex flex-col items-center gap-2 transition-all duration-200 min-w-[80px] ${
                        isSelected
                          ? "bg-gradient-to-r from-[var(--color-electric)] to-[var(--color-accent)] border-transparent text-white shadow-md"
                          : "bg-[var(--color-bg)] border-[var(--color-border)] text-[var(--color-text)] hover:border-[var(--color-accent)]"
                      }`}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <div 
                        className="w-8 h-8 border-2 border-[var(--color-border)] rounded-full shadow-sm"
                        style={{ backgroundColor: colorObj.hex }}
                      />
                      <span className="text-xs font-medium">{colorObj.name}</span>
                    </motion.button>
                  );
                })}
              </div>
            </motion.div>

            {/* Images Upload */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.9 }}
            >
              <label className="block text-sm font-semibold text-[var(--color-text)] mb-4 flex items-center gap-2">
                <ImageIcon className="w-4 h-4 text-[var(--color-accent)]" />
                {t("productForm.uploadImages")} *
              </label>
              
              {/* Upload Area */}
              <div className={`border-2 border-dashed rounded-2xl p-6 text-center transition-all duration-200 mb-4 ${
                isUploading 
                  ? "border-[var(--color-accent)] bg-[var(--color-accent)]/10" 
                  : "border-[var(--color-border)] hover:border-[var(--color-accent)] hover:bg-[var(--color-accent)]/5"
              }`}>
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                  id="image-upload"
                  disabled={isUploading}
                />
                <label 
                  htmlFor="image-upload" 
                  className="cursor-pointer block"
                >
                  <Upload className="w-12 h-12 text-[var(--color-text-secondary)] mx-auto mb-3" />
                  <p className="text-[var(--color-text-secondary)] mb-2">
                    {isUploading ? t("productForm.uploading") : t("productForm.uploadHint")}
                  </p>
                  <span className="px-4 py-2 bg-gradient-to-r from-[var(--color-electric)] to-[var(--color-accent)] text-white rounded-xl text-sm font-medium inline-block">
                    {t("productForm.selectImages")}
                  </span>
                </label>
              </div>

              {/* Preview Images */}
              <AnimatePresence>
                {newProduct.images.length > 0 && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4"
                  >
                    {newProduct.images.map((img, idx) => (
                      <motion.div
                        key={idx}
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.8 }}
                        className="relative group"
                      >
                        <img 
                          src={img} 
                          alt="" 
                          className="w-full h-24 object-cover rounded-xl shadow-sm border border-[var(--color-border)]" 
                        />
                        <button
                          type="button"
                          onClick={() => removeImage(idx)}
                          className="absolute -top-2 -right-2 bg-gradient-to-r from-red-500 to-rose-600 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200 shadow-lg"
                        >
                          <X size={14} />
                        </button>
                      </motion.div>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>

            {/* Quick Info Box */}
            <motion.div
              className="bg-gradient-to-r from-[var(--color-electric)]/10 to-[var(--color-accent)]/10 border border-[var(--color-accent)]/20 rounded-2xl p-4"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.95 }}
            >
              <div className="flex items-start gap-3">
                <Zap className="w-5 h-5 text-[var(--color-accent)] mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-[var(--color-text)] mb-1">
                    {t("productForm.tips.title")}
                  </p>
                  <ul className="text-xs text-[var(--color-text-secondary)] space-y-1">
                    <li>• {t("productForm.tips.images")}</li>
                    <li>• {t("productForm.tips.prices")}</li>
                    <li>• {t("productForm.tips.sizes")}</li>
                  </ul>
                </div>
              </div>
            </motion.div>

            {/* Submit Button */}
            <motion.button
              type="submit"
              className="w-full bg-gradient-to-r from-[var(--color-electric)] to-[var(--color-accent)] text-white py-4 px-6 rounded-xl font-semibold text-lg shadow-lg hover:opacity-90 focus:outline-none focus:ring-4 focus:ring-[var(--color-accent)]/50 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center"
              disabled={loading}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1 }}
              whileHover={{ scale: loading ? 1 : 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              {loading ? (
                <>
                  <Loader className={`${isRTL ? "ml-3" : "mr-3"} h-5 w-5 animate-spin`} />
                  {t("productForm.creating")}
                </>
              ) : (
                <>
                  <PlusCircle className={`${isRTL ? "ml-3" : "mr-3"} h-5 w-5`} />
                  {t("productForm.createButton")}
                </>
              )}
            </motion.button>
          </form>
        </motion.div>

        {/* Summary Stats */}
        <motion.div
          className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.1 }}
        >
          <div className="bg-[var(--color-bg-opacity)] backdrop-blur-xl rounded-2xl p-4 border border-[var(--color-border)] text-center">
            <div className="text-lg font-bold text-[var(--color-text)] mb-1">
              {newProduct.sizes.length}
            </div>
            <div className="text-sm text-[var(--color-text-secondary)]">
              {t("productForm.selectedSizes")}
            </div>
          </div>
          
          <div className="bg-[var(--color-bg-opacity)] backdrop-blur-xl rounded-2xl p-4 border border-[var(--color-border)] text-center">
            <div className="text-lg font-bold text-[var(--color-text)] mb-1">
              {newProduct.colors.length}
            </div>
            <div className="text-sm text-[var(--color-text-secondary)]">
              {t("productForm.selectedColors")}
            </div>
          </div>
          
          <div className="bg-[var(--color-bg-opacity)] backdrop-blur-xl rounded-2xl p-4 border border-[var(--color-border)] text-center">
            <div className="text-lg font-bold text-[var(--color-text)] mb-1">
              {newProduct.images.length}
            </div>
            <div className="text-sm text-[var(--color-text-secondary)]">
              {t("productForm.selectedImages")}
            </div>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default CreateProductForm;