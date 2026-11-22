
export default function Loading() {
  return (
    <div className="flex min-h-[100dvh] w-full items-center justify-center px-1.5 md:px-3">
      <div className="flex flex-col items-center gap-5">
        <div className="relative flex h-5 w-16 items-center justify-center">
          <span className="loading-dot loading-dot-left" />
          <span className="loading-dot loading-dot-right" />
        </div>
        <p className="text-sm font-medium tracking-wide text-black dark:text-white">Loading...</p>
      </div>
    </div>
  );
}