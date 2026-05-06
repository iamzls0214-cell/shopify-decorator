'use client';

interface StatusBarProps {
  isPaid: boolean;
  dailyCount: number;
  dailyLimit: number;
  trialUsed: boolean;
}

export default function StatusBar({ isPaid, dailyCount, dailyLimit, trialUsed }: StatusBarProps) {
  return (
    <div className="fixed top-4 right-4 z-40 flex flex-col gap-1.5">
      {/* Free count badge */}
      {!isPaid && (
        <div className={`px-3 py-1.5 rounded-full text-xs font-semibold shadow-lg backdrop-blur-sm flex items-center gap-2 ${
          dailyCount >= dailyLimit
            ? 'bg-red-500/90 text-white'
            : 'bg-white/90 text-gray-600 border border-gray-200'
        }`}>
          <span className={`w-2 h-2 rounded-full ${dailyCount >= dailyLimit ? 'bg-white' : 'bg-[#6C63FF]'}`} />
          Free: {dailyCount}/{dailyLimit}
        </div>
      )}

      {/* Paid badge */}
      {isPaid && (
        <div className="px-3 py-1.5 rounded-full text-xs font-semibold shadow-lg backdrop-blur-sm bg-gradient-to-r from-[#6C63FF] to-[#E040FB] text-white flex items-center gap-2">
          <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M12.395 2.553a1 1 0 00-1.45-.385c-.345.23-.614.558-.822.88-.214.33-.403.713-.57 1.116-.334.804-.614 1.768-.84 2.734a31.365 31.365 0 00-.613 3.58 2.64 2.64 0 01-.945-1.067c-.328-.68-.398-1.534-.398-2.654A1 1 0 005.05 6.05 6.981 6.981 0 003 11a7 7 0 1011.95-4.95c-.592-.591-.98-.985-1.348-1.467-.363-.476-.724-1.063-1.207-2.03zM12.12 15.12A3 3 0 017 13s.879.5 2.5.5c0-1 .5-4 1.25-4.5.5 1 .786 1.293 1.371 1.879A2.99 2.99 0 0113 13a2.99 2.99 0 01-.879 2.121z" clipRule="evenodd" />
          </svg>
          PRO
        </div>
      )}

      {/* Trial badge */}
      {isPaid && !trialUsed && (
        <div className="px-3 py-1.5 rounded-full text-xs font-semibold shadow-lg bg-green-500/90 text-white text-center">
          1 Free Trial Available
        </div>
      )}

      {/* Trial used badge */}
      {isPaid && trialUsed && (
        <div className="px-3 py-1.5 rounded-full text-xs font-semibold shadow-lg bg-amber-500/90 text-white text-center">
          Using Your API Key
        </div>
      )}
    </div>
  );
}
