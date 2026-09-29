import React, { useState } from 'react';
import { useCMS } from '../../context/CMSContext';
import { Sparkles, Image as ImageIcon, Loader2, Check, X, Wand2 } from 'lucide-react';

interface AIImageModalProps {
  isOpen: boolean;
  onClose: () => void;
  onApplyImage: (imageUrl: string) => void;
  title?: string;
  defaultPrompt?: string;
  recommendedDimensions?: string;
  aspectRatio?: '16:9' | '9:16' | '1:1' | '4:3';
}

export const AIImageModal: React.FC<AIImageModalProps> = ({
  isOpen,
  onClose,
  onApplyImage,
  title = 'توليد صورة احترافية بالذكاء الاصطناعي',
  defaultPrompt = 'خلفية فاخرة لتطوير الأعمال والحلول الذكية باللون الكحلي والذهبي الراقية',
  recommendedDimensions = '1920x1080 (16:9)',
  aspectRatio = '16:9',
}) => {
  const { generateAIImage } = useCMS();
  const [prompt, setPrompt] = useState(defaultPrompt);
  const [selectedRatio, setSelectedRatio] = useState<'16:9' | '9:16' | '1:1' | '4:3'>(aspectRatio);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleGenerate = async () => {
    if (!prompt.trim()) return;
    setLoading(true);
    setError(null);
    try {
      const resultUrl = await generateAIImage(prompt, selectedRatio);
      setGeneratedImage(resultUrl);
    } catch (err: any) {
      setError(err.message || 'حدث خطأ أثناء توليد الصورة بالذكاء الاصطناعي');
    } finally {
      setLoading(false);
    }
  };

  const handleApply = () => {
    if (generatedImage) {
      onApplyImage(generatedImage);
      onClose();
    }
  };

  const samplePrompts = [
    'مبنى استثماري ذكي مع إضاءات ذهبية وسماء ليلية فاخرة',
    'غرفة اجتماعات تنفيذية راقية بلمسات تكنولوجية ودراسات بيانية',
    'شبكة بيانات سحابية متقدمة مجسمة بالذكاء الاصطناعي بألوان كحلية',
    'تصوير سينمائي عمودي لجوال يستعرض تطبيقا ذكيا لخدمات الأعمال',
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-md p-4 animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-slate-700/80 rounded-2xl w-full max-w-2xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-900/60">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-amber-500/10 text-amber-400 rounded-xl border border-amber-500/20">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">{title}</h3>
              <p className="text-xs text-slate-400">المقاسات والتصاميم الموصى بها: <span className="text-amber-400 font-mono">{recommendedDimensions}</span></p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-5 flex-1 custom-scrollbar">
          {/* Prompt input */}
          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-200 flex items-center justify-between">
              <span>الوصف النصي للصورة (Prompt):</span>
              <span className="text-xs text-slate-400">ادخل تفاصيل المشهد والعناصر والنمط</span>
            </label>
            <textarea
              rows={3}
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="اكتب وصف الصورة باللغة العربية أو الإنجليزية..."
              className="w-full bg-slate-950 border border-slate-700/80 rounded-xl p-3 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500"
            />
          </div>

          {/* Prompt Presets */}
          <div className="space-y-1.5">
            <span className="text-xs font-medium text-slate-400">نماذج برومبت مقترحة:</span>
            <div className="flex flex-wrap gap-2">
              {samplePrompts.map((p, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => setPrompt(p)}
                  className="text-xs bg-slate-800 hover:bg-slate-700 text-slate-300 px-3 py-1.5 rounded-lg border border-slate-700/60 transition-colors text-right"
                >
                  ✨ {p}
                </button>
              ))}
            </div>
          </div>

          {/* Aspect Ratio Picker */}
          <div className="space-y-2">
            <label className="text-xs font-semibold text-slate-300">نسبة العرض إلى الارتفاع (Aspect Ratio):</label>
            <div className="grid grid-cols-4 gap-2">
              {[
                { id: '16:9', label: '16:9 (أفقي واسع / هيرو)', icon: '📐' },
                { id: '9:16', label: '9:16 (عمودي / جوال)', icon: '📱' },
                { id: '1:1', label: '1:1 (مربع / بطاقات)', icon: '🔲' },
                { id: '4:3', label: '4:3 (تلفزيوني / كلاسيك)', icon: '🖼️' },
              ].map((ratio) => (
                <button
                  key={ratio.id}
                  type="button"
                  onClick={() => setSelectedRatio(ratio.id as any)}
                  className={`p-2.5 rounded-xl border text-xs font-medium flex flex-col items-center justify-center gap-1 transition-all ${
                    selectedRatio === ratio.id
                      ? 'bg-amber-500/10 border-amber-500 text-amber-400 font-bold'
                      : 'bg-slate-800/60 border-slate-700/60 text-slate-400 hover:bg-slate-800'
                  }`}
                >
                  <span className="text-base">{ratio.icon}</span>
                  <span>{ratio.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Error display */}
          {error && (
            <div className="p-3 bg-red-500/10 border border-red-500/30 rounded-xl text-xs text-red-400">
              {error}
            </div>
          )}

          {/* Preview container */}
          <div className="space-y-2">
            <span className="text-xs font-semibold text-slate-300">معاينة الصورة الموالدة:</span>
            <div className="relative min-h-[200px] bg-slate-950 border border-dashed border-slate-700 rounded-xl overflow-hidden flex items-center justify-center">
              {loading ? (
                <div className="flex flex-col items-center gap-3 py-10">
                  <Loader2 className="w-8 h-8 text-amber-400 animate-spin" />
                  <p className="text-xs text-amber-300/90 font-medium">جاري معالجة برومبت الذكاء الاصطناعي وتوليد الصورة...</p>
                </div>
              ) : generatedImage ? (
                <img
                  src={generatedImage}
                  alt="Generated AI result"
                  className="w-full max-h-[320px] object-contain rounded-lg"
                />
              ) : (
                <div className="flex flex-col items-center gap-2 p-6 text-slate-500 text-center">
                  <ImageIcon className="w-10 h-10 stroke-[1.5]" />
                  <span className="text-xs">اضغط على زر "توليد الصورة الان" للبدء</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-slate-800 bg-slate-900/80">
          <button
            type="button"
            onClick={handleGenerate}
            disabled={loading || !prompt.trim()}
            className="px-5 py-2.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold rounded-xl text-xs flex items-center gap-2 shadow-lg shadow-amber-500/20 disabled:opacity-50 transition-all"
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Wand2 className="w-4 h-4" />}
            <span>توليد الصورة بالذكاء الاصطناعي</span>
          </button>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 font-medium text-xs rounded-xl transition-colors"
            >
              إلغاء
            </button>
            <button
              type="button"
              onClick={handleApply}
              disabled={!generatedImage}
              className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl flex items-center gap-1.5 disabled:opacity-50 transition-colors"
            >
              <Check className="w-4 h-4" />
              <span>اعتماد الصورة واستخدامها</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
