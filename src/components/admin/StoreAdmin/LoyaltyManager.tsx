import React, { useState } from 'react';
import { useStore } from '../../../context/StoreContext';
import { LoyaltyConfig, LoyaltyMember } from '../../../types/store';
import {
  Award,
  Crown,
  Gift,
  Coins,
  Plus,
  Save,
  Check,
  Search,
  UserCheck,
  TrendingUp,
  Percent,
  Sparkles,
  ShieldAlert,
} from 'lucide-react';

export const LoyaltyManager: React.FC = () => {
  const { storeConfig, updateStoreConfig, formatPrice } = useStore();

  const [loyalty, setLoyalty] = useState<LoyaltyConfig>(
    storeConfig.loyalty || {
      isEnabled: true,
      pointsPerCurrencyUnit: 0.01,
      pointValueInCurrency: 1,
      bronzeTierMinPoints: 0,
      silverTierMinPoints: 500,
      goldTierMinPoints: 2000,
      diamondTierMinPoints: 5000,
      members: [],
    }
  );

  const [members, setMembers] = useState<LoyaltyMember[]>(loyalty.members || []);
  const [searchMember, setSearchMember] = useState('');
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Adjust points modal
  const [selectedMember, setSelectedMember] = useState<LoyaltyMember | null>(null);
  const [pointsChange, setPointsChange] = useState<number>(100);
  const [adjustType, setAdjustType] = useState<'add' | 'deduct'>('add');
  const [adjustReason, setAdjustReason] = useState('مكافأة ولاء تشجيعية');

  // Add new member form
  const [isAddingMember, setIsAddingMember] = useState(false);
  const [newMemberName, setNewMemberName] = useState('');
  const [newMemberPhone, setNewMemberPhone] = useState('');
  const [newMemberCity, setNewMemberCity] = useState('صنعاء');
  const [newMemberInitialPoints, setNewMemberInitialPoints] = useState(200);

  const handleSaveConfig = () => {
    const updated = { ...loyalty, members };
    setLoyalty(updated);
    updateStoreConfig({ loyalty: updated });
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  const handleConfirmAdjust = () => {
    if (!selectedMember) return;
    const diff = adjustType === 'add' ? pointsChange : -pointsChange;
    const newPoints = Math.max(0, selectedMember.points + diff);

    // recalculate tier
    let newTier: LoyaltyMember['tier'] = 'bronze';
    if (newPoints >= loyalty.diamondTierMinPoints) newTier = 'diamond';
    else if (newPoints >= loyalty.goldTierMinPoints) newTier = 'gold';
    else if (newPoints >= loyalty.silverTierMinPoints) newTier = 'silver';

    const updated = members.map((m) =>
      m.id === selectedMember.id ? { ...m, points: newPoints, tier: newTier } : m
    );
    setMembers(updated);
    updateStoreConfig({ loyalty: { ...loyalty, members: updated } });
    setSelectedMember(null);
  };

  const handleAddNewMember = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMemberName.trim() || !newMemberPhone.trim()) return;

    let initialTier: LoyaltyMember['tier'] = 'bronze';
    if (newMemberInitialPoints >= loyalty.diamondTierMinPoints) initialTier = 'diamond';
    else if (newMemberInitialPoints >= loyalty.goldTierMinPoints) initialTier = 'gold';
    else if (newMemberInitialPoints >= loyalty.silverTierMinPoints) initialTier = 'silver';

    const newM: LoyaltyMember = {
      id: `mem-${Date.now()}`,
      name: newMemberName.trim(),
      phone: newMemberPhone.trim(),
      city: newMemberCity,
      points: newMemberInitialPoints,
      tier: initialTier,
      totalSpent: 0,
      ordersCount: 0,
      lastOrderDate: new Date().toISOString().split('T')[0],
    };

    const updated = [newM, ...members];
    setMembers(updated);
    updateStoreConfig({ loyalty: { ...loyalty, members: updated } });
    setIsAddingMember(false);
    setNewMemberName('');
    setNewMemberPhone('');
  };

  const filteredMembers = members.filter(
    (m) =>
      !searchMember.trim() ||
      m.name.toLowerCase().includes(searchMember.toLowerCase()) ||
      m.phone.includes(searchMember.trim()) ||
      m.city.toLowerCase().includes(searchMember.toLowerCase())
  );

  const getTierBadge = (tier: LoyaltyMember['tier']) => {
    switch (tier) {
      case 'diamond':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-black bg-cyan-500/20 text-cyan-300 border border-cyan-500/40">
            <Crown className="w-3 h-3 text-cyan-300" />
            <span>ماسي VIP</span>
          </span>
        );
      case 'gold':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-black bg-amber-500/20 text-amber-300 border border-amber-500/40">
            <Crown className="w-3 h-3 text-amber-400" />
            <span>عميل ذهبي</span>
          </span>
        );
      case 'silver':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-slate-400/20 text-slate-300 border border-slate-500/30">
            <Award className="w-3 h-3 text-slate-300" />
            <span>عميل فضي</span>
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-700/20 text-amber-400 border border-amber-700/30">
            <Award className="w-3 h-3 text-amber-500" />
            <span>عميل برونزي</span>
          </span>
        );
    }
  };

  return (
    <div className="space-y-6 text-right">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h3 className="text-lg font-bold text-white flex items-center gap-2">
            <Crown className="w-5 h-5 text-amber-400" />
            <span>برنامج ولاء العملاء والمكافآت (Loyalty & Rewards)</span>
          </h3>
          <p className="text-xs text-slate-400">
            اكتساب نقاط مع كل عملية شراء، استبدال النقاط بخصومات، وتصنيف العملاء حسب الرتب
          </p>
        </div>

        <button
          type="button"
          onClick={handleSaveConfig}
          className="px-6 py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs rounded-xl shadow-lg shadow-amber-500/20 flex items-center gap-2 transition-all cursor-pointer self-start"
        >
          {saveSuccess ? <Check className="w-4 h-4 text-emerald-950" /> : <Save className="w-4 h-4" />}
          <span>{saveSuccess ? 'تم حفظ النظام!' : 'حفظ إعدادات الولاء'}</span>
        </button>
      </div>

      {/* Rules & Program Parameters Card */}
      <div className="p-6 bg-slate-950 border border-slate-800 rounded-3xl space-y-5 shadow-lg">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="space-y-0.5">
            <h4 className="text-sm font-bold text-white flex items-center gap-2">
              <Coins className="w-4 h-4 text-amber-400" />
              <span>محددات اكتساب واستبدال النقاط</span>
            </h4>
            <p className="text-[11px] text-slate-400">
              تحديد معادلة تحويل المشتريات إلى نقاط، وقيمة النقطة الواحدة عند الخصم
            </p>
          </div>

          <label className="flex items-center gap-2 text-xs font-bold text-slate-300 cursor-pointer">
            <input
              type="checkbox"
              checked={loyalty.isEnabled}
              onChange={(e) => setLoyalty({ ...loyalty, isEnabled: e.target.checked })}
              className="rounded border-slate-700 text-amber-500 focus:ring-amber-500 w-4 h-4"
            />
            <span>تفعيل البرنامج</span>
          </label>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="space-y-1">
            <label className="text-[11px] font-bold text-slate-300">
              معدل اكتساب النقاط (نقطة لكل ريال)
            </label>
            <input
              type="number"
              step="0.001"
              value={loyalty.pointsPerCurrencyUnit}
              onChange={(e) =>
                setLoyalty({ ...loyalty, pointsPerCurrencyUnit: Number(e.target.value) })
              }
              className="w-full bg-slate-900 border border-slate-700 rounded-xl p-2.5 text-xs text-white focus:outline-none"
            />
            <span className="text-[10px] text-slate-500 block">
              0.01 = 1 نقطة لكل 100 ريال يمني
            </span>
          </div>

          <div className="space-y-1">
            <label className="text-[11px] font-bold text-slate-300">
              قيمة النقطة عند الاستبدال (ريال يمني)
            </label>
            <input
              type="number"
              value={loyalty.pointValueInCurrency}
              onChange={(e) =>
                setLoyalty({ ...loyalty, pointValueInCurrency: Number(e.target.value) })
              }
              className="w-full bg-slate-900 border border-slate-700 rounded-xl p-2.5 text-xs text-white focus:outline-none"
            />
            <span className="text-[10px] text-slate-500 block">
              1 = كل 1 نقطة تعطي 1 ريال خصم
            </span>
          </div>

          <div className="space-y-1">
            <label className="text-[11px] font-bold text-slate-300">حد الرتبة الفضية (نقطة)</label>
            <input
              type="number"
              value={loyalty.silverTierMinPoints}
              onChange={(e) =>
                setLoyalty({ ...loyalty, silverTierMinPoints: Number(e.target.value) })
              }
              className="w-full bg-slate-900 border border-slate-700 rounded-xl p-2.5 text-xs text-white focus:outline-none"
            />
          </div>

          <div className="space-y-1">
            <label className="text-[11px] font-bold text-slate-300">حد رتبة VIP الماسية (نقطة)</label>
            <input
              type="number"
              value={loyalty.diamondTierMinPoints}
              onChange={(e) =>
                setLoyalty({ ...loyalty, diamondTierMinPoints: Number(e.target.value) })
              }
              className="w-full bg-slate-900 border border-slate-700 rounded-xl p-2.5 text-xs text-white focus:outline-none"
            />
          </div>
        </div>

        {/* Tiers Overview Badges */}
        <div className="pt-3 border-t border-slate-800/80 grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="p-3 bg-slate-900/60 rounded-xl border border-slate-800 text-center space-y-1">
            <Award className="w-5 h-5 text-amber-600 mx-auto" />
            <strong className="block text-xs text-white">البرونزية</strong>
            <span className="text-[10px] text-slate-400">0 - {loyalty.silverTierMinPoints - 1} نقطة</span>
          </div>
          <div className="p-3 bg-slate-900/60 rounded-xl border border-slate-800 text-center space-y-1">
            <Award className="w-5 h-5 text-slate-300 mx-auto" />
            <strong className="block text-xs text-white">الفضية</strong>
            <span className="text-[10px] text-slate-400">{loyalty.silverTierMinPoints} - {loyalty.goldTierMinPoints - 1} نقطة</span>
          </div>
          <div className="p-3 bg-slate-900/60 rounded-xl border border-slate-800 text-center space-y-1">
            <Crown className="w-5 h-5 text-amber-400 mx-auto" />
            <strong className="block text-xs text-white">الذهبية</strong>
            <span className="text-[10px] text-slate-400">{loyalty.goldTierMinPoints} - {loyalty.diamondTierMinPoints - 1} نقطة</span>
          </div>
          <div className="p-3 bg-slate-900/60 rounded-xl border border-slate-800 text-center space-y-1">
            <Crown className="w-5 h-5 text-cyan-400 mx-auto" />
            <strong className="block text-xs text-white">الماسية (VIP)</strong>
            <span className="text-[10px] text-slate-400">+{loyalty.diamondTierMinPoints} نقطة</span>
          </div>
        </div>
      </div>

      {/* Customer Members Directory */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <h4 className="text-sm font-bold text-white flex items-center gap-2">
            <UserCheck className="w-4 h-4 text-amber-400" />
            <span>سجل وأرصدة العملاء في برنامج الولاء ({members.length})</span>
          </h4>

          <div className="flex items-center gap-2">
            <div className="relative">
              <input
                type="text"
                value={searchMember}
                onChange={(e) => setSearchMember(e.target.value)}
                placeholder="ابحث بالاسم أو الهاتف أو المدينة..."
                className="bg-slate-950 border border-slate-800 rounded-xl py-2 pr-8 pl-3 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500"
              />
              <Search className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2" />
            </div>

            <button
              type="button"
              onClick={() => setIsAddingMember(true)}
              className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs rounded-xl flex items-center gap-1.5 transition-colors cursor-pointer shrink-0"
            >
              <Plus className="w-3.5 h-3.5 text-amber-400" />
              <span>إدراج عميل</span>
            </button>
          </div>
        </div>

        {/* Add Member Modal Form */}
        {isAddingMember && (
          <form
            onSubmit={handleAddNewMember}
            className="p-5 bg-slate-950 border border-amber-500/40 rounded-2xl space-y-4 shadow-xl animate-in fade-in"
          >
            <h5 className="text-xs font-black text-amber-400">تسجيل عميل جديد في برنامج الولاء:</h5>
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
              <input
                type="text"
                required
                placeholder="اسم العميل *"
                value={newMemberName}
                onChange={(e) => setNewMemberName(e.target.value)}
                className="bg-slate-900 border border-slate-700 rounded-xl p-2.5 text-xs text-white focus:outline-none"
              />
              <input
                type="tel"
                required
                placeholder="رقم الهاتف *"
                value={newMemberPhone}
                onChange={(e) => setNewMemberPhone(e.target.value)}
                className="bg-slate-900 border border-slate-700 rounded-xl p-2.5 text-xs text-white focus:outline-none"
              />
              <input
                type="text"
                placeholder="المدينة"
                value={newMemberCity}
                onChange={(e) => setNewMemberCity(e.target.value)}
                className="bg-slate-900 border border-slate-700 rounded-xl p-2.5 text-xs text-white focus:outline-none"
              />
              <input
                type="number"
                placeholder="نقاط البداية الترحيبية"
                value={newMemberInitialPoints}
                onChange={(e) => setNewMemberInitialPoints(Number(e.target.value))}
                className="bg-slate-900 border border-slate-700 rounded-xl p-2.5 text-xs text-white focus:outline-none"
              />
            </div>
            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setIsAddingMember(false)}
                className="px-4 py-2 bg-slate-800 text-white text-xs rounded-xl"
              >
                إلغاء
              </button>
              <button
                type="submit"
                className="px-5 py-2 bg-amber-500 text-slate-950 font-black text-xs rounded-xl"
              >
                تسجيل العميل
              </button>
            </div>
          </form>
        )}

        {/* Adjust Points Modal */}
        {selectedMember && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
            <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-md w-full p-6 space-y-4 shadow-2xl relative text-right">
              <h4 className="text-sm font-black text-white">
                تعديل رصيد نقاط العميل: {selectedMember.name}
              </h4>
              <p className="text-xs text-slate-400">
                الرصيد الحالي: <strong className="text-amber-400 font-mono text-sm">{selectedMember.points} نقطة</strong>
              </p>

              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setAdjustType('add')}
                  className={`py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    adjustType === 'add'
                      ? 'bg-emerald-500 text-slate-950 font-black shadow'
                      : 'bg-slate-950 border border-slate-800 text-slate-400'
                  }`}
                >
                  + إضافة نقاط
                </button>
                <button
                  type="button"
                  onClick={() => setAdjustType('deduct')}
                  className={`py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    adjustType === 'deduct'
                      ? 'bg-red-500 text-white font-black shadow'
                      : 'bg-slate-950 border border-slate-800 text-slate-400'
                  }`}
                >
                  - خصم نقاط
                </button>
              </div>

              <div>
                <label className="text-[11px] font-bold text-slate-300">عدد النقاط:</label>
                <input
                  type="number"
                  min={1}
                  value={pointsChange}
                  onChange={(e) => setPointsChange(Number(e.target.value))}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-xs text-white mt-1 focus:outline-none"
                />
              </div>

              <div>
                <label className="text-[11px] font-bold text-slate-300">السبب أو الملاحظة:</label>
                <input
                  type="text"
                  value={adjustReason}
                  onChange={(e) => setAdjustReason(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-xs text-white mt-1 focus:outline-none"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setSelectedMember(null)}
                  className="px-4 py-2 bg-slate-800 text-white text-xs rounded-xl"
                >
                  إلغاء
                </button>
                <button
                  type="button"
                  onClick={handleConfirmAdjust}
                  className="px-5 py-2 bg-amber-500 text-slate-950 font-black text-xs rounded-xl"
                >
                  تأكيد التعديل
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Members Table */}
        <div className="bg-slate-950 border border-slate-800 rounded-2xl overflow-hidden shadow-lg">
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-right border-collapse">
              <thead>
                <tr className="bg-slate-900 text-slate-400 border-b border-slate-800">
                  <th className="p-3.5 font-bold">اسم العميل</th>
                  <th className="p-3.5 font-bold">رقم الهاتف / المدينة</th>
                  <th className="p-3.5 font-bold">الرتبة</th>
                  <th className="p-3.5 font-bold">رصيد النقاط</th>
                  <th className="p-3.5 font-bold">قيمة الخصم المستحقة</th>
                  <th className="p-3.5 font-bold">إجمالي المشتريات</th>
                  <th className="p-3.5 font-bold text-center">إجراءات</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/80">
                {filteredMembers.map((m) => (
                  <tr key={m.id} className="hover:bg-slate-900/40 transition-colors">
                    <td className="p-3.5 font-bold text-white">{m.name}</td>
                    <td className="p-3.5 text-slate-400 font-mono">
                      <div>{m.phone}</div>
                      <span className="text-[10px] text-slate-500 font-sans">{m.city}</span>
                    </td>
                    <td className="p-3.5">{getTierBadge(m.tier)}</td>
                    <td className="p-3.5 font-black text-amber-400 font-mono text-sm">
                      {m.points.toLocaleString()} نقطة
                    </td>
                    <td className="p-3.5 font-bold text-emerald-400">
                      {formatPrice(m.points * (loyalty.pointValueInCurrency || 1))}
                    </td>
                    <td className="p-3.5 text-slate-300 font-mono">
                      {formatPrice(m.totalSpent)}
                      <span className="block text-[10px] text-slate-500">
                        {m.ordersCount} طلبات
                      </span>
                    </td>
                    <td className="p-3.5 text-center">
                      <button
                        type="button"
                        onClick={() => setSelectedMember(m)}
                        className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-amber-400 rounded-xl border border-slate-800 transition-colors cursor-pointer text-[11px] font-bold"
                      >
                        تعديل النقاط
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};
