'use client';

import { useState, useCallback, useEffect } from 'react';

interface DesignScheme {
  id: number;
  name: string;
  colors: { primary: string; secondary: string; background: string; text: string };
  fonts: { heading: string; body: string };
  description: string;
  shopifyCode: string;
}

const industries = ['Fashion', 'Tech', 'Food & Beverage', 'Home & Living', 'Jewelry', 'Other'];

const colorLabels: { key: keyof DesignScheme['colors']; label: string }[] = [
  { key: 'primary', label: 'Primary' },
  { key: 'secondary', label: 'Secondary' },
  { key: 'background', label: 'Background' },
  { key: 'text', label: 'Text' },
];

export default function HomePage() {
  const [industry, setIndustry] = useState('');
  const [style, setStyle] = useState('');
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<DesignScheme[]>([]);
  const [copiedId, setCopiedId] = useState<number | null>(null);
  const [copiedColor, setCopiedColor] = useState<string | null>(null);
  const [toast, setToast] = useState<string | null>(null);

  const showToast = useCallback((message: string) => {
    setToast(message);
  }, []);

  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => setToast(null), 1500);
      return () => clearTimeout(timer);
    }
  }, [toast]);

  const handleGenerate = useCallback(async () => {
    setLoading(true);
    setResults([]);
    try {
      const res = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ industry, style }),
      });
      const data: DesignScheme[] = await res.json();
      setResults(data);
    } catch {
      // fallback silently
    } finally {
      setLoading(false);
    }
  }, [industry, style]);

  const handleCopyCode = useCallback(async (code: string, id: number) => {
    await navigator.clipboard.writeText(code);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  }, []);

  const handleCopyColor = useCallback(async (color: string) => {
    await navigator.clipboard.writeText(color);
    setCopiedColor(color);
    showToast('Copied!');
  }, [showToast]);

  return (
    <main className="min-h-screen px-4 py-12 md:py-20">
      {/* Toast Notification */}
      {toast && (
        <div className="fixed top-6 left-1/2 -translate-x-1/2 z-50 animate-toast-in">
          <div className="px-4 py-2 bg-gray-800 text-white text-sm font-medium rounded-lg shadow-lg flex items-center gap-2">
            <svg className="w-4 h-4 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            {toast}
          </div>
        </div>
      )}

      {/* Header */}
      <header className="text-center mb-12 relative">
        <div className="absolute top-full left-1/2 -translate-x-1/2 mt-6 w-48 h-1 bg-gradient-to-r from-transparent via-[#6C63FF] to-transparent rounded-full opacity-60" />
        
        <h1 className="text-5xl md:text-6xl font-bold gradient-text mb-4 tracking-tight">
          🎨 Stylie
        </h1>
        <p className="text-gray-500 text-lg md:text-xl max-w-xl mx-auto">
          Describe your store vibe, AI generates your perfect theme
        </p>
      </header>

      {/* Form */}
      <div className="max-w-xl mx-auto mb-16">
        <div className="bg-white rounded-2xl shadow-xl p-6 md:p-8 space-y-5 border border-gray-100">
          {/* Industry Select */}
          <div>
            <label className="block text-sm font-semibold text-gray-600 mb-2">
              Industry
            </label>
            <select
              value={industry}
              onChange={(e) => setIndustry(e.target.value)}
              className="w-full px-4 py-3.5 rounded-xl border-2 border-gray-200 focus:border-[#6C63FF] focus:ring-4 focus:ring-[#6C63FF]/10 outline-none transition-all text-gray-600 bg-white shadow-sm hover:border-gray-300 cursor-pointer"
            >
              <option value="">Select your industry...</option>
              {industries.map((ind) => (
                <option key={ind} value={ind}>
                  {ind}
                </option>
              ))}
            </select>
          </div>

          {/* Style Input */}
          <div>
            <label className="block text-sm font-semibold text-gray-600 mb-2">
              Style Description
            </label>
            <input
              type="text"
              value={style}
              onChange={(e) => setStyle(e.target.value)}
              placeholder="e.g., Minimal Japanese, Vintage Workwear..."
              className="w-full px-4 py-3.5 rounded-xl border-2 border-gray-200 focus:border-[#6C63FF] focus:ring-4 focus:ring-[#6C63FF]/10 outline-none transition-all text-gray-600 placeholder:text-gray-400 shadow-sm"
            />
          </div>

          {/* Generate Button */}
          <button
            onClick={handleGenerate}
            disabled={loading}
            className="btn-primary w-full py-4 rounded-xl text-white font-semibold text-lg disabled:opacity-70 disabled:cursor-not-allowed shadow-lg shadow-[#6C63FF]/30 flex items-center justify-center gap-3"
          >
            {loading ? (
              <>
                <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
                Generating...
              </>
            ) : (
              <>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
                Generate Design
              </>
            )}
          </button>
        </div>
      </div>

      {/* Loading Skeleton */}
      {loading && (
        <section className="max-w-[1200px] mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-white rounded-2xl shadow-md p-6 flex flex-col space-y-5">
                <div className="flex items-center justify-between">
                  <div className="skeleton h-6 w-3/4 rounded-lg" />
                  <div className="skeleton h-6 w-20 rounded-full" />
                </div>
                <div className="flex gap-4 justify-between py-2">
                  {[1, 2, 3, 4].map((j) => (
                    <div key={j} className="flex flex-col items-center gap-2">
                      <div className="skeleton w-16 h-16 rounded-2xl" />
                      <div className="skeleton h-3 w-14 rounded" />
                    </div>
                  ))}
                </div>
                <div className="skeleton h-4 w-full rounded-lg" />
                <div className="skeleton h-4 w-4/5 rounded-lg" />
                <div className="mt-auto pt-4">
                  <div className="skeleton h-10 w-full rounded-xl border-2 border-gray-200" />
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Results */}
      {results.length > 0 && (
        <section className="max-w-[1200px] mx-auto">
          <h2 className="text-2xl font-bold text-gray-700 mb-8 text-center">
            {results.length} Design Schemes Generated
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {results.map((scheme, idx) => (
              <div
                key={scheme.id}
                className={`bg-white rounded-2xl shadow-md card-hover p-6 flex flex-col animate-fade-in animate-delay-${idx + 1} transition-all ${idx === 0 ? 'ring-2 ring-[#6C63FF] ring-offset-2' : 'border border-gray-100'}`}
                style={{ opacity: 0, animationFillMode: 'forwards' }}
              >
                {/* Scheme Title */}
                <div className="flex items-center justify-between mb-5">
                  <h3 className="text-lg font-bold text-gray-700">
                    {scheme.name}
                  </h3>
                  {idx === 0 && (
                    <span className="px-3 py-1 bg-gradient-to-r from-[#6C63FF]/10 to-[#E040FB]/10 text-[#6C63FF] text-xs font-semibold rounded-full flex items-center gap-1">
                      ✨ Recommended
                    </span>
                  )}
                </div>

                {/* Color Swatches */}
                <div className="mb-5">
                  <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">Color Palette</p>
                  <div className="flex gap-4 justify-between">
                    {colorLabels.map(({ key, label }) => (
                      <div key={key} className="flex flex-col items-center gap-2">
                        <button
                          onClick={() => handleCopyColor(scheme.colors[key])}
                          className="w-16 h-16 rounded-2xl border border-gray-200 shadow-sm hover:shadow-xl hover:scale-110 transition-all cursor-pointer relative overflow-hidden group flex items-center justify-center"
                          style={{ backgroundColor: scheme.colors[key] }}
                          title={`Click to copy ${scheme.colors[key]}`}
                        >
                          <span className={`absolute inset-0 flex items-center justify-center text-white text-[10px] font-bold opacity-0 group-hover:opacity-100 transition-all bg-black/50 backdrop-blur-sm ${copiedColor === scheme.colors[key] ? '!opacity-100 !bg-black/60' : ''}`}>
                            {copiedColor === scheme.colors[key] ? '✓' : 'COPY'}
                          </span>
                        </button>
                        <span className="text-xs text-gray-400 font-mono">
                          {scheme.colors[key]}
                        </span>
                        <span className="text-xs text-gray-500">{label}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Fonts */}
                <div className="mb-4">
                  <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">Typography</p>
                  <p className="text-sm text-gray-600">
                    Heading: <span className="font-semibold">{scheme.fonts.heading}</span>
                    {' · '}
                    Body: <span>{scheme.fonts.body}</span>
                  </p>
                </div>

                {/* Description */}
                <p className="text-sm text-gray-500 mb-6 leading-relaxed flex-1">
                  {scheme.description}
                </p>

                {/* Copy Button */}
                <button
                  onClick={() => handleCopyCode(scheme.shopifyCode, scheme.id)}
                  className={`w-full py-2.5 rounded-xl text-sm font-semibold transition-all border-2 ${
                    copiedId === scheme.id
                      ? 'bg-green-500 border-green-500 text-white'
                      : 'border-2 border-[#6C63FF] text-[#6C63FF] hover:bg-[#6C63FF] hover:text-white'
                  }`}
                >
                  {copiedId === scheme.id ? 'Copied! ✓' : 'Copy Shopify Code'}
                </button>
              </div>
            ))}
          </div>
          
          {/* Footer Disclaimer */}
          <p className="text-center text-gray-400 text-sm mt-12">
            Generated designs are suggestions. Adjust based on your brand identity.
          </p>
        </section>
      )}
    </main>
  );
}
