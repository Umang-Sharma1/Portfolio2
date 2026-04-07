import Link from 'next/link';

export default function NotFound() {
  return (
    <main className="relative min-h-screen overflow-hidden bg-gradient-to-br from-rose-50 via-white to-stone-100 dark:from-space-black dark:via-space-dark dark:to-black">
      <div className="pointer-events-none absolute inset-0 opacity-[0.05] dark:opacity-[0.1] bg-[radial-gradient(currentColor_1px,transparent_1px)] bg-[size:24px_24px]" />

      <section className="relative z-10 mx-auto flex min-h-screen w-full max-w-5xl flex-col items-center justify-center px-6 text-center">
        <div className="glassmorphism w-full rounded-[2.5rem] border border-vision-cyan/20 p-10 md:p-14">
          <p className="mb-4 text-[11px] font-mono font-black uppercase tracking-[0.5em] text-vision-cyan">
            Navigation_Error
          </p>

          <h1 className="font-display text-6xl font-black uppercase italic tracking-tight text-slate-900 dark:text-text-dark md:text-8xl">
            404
          </h1>

          <p className="mx-auto mt-6 max-w-2xl text-sm font-semibold leading-relaxed text-slate-600 dark:text-text-dark/55 md:text-base">
            The page drifted out of orbit. While we recalibrate your route, jump into the typing
            arena and test your speed.
          </p>

          <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link
              href="/game"
              className="group inline-flex items-center justify-center gap-3 rounded-2xl bg-vision-cyan px-8 py-4 font-mono text-[11px] font-black uppercase tracking-[0.35em] text-space-black shadow-[0_16px_40px_rgba(var(--glow-cyan),0.25)] transition-all hover:scale-[1.02]"
            >
              Launch Game
            </Link>

            <Link
              href="/"
              className="inline-flex items-center justify-center rounded-2xl border border-slate-300 bg-white/70 px-8 py-4 font-mono text-[11px] font-black uppercase tracking-[0.35em] text-slate-700 transition-all hover:border-vision-cyan/40 hover:text-vision-cyan dark:border-white/10 dark:bg-white/[0.03] dark:text-text-dark/60"
            >
              Back Home
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
