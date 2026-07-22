import { CalendarCheck2, CalendarDays } from "lucide-react";

export default function AppHeader({ onNavClick, onOpenDataPolicy }) {
  return (
    <header className="border-b border-[#412D15]/50 bg-[#000000]/90 backdrop-blur-xl sticky top-0 z-50">
      <div className="mx-auto flex min-w-0 max-w-[1400px] items-center justify-between gap-4 px-4 py-3.5 sm:px-6 lg:px-8">
        {/* Brand Logo */}
        <div className="flex min-w-0 items-center gap-3">
          <img
            src="/icon/android-chrome-192x192.png"
            alt="SEU Routine Maker Logo"
            className="h-10 w-10 shrink-0 rounded-xl object-cover shadow-[0_0_24px_rgba(225,220,201,0.2)]"
          />
          <div className="min-w-0">
            <p className="truncate font-semibold tracking-tight text-white text-sm sm:text-base">SEU Routine Maker</p>
            <p className="text-[11px] text-[#C7BFD0]">Advising companion</p>
          </div>
        </div>

        {/* Center Nav Pills */}
        <nav className="hidden md:flex items-center gap-1 rounded-full border border-[#412D15]/50 bg-[#1F150C]/40 backdrop-blur-md p-1">
          <button
            type="button"
            onClick={() => onNavClick?.('home')}
            className="rounded-full bg-[#2E1E12]/50 px-4 py-1.5 text-xs font-medium text-white transition hover:text-white cursor-pointer"
          >
            Home
          </button>
          <a
            href="/about"
            className="rounded-full px-4 py-1.5 text-xs font-medium text-[#C7BFD0] transition hover:text-white"
          >
            About
          </a>
          <a
            href="/faq"
            className="rounded-full px-4 py-1.5 text-xs font-medium text-[#C7BFD0] transition hover:text-white"
          >
            FAQ
          </a>
          <button
            type="button"
            onClick={onOpenDataPolicy}
            className="rounded-full px-4 py-1.5 text-xs font-medium text-[#C7BFD0] transition hover:text-white cursor-pointer"
          >
            User Data Policy
          </button>
        </nav>

        {/* Right CTA */}
        <button
          onClick={() => {
            document.getElementById("tools")?.scrollIntoView({ behavior: "smooth", block: "start" });
          }}
          className="inline-flex shrink-0 items-center gap-2 rounded-full bg-[#E1DCC9] px-4 py-2 text-xs font-bold text-[#000000] shadow-[0_0_24px_rgba(225,220,201,0.2)] transition hover:bg-[#EFEBDC] hover:scale-105"
        >
          <CalendarCheck2 size={15} strokeWidth={2.5} />
          <span>Routine Maker →</span>
        </button>
      </div>
    </header>
  );
}
