import { CalendarCheck2, CalendarDays } from "lucide-react";

export default function AppHeader() {
  return (
    <header className="border-b border-white/5 bg-ink-950/80 backdrop-blur-xl">
      <div className="mx-auto flex min-w-0 max-w-[1500px] items-center justify-between gap-3 px-4 py-4 sm:px-6 lg:px-8">
        <div className="flex min-w-0 items-center gap-3">
          <div className="grid h-10 w-10 place-items-center rounded-xl bg-mint-400 text-ink-950 shadow-[0_0_24px_rgba(88,221,184,.18)]">
            <CalendarDays size={20} strokeWidth={2.4} />
          </div>
          <div className="min-w-0">
            <p className="truncate font-semibold tracking-tight text-white">SEU Routine Maker</p>
            <p className="text-xs text-slate-500">Advising companion</p>
          </div>
        </div>

        <div className="inline-flex shrink-0 items-center gap-2 rounded-full border border-mint-400/20 bg-mint-400/[.06] py-1.5 pl-1.5 pr-3 shadow-[0_0_30px_rgba(32,222,214,.06)]">
          <span className="grid h-7 w-7 place-items-center rounded-full bg-mint-400 text-ink-950">
            <CalendarCheck2 size={15} strokeWidth={2.5} />
          </span>
          <span className="text-xs font-bold tracking-tight sm:text-sm">
            <span className="text-white">Routine</span> <span className="text-mint-400">Maker</span>
          </span>
        </div>
      </div>
    </header>
  );
}
