"use client";

import Link from "next/link";

function GlobalError  ({ error, reset }: { error: Error; reset: () => void }) {
  return (
    <main className="grid min-h-full place-items-center px-6 py-24 bg-violet-800">
      <div className="text-center">
        <p className="text-base font-semibold text-slate-100 dark:text-emerald-500">
          There was a problem
        </p>
        <h1 className="mt-4 text-3xl font-bold tracking-tight text-zinc-100 dark:text-zinc-50">
          {error?.message || "Something went wrong"}
        </h1>
        <p className="mt-6 text-base loading-7 text-zinc-100 dark:text-zinc-400">
          Please try again later or contact support if the problem persists
        </p>
        <div className="mt-10 flex items-center justify-center gap-x-6">
          <button className="btn btn-md bg-emerald-100 border-emerald-800" onClick={() => reset && reset()}>
            Try again
          </button>
          <Link href="/" className="text-emerald-600">Go back home</Link>
        </div>
      </div>
    </main>
  );
};

export default GlobalError;
