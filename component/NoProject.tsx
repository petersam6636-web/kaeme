
import Link from "next/link";

export default function NoProject() {
  return (
    <section className="flex min-h-[100dvh] w-full items-center justify-center px-1.5 md:px-3">
      <div className="glass-panel flex min-h-[300px] w-full max-w-xl flex-col items-center justify-center rounded-2xl px-5 text-center text-zinc-100">

        <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-full border border-blue-300/20 bg-blue-400/10 text-blue-200">
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

        <h2 className="text-lg font-semibold text-white">
          No projects yet
        </h2>

        <p className="mt-2 max-w-sm text-sm leading-6 text-zinc-400">
          You have not created any reminder yet.
          Your projects will appear here once you create one.
        </p>

        <Link
          href="/project"
          className="mt-6 inline-flex cursor-pointer items-center justify-center rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white transition-colors duration-200 hover:bg-blue-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-400"
        >
          Get started
        </Link>
      </div>
    </section>
  );
}