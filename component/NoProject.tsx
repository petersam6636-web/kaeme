
export default function NoProject() {
  return (
    <section className="w-full px-1.5 md:px-3">
      <div className="flex min-h-[300px] flex-col items-center justify-center rounded-2xl border border-black/10 bg-white px-5 text-center dark:border-white/10 dark:bg-black">

        <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-full border border-black/10 dark:border-white/15">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="25"
            height="25"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <rect x="3" y="4" width="18" height="17" rx="2" />
            <path d="M16 2v4M8 2v4M3 10h18" />
            <path d="M12 14v4M10 16h4" />
          </svg>
        </div>

        <h2 className="text-lg font-semibold text-black dark:text-white">
          No projects yet
        </h2>

        <p className="mt-2 max-w-sm text-sm leading-6 text-black/55 dark:text-white/55">
          You have not created any projects yet.
          Your projects will appear here once you create one.
        </p>

      </div>
    </section>
  );
}