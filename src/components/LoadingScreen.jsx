import { CalendarDays, Sparkles } from "lucide-react";

export default function LoadingScreen({ leaving }) {
  return (
    <div
      className={`fixed inset-0 z-[100] grid place-items-center overflow-hidden bg-ink-950 px-5 transition-opacity duration-500 ${
        leaving ? "pointer-events-none opacity-0" : "opacity-100"
      }`}
      role="status"
      aria-live="polite"
      aria-label="Loading SEU Routine Maker"
    >
      <div className="loader-glow pointer-events-none absolute h-[30rem] w-[30rem] rounded-full border border-mint-400/10" />
      <div className="loader-orbit pointer-events-none absolute h-72 w-72 rounded-full border border-mint-400/10 sm:h-96 sm:w-96" />

      <div className="relative w-full max-w-2xl text-center">
        <div className="loader-icon mx-auto grid h-16 w-16 place-items-center rounded-2xl bg-mint-400 text-ink-950 shadow-[0_0_55px_rgba(32,222,214,.25)] sm:h-20 sm:w-20">
          <CalendarDays size={32} strokeWidth={2.4} />
        </div>

        <div className="loader-copy">
          <span className="mt-6 inline-flex items-center gap-2 rounded-full border border-mint-400/20 bg-mint-400/[.07] px-3 py-1.5 text-xs font-medium text-mint-300">
            <Sparkles size={13} /> Built for SEU Students
          </span>
          <h1 className="mt-5 text-3xl font-semibold leading-tight tracking-[-.04em] text-white sm:text-5xl">
            Your classes, finally in <span className="text-mint-400">one clear view.</span>
          </h1>
          <p className="mt-3 text-sm text-slate-500 sm:text-base">Preparing your routine workspace…</p>
        </div>

        <div className="mx-auto mt-8 h-1 w-full max-w-xs overflow-hidden rounded-full bg-white/[.07]">
          <div className="loader-progress h-full rounded-full bg-mint-400" />
        </div>
      </div>
    </div>
  );
}
