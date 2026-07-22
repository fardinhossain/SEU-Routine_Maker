import { useState } from "react";
import { CalendarCheck2, Grid, X } from "lucide-react";

export default function AppHeader({ onNavClick, onOpenDataPolicy }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="border-b border-[#412D15]/50 bg-[#000000]/90 backdrop-blur-xl sticky top-0 z-50">
      <div className="mx-auto flex min-w-0 max-w-[1400px] items-center justify-between gap-3 px-4 py-3 sm:px-6 lg:px-8">
        {/* Brand Logo */}
        <div className="flex min-w-0 items-center gap-3">
          <img
            src="/icon/android-chrome-192x192.png"
            alt="SEU Routine Maker Logo"
            className="h-9 w-9 shrink-0 rounded-xl object-cover shadow-[0_0_24px_rgba(225,220,201,0.2)]"
          />
          <div className="min-w-0">
            <p className="truncate font-bold tracking-tight text-white text-sm sm:text-base">SEU Routine Maker</p>
            <p className="text-[11px] text-[#C7BFD0]">Advising companion</p>
          </div>
        </div>

        {/* Center Nav Pills (Desktop) */}
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

        {/* Right Section */}
        <div className="flex items-center gap-2">
          {/* Desktop Right CTA Button */}
          <button
            onClick={() => {
              document.getElementById("tools")?.scrollIntoView({ behavior: "smooth", block: "start" });
            }}
            className="hidden sm:inline-flex shrink-0 items-center gap-2 rounded-full bg-[#E1DCC9] px-4 py-2 text-xs font-bold text-[#000000] shadow-[0_0_24px_rgba(225,220,201,0.2)] transition hover:bg-[#EFEBDC] hover:scale-105 cursor-pointer"
          >
            <CalendarCheck2 size={15} strokeWidth={2.5} />
            <span>Routine Maker →</span>
          </button>

          {/* Mobile Grid Menu Button */}
          <div className="relative md:hidden">
            <button
              type="button"
              onClick={() => setMobileMenuOpen((prev) => !prev)}
              className="grid h-9 w-9 shrink-0 place-items-center rounded-full border border-[#412D15] bg-[#1F150C]/80 text-[#E1DCC9] shadow-[0_0_12px_rgba(225,220,201,0.15)] transition hover:bg-[#2E1E12] cursor-pointer"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X size={18} /> : <Grid size={17} />}
            </button>

            {/* Mobile Dropdown Menu */}
            {mobileMenuOpen && (
              <div className="absolute right-0 z-50 mt-2 w-48 overflow-hidden rounded-2xl border border-[#412D15] bg-[#120B05] p-1.5 shadow-2xl backdrop-blur-xl">
                <button
                  type="button"
                  onClick={() => {
                    setMobileMenuOpen(false);
                    onNavClick?.('home');
                  }}
                  className="flex w-full items-center rounded-xl px-3 py-2.5 text-left text-xs font-bold text-white transition hover:bg-[#1F150C]"
                >
                  Home
                </button>
                <a
                  href="/about"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex w-full items-center rounded-xl px-3 py-2.5 text-left text-xs font-bold text-[#C7BFD0] transition hover:bg-[#1F150C] hover:text-white"
                >
                  About
                </a>
                <a
                  href="/faq"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex w-full items-center rounded-xl px-3 py-2.5 text-left text-xs font-bold text-[#C7BFD0] transition hover:bg-[#1F150C] hover:text-white"
                >
                  FAQ
                </a>
                <button
                  type="button"
                  onClick={() => {
                    setMobileMenuOpen(false);
                    onOpenDataPolicy?.();
                  }}
                  className="flex w-full items-center rounded-xl px-3 py-2.5 text-left text-xs font-bold text-[#C7BFD0] transition hover:bg-[#1F150C] hover:text-white"
                >
                  User Data Policy
                </button>
                <div className="my-1 border-t border-[#412D15]/50" />
                <button
                  type="button"
                  onClick={() => {
                    setMobileMenuOpen(false);
                    document.getElementById("tools")?.scrollIntoView({ behavior: "smooth", block: "start" });
                  }}
                  className="flex w-full items-center justify-between rounded-xl bg-[#E1DCC9] px-3 py-2 text-left text-xs font-extrabold text-black transition hover:bg-[#EFEBDC]"
                >
                  <span>Routine Maker</span>
                  <span>→</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
