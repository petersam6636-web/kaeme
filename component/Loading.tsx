
"use client";

export default function Loading() {
  return (
    <div className="flex min-h-[60vh] w-full items-center justify-center px-1.5 md:px-3">
      <div className="flex flex-col items-center gap-5">

        <div className="relative flex h-5 w-16 items-center justify-center">
          <span className="loading-dot loading-dot-left" />
          <span className="loading-dot loading-dot-right" />
        </div>

        <p className="text-sm font-medium tracking-wide text-black dark:text-white">
          Loading...
        </p>

      </div>

      <style jsx>{`
        .loading-dot {
          position: absolute;
          width: 9px;
          height: 9px;
          border-radius: 9999px;
          background: currentColor;
          animation: merge 1.2s ease-in-out infinite;
        }

        .loading-dot-left {
          left: 12px;
          animation-name: left-dot;
        }

        .loading-dot-right {
          right: 12px;
          animation-name: right-dot;
        }

        @keyframes left-dot {
          0%, 100% { transform: translateX(0); }
          50% { transform: translateX(12px); }
        }

        @keyframes right-dot {
          0%, 100% { transform: translateX(0); }
          50% { transform: translateX(-12px); }
        }
      `}</style>
    </div>
  );
}