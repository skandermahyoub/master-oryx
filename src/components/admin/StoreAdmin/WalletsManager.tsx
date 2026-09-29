import React, { useState } from 'react';
import { useStore } from '../../../context/StoreContext';
import { YemeniWallet } from '../../../types/store';
import { Building, Plus, Trash2, Edit, Save, Check, Copy } from 'lucide-react';

export const WalletsManager: React.FC = () => {
  const { storeConfig, updateStoreConfig } = useStore();
  const [wallets, setWallets] = useState<YemeniWallet[]>(storeConfig.yemeniWallets || []);
  const [editingWallet, setEditingWallet] = useState<YemeniWallet | null>(null);
  const [isAdding, setIsAdding] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const handleSaveAll = (updated: YemeniWallet[]) => {
    setWallets(updated);
    updateStoreConfig({ yemeniWallets: updated });
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  const handleStartAdd = () => {
    const newWallet: YemeniWallet = {
      id: `wallet-${Date.now()}`,
      name: 'محفظة يمنية جديدة',
      shortCode: 'wallet',
      accountNumber: '770000000',
      accountHolder: 'اسم المستلم / المؤسسة',
      instructions: 'يرجى إرسال إشعار السند بعد التحويل.',
      isActive: true,
    };
    setEditingWallet(newWallet);
    setIsAdding(true);
  };

  const handleDelete = (id: string) => {
    if (confirm('هل أنت متأكد من حذف هذه المحفظة؟')) {
      const updated = wallets.filter((w) => w.id !== id);
      handleSaveAll(updated);
    }
  };

  const handleSaveWallet = (wallet: YemeniWallet) => {
    let updated: YemeniWallet[];
    if (isAdding) {
      updated = [...wallets, wallet];
    } else {
      updated = wallets.map((w) => (w.id === wallet.id ? wallet : w));
    }
    handleSaveAll(updated);
    setEditingWallet(null);
    setIsAdding(false);
  };

  return (
    <div className="space-y-6 text-right">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-bold text-white flex items-center gap-2">
            <Building className="w-5 h-5 text-amber-400" />
            <span>مدير المحافظ والحسابات الرقمية اليمنية ({wallets.length})</span>
          </h3>
          <p className="text-xs text-slate-400">
            تخصيص أرقام حسابات الكريمي، كاش، ون كاش، جيب، فلوسك لتسهيل النسخ والتحويل للعملاء
          </p>
        </div>

        <button
          type="button"
          onClick={handleStartAdd}
          className="px-5 py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs rounded-xl shadow-lg shadow-amber-500/20 flex items-center gap-1.5 transition-all cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>إضافة محفظة أو حساب</span>
        </button>
      </div>

      {saveSuccess && (
        <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-xl text-xs text-emerald-400 font-bold text-center">
          تم حفظ بيانات المحافظ بنجاح!
        </div>
      )}

      {/* Edit Form */}
      {editingWallet && (
        <div className="p-6 bg-slate-950 border border-amber-500/40 rounded-3xl space-y-4 shadow-2xl">
          <h4 className="text-sm font-black text-amber-400 border-b border-slate-800 pb-2">
            {isAdding ? 'إضافة محفظة رقمية جديدة' : `تعديل: ${editingWallet.name}`}
          </h4>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-bold text-slate-300">اسم البنك / المحفظة *</label>
              <input
                type="text"
                value={editingWallet.name}
                onChange={(e) => setEditingWallet({ ...editingWallet, name: e.target.value })}
                placeholder="مثال: بنك الكريمي (حساب تجاري)"
                className="w-full bg-slate-900 border border-slate-700 rounded-xl p-2.5 text-xs text-white mt-1 focus:outline-none"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-300">
                رقم الحساب / رقم المحفظة (القابل للنسخ) *
              </label>
              <input
                type="text"
                value={editingWallet.accountNumber}
                onChange={(e) =>
                  setEditingWallet({ ...editingWallet, accountNumber: e.target.value })
                }
                placeholder="رقم الحساب أو الهاتف"
                className="w-full bg-slate-900 border border-slate-700 rounded-xl p-2.5 text-xs text-white mt-1 focus:outline-none font-mono"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-300">اسم صاحب الحساب / المؤسسة *</label>
              <input
                type="text"
                value={editingWallet.accountHolder}
                onChange={(e) =>
                  setEditingWallet({ ...editingWallet, accountHolder: e.target.value })
                }
                placeholder="الاسم كما يظهر في كشف الحساب"
                className="w-full bg-slate-900 border border-slate-700 rounded-xl p-2.5 text-xs text-white mt-1 focus:outline-none"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-300">التعليمات والملاحظات:</label>
              <input
                type="text"
                value={editingWallet.instructions || ''}
                onChange={(e) =>
                  setEditingWallet({ ...editingWallet, instructions: e.target.value })
                }
                placeholder="مثال: إرسال صورة السند عبر واتساب"
                className="w-full bg-slate-900 border border-slate-700 rounded-xl p-2.5 text-xs text-white mt-1 focus:outline-none"
              />
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-3 border-t border-slate-800">
            <button
              type="button"
              onClick={() => {
                setEditingWallet(null);
                setIsAdding(false);
              }}
              className="px-5 py-2 bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold rounded-xl cursor-pointer"
            >
              إلغاء
            </button>
            <button
              type="button"
              onClick={() => handleSaveWallet(editingWallet)}
              className="px-6 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs rounded-xl shadow cursor-pointer"
            >
              حفظ
            </button>
          </div>
        </div>
      )}

      {/* Wallets Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {wallets.map((w) => (
          <div
            key={w.id}
            className="p-4 bg-slate-950 border border-slate-800 rounded-2xl space-y-3 relative group"
          >
            <div className="flex items-start justify-between">
              <div className="space-y-1">
                <strong className="text-xs font-bold text-white block">{w.name}</strong>
                <span className="text-[11px] text-slate-400 block">
                  صاحب الحساب: <strong className="text-slate-200">{w.accountHolder}</strong>
                </span>
              </div>

              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={() => {
                    setEditingWallet(w);
                    setIsAdding(false);
                  }}
                  className="p-1.5 bg-slate-900 hover:bg-slate-800 text-amber-400 rounded-lg border border-slate-800 transition-colors cursor-pointer"
                  title="تعديل"
                >
                  <Edit className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => handleDelete(w.id)}
                  className="p-1.5 bg-slate-900 hover:bg-red-500/10 text-slate-500 hover:text-red-400 rounded-lg border border-slate-800 transition-colors cursor-pointer"
                  title="حذف"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            <div className="p-2.5 bg-slate-900 border border-slate-800 rounded-xl flex items-center justify-between">
              <span className="text-xs font-mono font-bold text-amber-400">{w.accountNumber}</span>
              <span className="text-[10px] text-slate-500">جاهز للنسخ بنقرة زر في المتجر</span>
            </div>

            {w.instructions && (
              <p className="text-[10px] text-slate-400">{w.instructions}</p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
