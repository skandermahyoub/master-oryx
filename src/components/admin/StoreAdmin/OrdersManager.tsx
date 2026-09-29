import React, { useState } from 'react';
import { useStore } from '../../../context/StoreContext';
import { StoreOrder } from '../../../types/store';
import {
  FileText,
  Search,
  CheckCircle,
  Clock,
  Truck,
  XCircle,
  MessageCircle,
  Download,
  Filter,
  Eye,
} from 'lucide-react';

export const OrdersManager: React.FC = () => {
  const { orders, updateOrderStatus, formatPrice, sendOrderViaWhatsApp } = useStore();
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedOrder, setSelectedOrder] = useState<StoreOrder | null>(null);

  const filteredOrders = orders.filter((ord) => {
    const matchesStatus = filterStatus === 'all' || ord.status === filterStatus;
    const matchesSearch =
      !searchQuery.trim() ||
      ord.orderNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ord.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ord.customerPhone.includes(searchQuery.trim());
    return matchesStatus && matchesSearch;
  });

  const getStatusBadge = (status: StoreOrder['status']) => {
    switch (status) {
      case 'new':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/10 text-amber-400 border border-amber-500/20">
            <Clock className="w-3 h-3" />
            <span>طلب جديد</span>
          </span>
        );
      case 'processing':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-blue-500/10 text-blue-400 border border-blue-500/20">
            <Clock className="w-3 h-3" />
            <span>قيد التجهيز</span>
          </span>
        );
      case 'shipped':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-purple-500/10 text-purple-400 border border-purple-500/20">
            <Truck className="w-3 h-3" />
            <span>تم الشحن</span>
          </span>
        );
      case 'completed':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            <CheckCircle className="w-3 h-3" />
            <span>مكتمل</span>
          </span>
        );
      case 'cancelled':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-red-500/10 text-red-400 border border-red-500/20">
            <XCircle className="w-3 h-3" />
            <span>ملغي</span>
          </span>
        );
    }
  };

  const exportOrdersCSV = () => {
    const headers = ['رقم الطلب', 'التاريخ', 'اسم العميل', 'الهاتف', 'المدينة', 'طريقة الدفع', 'الإجمالي', 'الحالة'];
    const rows = orders.map((o) => [
      o.orderNumber,
      o.createdAt,
      `"${o.customerName}"`,
      `"${o.customerPhone}"`,
      `"${o.customerCity}"`,
      `"${o.paymentMethod}"`,
      o.total,
      o.status,
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,\uFEFF' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `oryx_orders_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6 text-right">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h3 className="text-lg font-bold text-white flex items-center gap-2">
            <FileText className="w-5 h-5 text-amber-400" />
            <span>مدير الطلبات والمبيعات ({orders.length})</span>
          </h3>
          <p className="text-xs text-slate-400">
            متابعة الطلبات الواردة من المتجر ونقاط البيع وتحديث حالتها
          </p>
        </div>

        <button
          type="button"
          onClick={exportOrdersCSV}
          className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs rounded-xl flex items-center gap-1.5 transition-colors cursor-pointer self-start"
        >
          <Download className="w-4 h-4 text-amber-400" />
          <span>تصدير إلى Excel (CSV)</span>
        </button>
      </div>

      {/* Filters & Search */}
      <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
        <div className="sm:col-span-8 relative">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="ابحث برقم الطلب، اسم العميل، أو رقم الهاتف..."
            className="w-full bg-slate-950 border border-slate-800 rounded-xl py-2.5 pr-10 pl-3 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500"
          />
          <Search className="w-4 h-4 text-slate-400 absolute right-3.5 top-1/2 -translate-y-1/2" />
        </div>

        <div className="sm:col-span-4">
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-xs text-white focus:outline-none focus:border-amber-500 cursor-pointer"
          >
            <option value="all">جميع الحالات ({orders.length})</option>
            <option value="new">طلبات جديدة</option>
            <option value="processing">قيد التجهيز</option>
            <option value="shipped">تم الشحن</option>
            <option value="completed">مكتملة</option>
            <option value="cancelled">ملغية</option>
          </select>
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-slate-950 border border-slate-800 rounded-2xl overflow-hidden shadow-lg">
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-right border-collapse">
            <thead>
              <tr className="bg-slate-900 text-slate-400 border-b border-slate-800">
                <th className="p-3.5 font-bold">رقم الطلب</th>
                <th className="p-3.5 font-bold">العميل</th>
                <th className="p-3.5 font-bold">التاريخ</th>
                <th className="p-3.5 font-bold">المبلغ</th>
                <th className="p-3.5 font-bold">طريقة الدفع</th>
                <th className="p-3.5 font-bold">الحالة</th>
                <th className="p-3.5 font-bold text-center">إجراءات</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80">
              {filteredOrders.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-slate-500">
                    لا توجد طلبات تطابق الفلتر الحالي
                  </td>
                </tr>
              ) : (
                filteredOrders.map((ord) => (
                  <tr key={ord.id} className="hover:bg-slate-900/40 transition-colors">
                    <td className="p-3.5 font-mono font-bold text-amber-400">
                      #{ord.orderNumber}
                      {ord.isPOSOrder && (
                        <span className="block text-[9px] text-purple-400 font-sans font-bold">
                          نقطة بيع POS
                        </span>
                      )}
                    </td>
                    <td className="p-3.5">
                      <strong className="block text-white">{ord.customerName}</strong>
                      <span className="text-[10px] text-slate-500 font-mono">
                        {ord.customerPhone} ({ord.customerCity})
                      </span>
                    </td>
                    <td className="p-3.5 text-slate-400 font-mono text-[11px]">
                      {ord.createdAt}
                    </td>
                    <td className="p-3.5 font-black text-amber-400">
                      {formatPrice(ord.total, ord.currency)}
                    </td>
                    <td className="p-3.5 text-slate-300">
                      <span className="max-w-xs truncate block text-[11px]">
                        {ord.paymentMethod}
                      </span>
                    </td>
                    <td className="p-3.5">
                      <select
                        value={ord.status}
                        onChange={(e) => updateOrderStatus(ord.id, e.target.value as any)}
                        className="bg-slate-900 border border-slate-700 rounded-lg px-2 py-1 text-[11px] text-white focus:outline-none cursor-pointer"
                      >
                        <option value="new">طلب جديد</option>
                        <option value="processing">قيد التجهيز</option>
                        <option value="shipped">تم الشحن</option>
                        <option value="completed">مكتمل</option>
                        <option value="cancelled">ملغي</option>
                      </select>
                    </td>
                    <td className="p-3.5">
                      <div className="flex items-center justify-center gap-1.5">
                        <button
                          type="button"
                          onClick={() => sendOrderViaWhatsApp(ord)}
                          className="p-2 bg-slate-900 hover:bg-emerald-600/20 text-emerald-400 rounded-xl border border-slate-800 transition-colors cursor-pointer"
                          title="إرسال الفاتورة عبر واتساب"
                        >
                          <MessageCircle className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => setSelectedOrder(ord)}
                          className="p-2 bg-slate-900 hover:bg-slate-800 text-slate-300 rounded-xl border border-slate-800 transition-colors cursor-pointer"
                          title="تفاصيل الطلب"
                        >
                          <Eye className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Order Details Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-lg w-full p-6 space-y-4 shadow-2xl relative text-right">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h4 className="text-sm font-black text-white">
                تفاصيل الطلب #{selectedOrder.orderNumber}
              </h4>
              <button
                type="button"
                onClick={() => setSelectedOrder(null)}
                className="text-slate-400 hover:text-white text-xs cursor-pointer"
              >
                إغلاق
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="p-3 bg-slate-950 rounded-xl space-y-1">
                <div>العميل: <strong className="text-white">{selectedOrder.customerName}</strong></div>
                <div>الهاتف: <strong className="text-white font-mono">{selectedOrder.customerPhone}</strong></div>
                <div>العنوان: <strong className="text-white">{selectedOrder.customerCity} - {selectedOrder.customerAddress}</strong></div>
                {selectedOrder.customerNotes && (
                  <div>ملاحظات: <span className="text-amber-400">{selectedOrder.customerNotes}</span></div>
                )}
              </div>

              <div className="space-y-1.5">
                <span className="font-bold text-slate-400">المنتجات المطلوبة:</span>
                {selectedOrder.items.map((it, idx) => (
                  <div key={idx} className="flex justify-between p-2 bg-slate-950 rounded-lg">
                    <span>{it.quantity}x {it.product.name}</span>
                    <strong className="text-amber-400">{formatPrice(it.price * it.quantity, selectedOrder.currency)}</strong>
                  </div>
                ))}
              </div>

              <div className="pt-2 border-t border-slate-800 flex justify-between font-black text-white">
                <span>الإجمالي الكلي:</span>
                <span className="text-amber-400">{formatPrice(selectedOrder.total, selectedOrder.currency)}</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
