import React, { useState } from 'react';
import { useStore } from '../../../context/StoreContext';
import { StoreConfig, CurrencyCode, StoreHomeLayout } from '../../../types/store';
import {
  Settings,
  Save,
  Check,
  Phone,
  DollarSign,
  Award,
  Truck,
  SlidersHorizontal,
  Square,
  Columns2,
  LayoutGrid,
} from 'lucide-react';

export const StoreSettingsEditor: React.FC = () => {
  const { storeConfig, updateStoreConfig, formatPrice } = useStore();

  const [storeName, setStoreName] = useState(storeConfig.storeName || '');
  const [storeSubtitle, setStoreSubtitle] = useState(storeConfig.storeSubtitle || '');
  const [whatsappNumber, setWhatsappNumber] = useState(storeConfig.whatsappNumber || '');
  const [defaultCurrency, setDefaultCurrency] = useState<CurrencyCode>(
    storeConfig.defaultCurrency || 'YER'
  );
  const [homeLayout, setHomeLayout] = useState<StoreHomeLayout>(
    storeConfig.homeLayout || 'carousel'
  );
  const [homeMaxProducts, setHomeMaxProducts] = useState<number>(
    storeConfig.homeMaxProducts || 8
  );
  const [shippingFee, setShippingFee] = useState(storeConfig.shippingFee || 2500);
  const [freeShippingThreshold, setFreeShippingThreshold] = useState(
    storeConfig.freeShippingThreshold || 50000
  );
  const [heroBannerTitle, setHeroBannerTitle] = useState(storeConfig.heroBannerTitle || '');
  const [heroBannerSubtitle, setHeroBannerSubtitle] = useState(
    storeConfig.heroBannerSubtitle || ''
  );
  const [isEnabled, setIsEnabled] = useState(storeConfig.isEnabled ?? true);
  const [enableReviews, setEnableReviews] = useState(storeConfig.enableReviews ?? true);
  const [enableCompare, setEnableCompare] = useState(storeConfig.enableCompare ?? true);
  const [enableWishlist, setEnableWishlist] = useState(storeConfig.enableWishlist ?? true);
  const [enablePOSBarcodeScanner, setEnablePOSBarcodeScanner] = useState(
    storeConfig.enablePOSBarcodeScanner ?? true
  );

  const [saveSuccess, setSaveSuccess] = useState(false);

  const handleSave = () => {
    updateStoreConfig({
      storeName,
      storeSubtitle,
      whatsappNumber,
      defaultCurrency,
      homeLayout,
      homeMaxProducts: Number(homeMaxProducts),
      shippingFee: Number(shippingFee),
      freeShippingThreshold: Number(freeShippingThreshold),
      heroBannerTitle,
      heroBannerSubtitle,
      isEnabled,
      enableReviews,
      enableCompare,
      enableWishlist,
      enablePOSBarcodeScanner,
    });
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  return (
    <div className="space-y-6 text-right">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-bold text-white flex items-center gap-2">
            <Settings className="w-5 h-5 text-amber-400" />
            <span>إعدادات المتجر العامة والشحن والولاء</span>
          </h3>
          <p className="text-xs text-slate-400">
            تخصيص اسم المتجر، رقم واتساب المعتمد، العملة الافتراضية، ورسوم الشحن
          </p>
        </div>

        <button
          type="button"
          onClick={handleSave}
          className="px-6 py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs rounded-xl shadow-lg shadow-amber-500/20 flex items-center gap-2 transition-all cursor-pointer"
        >
          {saveSuccess ? <Check className="w-4 h-4 text-emerald-950" /> : <Save className="w-4 h-4" />}
          <span>{saveSuccess ? 'تم الحفظ بنجاح!' : 'حفظ الإعدادات'}</span>
        </button>
      </div>

      <div className="p-6 bg-slate-950 border border-slate-800 rounded-3xl space-y-5 shadow-lg">
        {/* Basic Meta */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="text-xs font-bold text-slate-300">اسم المتجر الرئيسي *</label>
            <input
              type="text"
              value={storeName}
              onChange={(e) => setStoreName(e.target.value)}
              className="w-full bg-slate-900 border border-slate-700 rounded-xl p-2.5 text-xs text-white mt-1 focus:outline-none"
            />
          </div>

          <div>
            <label className="text-xs font-bold text-slate-300">
              رقم الواتساب لاستقبال الطلبات الفورية *
            </label>
            <div className="relative mt-1">
              <input
                type="text"
                value={whatsappNumber}
                onChange={(e) => setWhatsappNumber(e.target.value)}
                placeholder="967770000000"
                className="w-full bg-slate-900 border border-slate-700 rounded-xl py-2.5 pr-10 pl-3 text-xs text-white focus:outline-none font-mono"
              />
              <Phone className="w-4 h-4 text-emerald-400 absolute right-3 top-1/2 -translate-y-1/2" />
            </div>
          </div>

          <div>
            <label className="text-xs font-bold text-slate-300">الوصف الفرعي للمتجر</label>
            <input
              type="text"
              value={storeSubtitle}
              onChange={(e) => setStoreSubtitle(e.target.value)}
              className="w-full bg-slate-900 border border-slate-700 rounded-xl p-2.5 text-xs text-white mt-1 focus:outline-none"
            />
          </div>

          <div>
            <label className="text-xs font-bold text-slate-300">العملة الافتراضية للمتجر</label>
            <select
              value={defaultCurrency}
              onChange={(e) => setDefaultCurrency(e.target.value as CurrencyCode)}
              className="w-full bg-slate-900 border border-slate-700 rounded-xl p-2.5 text-xs text-white mt-1 focus:outline-none cursor-pointer"
            >
              <option value="YER">YER - ريال يمني (قديم / صنعاء)</option>
              <option value="SAR">SAR - ريال سعودي</option>
              <option value="USD">USD - دولار أمريكي</option>
            </select>
          </div>
        </div>

        {/* Home Module Showcase Layout Options */}
        <div className="pt-4 border-t border-slate-800 space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <label className="text-xs font-bold text-amber-400 block">
                نمط عرض موديول المتجر بالصفحة الرئيسية (Showcase Display Mode):
              </label>
              <p className="text-[11px] text-slate-400">
                اختر كيف تظهر المنتجات لزوار الصفحة الرئيسية: كاروسال منزلق، بطاقة واحدة، أو بطاقتين
              </p>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-[11px] text-slate-400">الحد الأقصى للعرض:</span>
              <input
                type="number"
                min="1"
                max="24"
                value={homeMaxProducts}
                onChange={(e) => setHomeMaxProducts(Number(e.target.value))}
                className="w-16 bg-slate-900 border border-slate-700 rounded-lg p-1.5 text-center text-xs text-white"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 pt-1">
            {/* 1. Carousel */}
            <div
              onClick={() => setHomeLayout('carousel')}
              className={`p-3.5 rounded-2xl border transition-all cursor-pointer text-right space-y-1.5 ${
                homeLayout === 'carousel'
                  ? 'bg-amber-500/15 border-amber-500 shadow-md shadow-amber-500/10 ring-1 ring-amber-500/30'
                  : 'bg-slate-900 border-slate-800 hover:border-slate-700'
              }`}
            >
              <div className="flex items-center justify-between">
                <div
                  className={`p-2 rounded-xl ${
                    homeLayout === 'carousel'
                      ? 'bg-amber-500 text-slate-950 font-black'
                      : 'bg-slate-950 text-slate-400'
                  }`}
                >
                  <SlidersHorizontal className="w-4 h-4" />
                </div>
                {homeLayout === 'carousel' && (
                  <Check className="w-4 h-4 text-amber-400" />
                )}
              </div>
              <h4 className="text-xs font-bold text-white">١. كاروسال منزلق (Carousel)</h4>
              <p className="text-[10px] text-slate-400 leading-relaxed">
                سلايدر أفقي تفاعلي منزلق مع أزرار تنقل ونقاط تسلسلية دون أن يخرج عن إطار الشاشة
              </p>
            </div>

            {/* 2. Single Card */}
            <div
              onClick={() => setHomeLayout('single')}
              className={`p-3.5 rounded-2xl border transition-all cursor-pointer text-right space-y-1.5 ${
                homeLayout === 'single'
                  ? 'bg-amber-500/15 border-amber-500 shadow-md shadow-amber-500/10 ring-1 ring-amber-500/30'
                  : 'bg-slate-900 border-slate-800 hover:border-slate-700'
              }`}
            >
              <div className="flex items-center justify-between">
                <div
                  className={`p-2 rounded-xl ${
                    homeLayout === 'single'
                      ? 'bg-amber-500 text-slate-950 font-black'
                      : 'bg-slate-950 text-slate-400'
                  }`}
                >
                  <Square className="w-4 h-4" />
                </div>
                {homeLayout === 'single' && (
                  <Check className="w-4 h-4 text-amber-400" />
                )}
              </div>
              <h4 className="text-xs font-bold text-white">٢. بطاقة واحدة (Single Card)</h4>
              <p className="text-[10px] text-slate-400 leading-relaxed">
                تسليط الضوء على بطاقة منتج واحدة في كل مرة بمقاس كبير وأزرار تقليب سريعة
              </p>
            </div>

            {/* 3. Two Cards */}
            <div
              onClick={() => setHomeLayout('two_cards')}
              className={`p-3.5 rounded-2xl border transition-all cursor-pointer text-right space-y-1.5 ${
                homeLayout === 'two_cards'
                  ? 'bg-amber-500/15 border-amber-500 shadow-md shadow-amber-500/10 ring-1 ring-amber-500/30'
                  : 'bg-slate-900 border-slate-800 hover:border-slate-700'
              }`}
            >
              <div className="flex items-center justify-between">
                <div
                  className={`p-2 rounded-xl ${
                    homeLayout === 'two_cards'
                      ? 'bg-amber-500 text-slate-950 font-black'
                      : 'bg-slate-950 text-slate-400'
                  }`}
                >
                  <Columns2 className="w-4 h-4" />
                </div>
                {homeLayout === 'two_cards' && (
                  <Check className="w-4 h-4 text-amber-400" />
                )}
              </div>
              <h4 className="text-xs font-bold text-white">٣. بطاقتين متجاورتين (Two Cards)</h4>
              <p className="text-[10px] text-slate-400 leading-relaxed">
                عرض بطاقتين فقط في كل مرة متجاورتين بعرض متوافق ومتناسق للموبايل والكمبيوتر
              </p>
            </div>

            {/* 4. Full Grid */}
            <div
              onClick={() => setHomeLayout('grid')}
              className={`p-3.5 rounded-2xl border transition-all cursor-pointer text-right space-y-1.5 ${
                homeLayout === 'grid'
                  ? 'bg-amber-500/15 border-amber-500 shadow-md shadow-amber-500/10 ring-1 ring-amber-500/30'
                  : 'bg-slate-900 border-slate-800 hover:border-slate-700'
              }`}
            >
              <div className="flex items-center justify-between">
                <div
                  className={`p-2 rounded-xl ${
                    homeLayout === 'grid'
                      ? 'bg-amber-500 text-slate-950 font-black'
                      : 'bg-slate-950 text-slate-400'
                  }`}
                >
                  <LayoutGrid className="w-4 h-4" />
                </div>
                {homeLayout === 'grid' && (
                  <Check className="w-4 h-4 text-amber-400" />
                )}
              </div>
              <h4 className="text-xs font-bold text-white">٤. شبكة المنتجات (Full Grid)</h4>
              <p className="text-[10px] text-slate-400 leading-relaxed">
                شبكة عرض شاملة تعرض صفوف المنتجات بشكل كلاسيكي ممتد
              </p>
            </div>
          </div>
        </div>

        {/* Shipping & Threshold */}
        <div className="pt-4 border-t border-slate-800 grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="text-xs font-bold text-slate-300">
              رسوم التوصيل الافتراضية (بالريال اليمني):
            </label>
            <input
              type="number"
              value={shippingFee}
              onChange={(e) => setShippingFee(Number(e.target.value))}
              className="w-full bg-slate-900 border border-slate-700 rounded-xl p-2.5 text-xs text-white mt-1 focus:outline-none"
            />
          </div>

          <div>
            <label className="text-xs font-bold text-slate-300">
              الحد الأدنى للشحن المجاني (Free Shipping):
            </label>
            <input
              type="number"
              value={freeShippingThreshold}
              onChange={(e) => setFreeShippingThreshold(Number(e.target.value))}
              className="w-full bg-slate-900 border border-slate-700 rounded-xl p-2.5 text-xs text-white mt-1 focus:outline-none"
            />
          </div>
        </div>

        {/* Feature Toggles */}
        <div className="pt-4 border-t border-slate-800 space-y-3">
          <label className="text-xs font-bold text-amber-400 block">
            ميزات المتجر ونقاط البيع المفعلة:
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <label className="flex items-center gap-2 text-xs text-slate-200 cursor-pointer p-3 bg-slate-900 border border-slate-800 rounded-xl">
              <input
                type="checkbox"
                checked={enablePOSBarcodeScanner}
                onChange={(e) => setEnablePOSBarcodeScanner(e.target.checked)}
                className="rounded border-slate-700 text-amber-500 focus:ring-amber-500"
              />
              <span>تفعيل نظام الكاشير المحاسبي وقارئ الباركود (POS)</span>
            </label>

            <label className="flex items-center gap-2 text-xs text-slate-200 cursor-pointer p-3 bg-slate-900 border border-slate-800 rounded-xl">
              <input
                type="checkbox"
                checked={enableCompare}
                onChange={(e) => setEnableCompare(e.target.checked)}
                className="rounded border-slate-700 text-amber-500 focus:ring-amber-500"
              />
              <span>تفعيل نظام مقارنة المنتجات (Product Compare)</span>
            </label>

            <label className="flex items-center gap-2 text-xs text-slate-200 cursor-pointer p-3 bg-slate-900 border border-slate-800 rounded-xl">
              <input
                type="checkbox"
                checked={enableWishlist}
                onChange={(e) => setEnableWishlist(e.target.checked)}
                className="rounded border-slate-700 text-amber-500 focus:ring-amber-500"
              />
              <span>تفعيل قائمة المفضلة والأمنيات (Wishlist)</span>
            </label>

            <label className="flex items-center gap-2 text-xs text-slate-200 cursor-pointer p-3 bg-slate-900 border border-slate-800 rounded-xl">
              <input
                type="checkbox"
                checked={enableReviews}
                onChange={(e) => setEnableReviews(e.target.checked)}
                className="rounded border-slate-700 text-amber-500 focus:ring-amber-500"
              />
              <span>تفعيل نظام المراجعات والتقييمات للعملاء</span>
            </label>
          </div>
        </div>
      </div>
    </div>
  );
};
