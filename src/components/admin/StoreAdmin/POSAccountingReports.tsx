import React from 'react';
import { useStore } from '../../../context/StoreContext';
import {
  TrendingUp,
  DollarSign,
  ShoppingBag,
  CreditCard,
  Percent,
  CheckCircle,
  Package,
} from 'lucide-react';

export const POSAccountingReports: React.FC = () => {
  const { orders, storeConfig, formatPrice } = useStore();

  // Completed & Valid orders
  const validOrders = orders.filter((o) => o.status !== 'cancelled');

  const totalRevenue = validOrders.reduce((sum, o) => sum + o.total, 0);

  // Total cost calculation based on items
  const totalCost = validOrders.reduce((sum, o) => {
    const orderCost = o.items.reduce((iSum, it) => {
      const itemCost = it.product.costPrice || it.price * 0.7; // fallback 70%
      return iSum + itemCost * it.quantity;
    }, 0);
    return sum + orderCost;
  }, 0);

  const netProfit = Math.max(0, totalRevenue - totalCost);
  const profitMarginPercentage =
    totalRevenue > 0 ? Math.round((netProfit / totalRevenue) * 100) : 0;
  const averageOrderValue =
    validOrders.length > 0 ? Math.round(totalRevenue / validOrders.length) : 0;

  // Top Selling Products Calculation
  const productSalesMap: Record<string, { name: string; qty: number; totalRev: number }> = {};
  validOrders.forEach((ord) => {
    ord.items.forEach((it) => {
      if (!productSalesMap[it.productId]) {
        productSalesMap[it.productId] = { name: it.product.name, qty: 0, totalRev: 0 };
      }
      productSalesMap[it.productId].qty += it.quantity;
      productSalesMap[it.productId].totalRev += it.price * it.quantity;
    });
  });

  const topProducts = Object.values(productSalesMap)
    .sort((a, b) => b.qty - a.qty)
    .slice(0, 5);

  return (
    <div className="space-y-6 text-right">
      <div>
        <h3 className="text-lg font-bold text-white flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-amber-400" />
          <span>المحاسبة والتقارير المالية والأرباح</span>
        </h3>
        <p className="text-xs text-slate-400">
          تحليل المبيعات، تكاليف البضاعة، الأرباح الصافية، ومتوسط قيمة الفواتير
        </p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Revenue */}
        <div className="p-4 bg-slate-950 border border-slate-800 rounded-2xl space-y-1">
          <div className="flex items-center justify-between text-slate-400 text-xs">
            <span>إجمالي المبيعات (Revenue)</span>
            <DollarSign className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-xl font-black text-white">{formatPrice(totalRevenue)}</div>
          <div className="text-[10px] text-slate-500">من {validOrders.length} طلبات مؤكدة</div>
        </div>

        {/* Net Profit */}
        <div className="p-4 bg-slate-950 border border-slate-800 rounded-2xl space-y-1">
          <div className="flex items-center justify-between text-slate-400 text-xs">
            <span>صافي الأرباح (Net Profit)</span>
            <TrendingUp className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-xl font-black text-emerald-400">+{formatPrice(netProfit)}</div>
          <div className="text-[10px] text-emerald-500/80 font-bold">
            هامش ربح {profitMarginPercentage}%
          </div>
        </div>

        {/* Cost of Goods */}
        <div className="p-4 bg-slate-950 border border-slate-800 rounded-2xl space-y-1">
          <div className="flex items-center justify-between text-slate-400 text-xs">
            <span>تكلفة البضاعة المباعة (COGS)</span>
            <CreditCard className="w-4 h-4 text-rose-400" />
          </div>
          <div className="text-xl font-black text-slate-300">{formatPrice(totalCost)}</div>
          <div className="text-[10px] text-slate-500">سعر شراء وتوريد المنتجات</div>
        </div>

        {/* Average Order Value */}
        <div className="p-4 bg-slate-950 border border-slate-800 rounded-2xl space-y-1">
          <div className="flex items-center justify-between text-slate-400 text-xs">
            <span>متوسط قيمة الطلب (AOV)</span>
            <ShoppingBag className="w-4 h-4 text-purple-400" />
          </div>
          <div className="text-xl font-black text-amber-300">{formatPrice(averageOrderValue)}</div>
          <div className="text-[10px] text-slate-500">متوسط السلة لكل عميل</div>
        </div>
      </div>

      {/* Top Products Breakdown */}
      <div className="bg-slate-950 border border-slate-800 rounded-2xl p-5 space-y-4">
        <h4 className="text-sm font-bold text-white flex items-center gap-2">
          <Package className="w-4 h-4 text-amber-400" />
          <span>المنتجات الأكثر مبيعاً وتحقيقاً للإيرادات:</span>
        </h4>

        {topProducts.length === 0 ? (
          <p className="text-xs text-slate-500 text-center py-6">
            ستظهر المنتجات الأكثر مبيعاً هنا فور تسجيل مبيعات جديدة.
          </p>
        ) : (
          <div className="space-y-2.5">
            {topProducts.map((tp, idx) => (
              <div
                key={idx}
                className="p-3 bg-slate-900 border border-slate-800/80 rounded-xl flex items-center justify-between text-xs"
              >
                <div className="flex items-center gap-2.5 overflow-hidden">
                  <span className="w-5 h-5 rounded-full bg-amber-500/20 text-amber-400 font-bold flex items-center justify-center text-[10px]">
                    {idx + 1}
                  </span>
                  <strong className="text-white truncate max-w-xs">{tp.name}</strong>
                </div>

                <div className="flex items-center gap-4 shrink-0 font-mono">
                  <span className="text-slate-400">{tp.qty} مبيعات</span>
                  <span className="font-bold text-amber-400">{formatPrice(tp.totalRev)}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
