import { useTranslation } from "react-i18next";
import useSettingStore from '../stores/useSettingStore';
import { ChevronDown } from "lucide-react";

const WilayaSelector = ({ selectedWilaya, setSelectedWilaya }) => {
  const { t } = useTranslation();
  const deliverySettings = useSettingStore(state => state.deliverySettings);

  return (
    <div className="relative">
      <label htmlFor="wilaya" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
        {t("wilayaSelector.wilaya")}
      </label>

      <div className="relative">
        <select
          id="wilaya"
          value={selectedWilaya}
          onChange={(e) => setSelectedWilaya(e.target.value)}
          className="appearance-none w-full bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 
          rounded-2xl shadow-sm py-3 px-4 text-gray-900 dark:text-white 
          focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20
          transition-all duration-200 hover:border-gray-300 dark:hover:border-gray-600
          cursor-pointer"
        >
          <option value="" className="text-gray-500 dark:text-gray-400">
            {t("wilayaSelector.selectWilaya")}
          </option>
          {deliverySettings.map(({ state }) => (
            <option 
              key={state} 
              value={state}
              className="text-gray-900 dark:text-white bg-white dark:bg-gray-800 py-2"
            >
              {state}
            </option>
          ))}
        </select>
        
        {/* Custom Chevron Icon */}
        <div className="absolute right-4 top-1/2 transform -translate-y-1/2 pointer-events-none">
          <ChevronDown 
            size={20} 
            className="text-gray-400 dark:text-gray-500 transition-transform duration-200" 
          />
        </div>
      </div>
    </div>
  );
};

export default WilayaSelector;