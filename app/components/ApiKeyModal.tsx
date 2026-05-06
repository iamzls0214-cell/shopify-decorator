'use client';

import { useState } from 'react';

interface ApiKeyModalProps {
  onSubmit: (apiKey: string, baseUrl: string) => void;
  onCancel: () => void;
}

export default function ApiKeyModal({ onSubmit, onCancel }: ApiKeyModalProps) {
  const [apiKey, setApiKey] = useState('');
  const [baseUrl, setBaseUrl] = useState('https://api.openai.com/v1');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!apiKey.trim()) return;
    onSubmit(apiKey.trim(), baseUrl.trim() || 'https://api.openai.com/v1');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onCancel} />

      {/* Modal */}
      <div className="relative bg-white rounded-2xl shadow-2xl p-6 md:p-8 w-full max-w-md animate-fade-in border border-gray-100">
        <div className="text-center mb-6">
          <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-gradient-to-br from-[#6C63FF] to-[#E040FB] flex items-center justify-center">
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>
          <h3 className="text-lg font-bold text-gray-700">Enter Your API Key</h3>
          <p className="text-sm text-gray-500 mt-1">
            Your free trial has been used. Enter your own API key to continue.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-gray-600 mb-1.5">
              API Key
            </label>
            <input
              type="password"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              placeholder="sk-..."
              className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-[#6C63FF] focus:ring-4 focus:ring-[#6C63FF]/10 outline-none transition-all text-gray-600 placeholder:text-gray-400 shadow-sm"
              autoFocus
            />
            <p className="text-xs text-gray-400 mt-1">
              Works with OpenAI, DeepSeek, or any compatible API
            </p>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-600 mb-1.5">
              Base URL <span className="text-gray-400 font-normal">(optional)</span>
            </label>
            <input
              type="text"
              value={baseUrl}
              onChange={(e) => setBaseUrl(e.target.value)}
              placeholder="https://api.openai.com/v1"
              className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-[#6C63FF] focus:ring-4 focus:ring-[#6C63FF]/10 outline-none transition-all text-gray-600 placeholder:text-gray-400 shadow-sm"
            />
          </div>

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onCancel}
              className="flex-1 py-3 rounded-xl text-sm font-semibold border-2 border-gray-200 text-gray-500 hover:bg-gray-50 transition-all"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!apiKey.trim()}
              className="flex-1 py-3 rounded-xl text-sm font-semibold text-white bg-gradient-to-r from-[#6C63FF] to-[#a78bfa] hover:shadow-lg hover:shadow-[#6C63FF]/30 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Continue
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
