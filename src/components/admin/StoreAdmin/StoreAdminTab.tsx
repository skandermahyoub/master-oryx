import React, { useState } from 'react';
import { ProductsManager } from './ProductsManager';
import { CategoriesManager } from './CategoriesManager';
import { LoyaltyManager } from './LoyaltyManager';
import { OrdersManager } from './OrdersManager';
import { WalletsManager } from './WalletsManager';
import { POSAccountingReports } from './POSAccountingReports';
import { StoreSettingsEditor } from './StoreSettingsEditor';
import {
  ShoppingBag,
  Package,
  Layers,
  Crown,
  FileText,
  Building,
  TrendingUp,
  Settings,
  ScanBarcode,
  Sparkles,
  DollarSign,
  AlertCircle,
  Truck,
} from 'lucide-react';
import { useStore } from '../../../context/StoreContext';

export const StoreAdminTab: React.FC = () => {
  const [activeSubTab, setActiveSubTab] = useState<
    'products' | 'categories' | 'loyalty' | 'orders' | 'wallets' | 'accounting' | 'settings'
  >('products');

  const { orders, storeConfig, setIsPOSOpen, formatPrice } = useStore();

  const pendingOrdersCount = orders.filter((o) => o.status === 'new').length;
  const categoriesCount = (storeConfig.categories || []).length;
  const membersCount = (storeConfig.loyalty?.members || []).length;
  const lowStockCount = (storeConfig.products || []).filter((p) => p.stock <= 3).length;
  const totalSalesVolume = orders
    .filter((o) => o.status !== 'cancelled')
    .reduce((sum, o) => sum + o.total, 0);

  const subTabs = [
    {
      id: 'products' as const,
      name: 'المنتجات والمخزون',
      count: storeConfig.products.length,
      icon: Package,
      badge: lowStockCount > 0 ? `${lowStockCount} منخفض` : undefined,
      badgeColor: 'bg-rose-500/20 text-rose-400 border-rose-500/30',
    },
    {
      id: 'categories' as const,
      name: 'نظام التصنيفات',
      count: categoriesCount,
      icon: Layers,
    },
    {
      id: 'loyalty' as const,
      name: 'برنامج الولاء والمكافآت',
      count: membersCount,
      icon: Crown,
      badge: 'نشط',
      badgeColor: 'bg-amber-500/20 text-amber-400 border-amber-500/30',
    },
    {
      id: 'orders' as const,
      name: 'الطلبات والمبيعات',
      count: orders.length,
      icon: FileText,
      badge: pendingOrdersCount > 0 ? `${pendingOrdersCount} جديد` : undefined,
      badgeColor: 'bg-rose-500 text-white font-bold',
    },
    {
      id: 'wallets' as const,
      name: 'المحافظ اليمنية',
      count: storeConfig.yemeniWallets.length,
      icon: Building,
    },
    {
      id: 'accounting' as const,
      name: 'المحاسبة والربحية',
      icon: TrendingUp,
    },
    {
      id: 'settings' as const,
      name: 'إعدادات المتجر والعرض',
      icon: Settings,
    },
  ];

  return (
    <div className="space-y-6 max-w-full overflow-x-hidden text-right">
      
      {/* 1. Master Store Hub Banner */}
      <div className="bg-gradient-to-r from-amber-500/15 via-slate-900 to-slate-900 border border-amber-500/30 rounded-3xl p-5 sm:p-7 relative overflow-hidden shadow-xl">
        <div className="absolute top-0 right-0 w-80 h-full bg-amber-500/5 blur-3xl pointer-events-none" />

        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-5 relative z-10">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-amber-500/10 text-amber-400 border border-amber-500/20 rounded-full text-xs font-bold">
              <ShoppingBag className="w-3.5 h-3.5" />
              <span>منظومة التجارة الإلكترونية الشاملة ومحرك البيع المتقدم</span>
            </div>
            <h2 className="text-xl sm:text-2xl md:text-3xl font-black text-white">
              لوحة التحكم المركزية للمتجر الرقمي والطلبات
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 max-w-3xl leading-relaxed">
              إدارة متكاملة تشمل كتالوج المنتجات، مراقبة المخزون، نظام التصنيفات، برنامج ولاء العملاء ونقاط المكافآت، طلبات الشراء، المحافظ الإلكترونية اليمنية، والتقارير المالية ونقاط البيع السريعة (POS).
            </p>
          </div>

          {/* Quick Action Button: POS Cashier */}
          <button
            type="button"
            onClick={() => setIsPOSOpen(true)}
            className="px-5 py-3 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-black text-xs sm:text-sm rounded-2xl flex items-center justify-center gap-2 shadow-xl shadow-amber-500/25 transition-all cursor-pointer shrink-0"
          >
            <ScanBarcode className="w-4 h-4" />
            <span>فتح شاشة الكاشير والباركود (POS)</span>
          </button>
        </div>

        {/* 4 Quick Stat Summary Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-5 mt-5 border-t border-slate-800/80">
          <div
            onClick={() => setActiveSubTab('products')}
            className="p-3 bg-slate-950/70 border border-slate-800 rounded-2xl cursor-pointer hover:border-amber-500/40 transition-all text-right"
          >
            <span className="text-[11px] text-slate-400 block mb-1">المنتجات بالمخزون:</span>
            <div className="flex items-center justify-between">
              <span className="text-lg font-black text-white font-mono">
                {storeConfig.products.length}
              </span>
              <Package className="w-4 h-4 text-amber-400" />
            </div>
          </div>

          <div
            onClick={() => setActiveSubTab('categories')}
            className="p-3 bg-slate-950/70 border border-slate-800 rounded-2xl cursor-pointer hover:border-amber-500/40 transition-all text-right"
          >
            <span className="text-[11px] text-slate-400 block mb-1">الأقسام والتصنيفات:</span>
            <div className="flex items-center justify-between">
              <span className="text-lg font-black text-white font-mono">
                {categoriesCount}
              </span>
              <Layers className="w-4 h-4 text-indigo-400" />
            </div>
          </div>

          <div
            onClick={() => setActiveSubTab('loyalty')}
            className="p-3 bg-slate-950/70 border border-slate-800 rounded-2xl cursor-pointer hover:border-amber-500/40 transition-all text-right"
          >
            <span className="text-[11px] text-slate-400 block mb-1">أعضاء برنامج الولاء:</span>
            <div className="flex items-center justify-between">
              <span className="text-lg font-black text-white font-mono">
                {membersCount}
              </span>
              <Crown className="w-4 h-4 text-amber-400" />
            </div>
          </div>

          <div
            onClick={() => setActiveSubTab('orders')}
            className="p-3 bg-slate-950/70 border border-slate-800 rounded-2xl cursor-pointer hover:border-amber-500/40 transition-all text-right"
          >
            <span className="text-[11px] text-slate-400 block mb-1">الطلبات والمبيعات:</span>
            <div className="flex items-center justify-between">
              <span className="text-lg font-black text-white font-mono">
                {orders.length}
              </span>
              <FileText className="w-4 h-4 text-emerald-400" />
            </div>
          </div>
        </div>
      </div>

      {/* 2. Subtabs Navigation Bar - Fully Responsive with wrapping */}
      <div className="p-2 bg-slate-950 border border-slate-800 rounded-2xl">
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0 scrollbar-none max-w-full">
          {subTabs.map((tab) => {
            const isActive = activeSubTab === tab.id;
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveSubTab(tab.id)}
                className={`px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 shrink-0 cursor-pointer ${
                  isActive
                    ? 'bg-amber-500 text-slate-950 font-black shadow-md shadow-amber-500/20'
                    : 'text-slate-400 hover:text-white hover:bg-slate-900 border border-transparent hover:border-slate-800'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-slate-950' : 'text-amber-400'}`} />
                <span>{tab.name}</span>
                {tab.count !== undefined && (
                  <span
                    className={`text-[10px] font-mono px-1.5 py-0.2 rounded-full ${
                      isActive ? 'bg-slate-950/20 text-slate-950 font-black' : 'bg-slate-900 text-slate-400'
                    }`}
                  >
                    {tab.count}
                  </span>
                )}
                {tab.badge && (
                  <span
                    className={`text-[9px] px-1.5 py-0.2 rounded-full border ${tab.badgeColor || ''}`}
                  >
                    {tab.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* 3. Render Active Sub-Tab Container */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-4 sm:p-6 lg:p-8 shadow-2xl">
        {activeSubTab === 'products' && <ProductsManager />}
        {activeSubTab === 'categories' && <CategoriesManager />}
        {activeSubTab === 'loyalty' && <LoyaltyManager />}
        {activeSubTab === 'orders' && <OrdersManager />}
        {activeSubTab === 'wallets' && <WalletsManager />}
        {activeSubTab === 'accounting' && <POSAccountingReports />}
        {activeSubTab === 'settings' && <StoreSettingsEditor />}
      </div>
    </div>
  );
};
