import { useState, useEffect } from "react";
import {
  ArrowRight,
  CalendarDays,
  Download,
  Lock,
  Monitor,
  Sparkles,
  Smartphone,
  WandSparkles,
  X,
  Zap,
} from "lucide-react";

const HEADLINE_BEFORE = "Build your ";
const HEADLINE_FOCUS = "SEU routine";
const HEADLINE_AFTER = " within seconds.";
const HEADLINE_TEXT = `${HEADLINE_BEFORE}${HEADLINE_FOCUS}${HEADLINE_AFTER}`;

export default function Hero({ onGetStarted, onOpenOrganizer }) {
  const [showExportModal, setShowExportModal] = useState(false);
  const [typedCharacters, setTypedCharacters] = useState(0);

  // Close export modal on Escape key
  useEffect(() => {
    if (!showExportModal) return;
    const handleKey = (e) => {
      if (e.key === "Escape") setShowExportModal(false);
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [showExportModal]);

  useEffect(() => {
    const reduceMotion = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
    if (reduceMotion) {
      setTypedCharacters(HEADLINE_TEXT.length);
      return undefined;
    }

    setTypedCharacters(0);
    const timer = window.setInterval(() => {
      setTypedCharacters((current) => {
        if (current >= HEADLINE_TEXT.length) {
          window.clearInterval(timer);
          return current;
        }
        return current + 1;
      });
    }, 34);

    return () => window.clearInterval(timer);
  }, []);

  const beforeText = HEADLINE_BEFORE.slice(0, Math.min(typedCharacters, HEADLINE_BEFORE.length));
  const focusStart = HEADLINE_BEFORE.length;
  const focusEnd = focusStart + HEADLINE_FOCUS.length;
  const focusText = typedCharacters > focusStart
    ? HEADLINE_FOCUS.slice(0, Math.min(typedCharacters - focusStart, HEADLINE_FOCUS.length))
    : "";
  const afterText = typedCharacters > focusEnd
    ? HEADLINE_AFTER.slice(0, typedCharacters - focusEnd)
    : "";
  const isTyping = typedCharacters < HEADLINE_TEXT.length;

  const scrollToTools = () => {
    if (onGetStarted) {
      onGetStarted();
    } else {
      const el = document.getElementById("tools");
      if (el) {
        el.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    }
  };

  return (
    <>
    <section className="relative mb-10 w-full overflow-hidden rounded-3xl border border-white/[0.06] bg-[radial-gradient(circle_at_88%_12%,rgba(32,222,214,0.09),transparent_42%),linear-gradient(145deg,#0b172f_0%,#091326_55%)] px-6 pt-4 pb-8 sm:mb-12 sm:px-10 sm:pt-6 sm:pb-10 lg:px-14 lg:pt-8 lg:pb-12">
      {/* Decorative orbs */}
      <div className="pointer-events-none absolute -right-24 -top-24 h-80 w-80 rounded-full border border-mint-400/10" />
      <div className="pointer-events-none absolute -right-8 top-12 h-40 w-40 rounded-full border border-mint-400/10" />
      <div className="pointer-events-none absolute bottom-0 left-1/4 h-px w-2/3 bg-gradient-to-r from-transparent via-mint-400/20 to-transparent" />

      <div className="relative mx-auto max-w-[1280px]">
        <div className="grid items-center gap-10 lg:grid-cols-12 lg:gap-12">
          {/* Left: Copy + CTAs */}
          <div className="lg:col-span-7 animate-fade-up" style={{ animationDelay: '100ms' }}>
            <div 
              className="inline-flex animate-fade-in items-center gap-2 rounded-full border border-mint-400/20 bg-mint-400/[0.07] px-4 py-1.5 text-xs font-medium tracking-[0.5px] text-mint-300"
              style={{ animationDelay: '80ms' }}
            >
              <Sparkles size={14} />
              BUILT FOR SOUTHEAST UNIVERSITY STUDENTS
            </div>

            <h1 
              className="mt-6 max-w-3xl animate-fade-up text-balance text-5xl font-semibold leading-[1.08] tracking-[-0.045em] text-white sm:text-6xl lg:text-[64px]"
              style={{ animationDelay: '180ms' }}
              aria-label={HEADLINE_TEXT}
            >
              <span className="sr-only">{HEADLINE_TEXT}</span>
              <span aria-hidden="true">
                {beforeText}
                {focusText && (
                  <span>{focusText}</span>
                )}
                {afterText}
                <span className="typing-cursor" aria-hidden="true">{isTyping ? "|" : ""}</span>
              </span>
            </h1>

            {/* Trust row */}
            <div 
              className="mt-5 flex animate-fade-up flex-wrap items-center gap-x-5 gap-y-2 text-sm text-slate-400"
              style={{ animationDelay: '420ms' }}
            >
              <div className="flex items-center gap-1.5">
                <Lock size={15} className="text-mint-400" /> Private routine storage
              </div>
              <div className="hidden h-1 w-1 rounded-full bg-white/30 sm:block" />
              <div>No login • OCR only when you upload an image</div>
            </div>

            {/* Primary CTAs */}
            <div 
              className="mt-8 flex animate-fade-up flex-col gap-3 sm:flex-row sm:items-center"
              style={{ animationDelay: '520ms' }}
            >
              <button
                onClick={scrollToTools}
                className="primary-button group h-12 px-8 text-base"
              >
                Import your UMS file
                <ArrowRight className="transition group-hover:translate-x-0.5" size={18} />
              </button>

              <button
                onClick={() => {
                  if (onOpenOrganizer) onOpenOrganizer();
                  else window.open("#section-organizer", "_blank");
                }}
                className="secondary-button h-12 px-7 text-base"
              >
                <WandSparkles size={18} />
                Use Magic Organizer
              </button>

              <button
                onClick={() => setShowExportModal(true)}
                className="secondary-button hidden h-12 items-center gap-2 px-5 text-sm sm:inline-flex"
              >
                See export examples
                <Download size={16} />
              </button>
            </div>

            {/* Feature highlights */}
            <div className="mt-8 grid grid-cols-1 gap-3 text-sm sm:grid-cols-3">
              <div 
                className="flex animate-fade-up items-start gap-3 rounded-2xl border border-white/10 bg-white/[0.025] px-4 py-3.5"
                style={{ animationDelay: '620ms' }}
              >
                <div className="mt-0.5 rounded-lg bg-mint-400/10 p-1.5 text-mint-300">
                  <Zap size={17} />
                </div>
                <div>
                  <div className="font-semibold text-white">Instant &amp; live</div>
                  <div className="text-xs text-slate-500">Parse HTML • OCR screenshots • updates instantly</div>
                </div>
              </div>
              <div 
                className="flex animate-fade-up items-start gap-3 rounded-2xl border border-white/10 bg-white/[0.025] px-4 py-3.5"
                style={{ animationDelay: '720ms' }}
              >
                <div className="mt-0.5 rounded-lg bg-mint-400/10 p-1.5 text-mint-300">
                  <CalendarDays size={17} />
                </div>
                <div>
                  <div className="font-semibold text-white">Conflict smart</div>
                  <div className="text-xs text-slate-500">Auto-detects overlaps + prevents duplicate courses</div>
                </div>
              </div>
              <div 
                className="flex animate-fade-up items-start gap-3 rounded-2xl border border-white/10 bg-white/[0.025] px-4 py-3.5"
                style={{ animationDelay: '820ms' }}
              >
                <div className="mt-0.5 rounded-lg bg-mint-400/10 p-1.5 text-mint-300">
                  <Sparkles size={17} />
                </div>
                <div>
                  <div className="font-semibold text-white">4 premium exports</div>
                  <div className="text-xs text-slate-500">PC, Modern, Futuristic, Mobile PNG + PDF</div>
                </div>
              </div>
            </div>
          </div>

          {/* Right: Visual teaser */}
          <div className="lg:col-span-5">
            <div
              onClick={() => setShowExportModal(true)}
              className="group relative mx-auto w-full max-w-[420px] animate-slide-in cursor-pointer overflow-hidden rounded-3xl border border-white/10 bg-[#0a1629] p-2 shadow-[0_30px_120px_-15px_rgb(0,0,0,0.6)] transition-all hover:border-mint-400/30 hover:shadow-[0_40px_140px_-15px_rgb(0,0,0,0.65)] lg:mx-0"
              style={{ animationDelay: '280ms' }}
            >
              <div className="rounded-2xl bg-[#081422] p-5">
                <div className="mb-4 flex items-center justify-between">
                  <div>
                    <div className="flex items-center gap-2 text-sm font-semibold tracking-tight text-white">
                      <CalendarDays size={16} className="text-mint-400" /> SEU Weekly Routine
                    </div>
                    <div className="text-[10px] uppercase tracking-[1.5px] text-slate-500">7 days • one clean view</div>
                  </div>
                  <div className="rounded-full border border-white/10 bg-white/5 px-2.5 py-0.5 text-[10px] font-mono text-mint-300">LIVE</div>
                </div>

                {/* Mini routine preview — entrance + hover animations */}
                <div className="space-y-2.5 text-[13px] group-hover:[&>div]:scale-[1.015]">
                  {/* SAT */}
                  <div className="flex animate-fade-up gap-2.5 transition-all duration-200 group-hover:-translate-y-px" style={{ animationDelay: '420ms' }}>
                    <div className="w-12 shrink-0 rounded-xl bg-cyan-400/10 py-2 text-center text-[10px] font-bold tracking-[1px] text-cyan-400">SAT</div>
                    <div className="flex-1 rounded-2xl border border-cyan-400/15 bg-cyan-400/[0.035] px-3 py-2">
                      <div className="flex justify-between text-xs">
                        <span className="font-mono text-cyan-300">CSE361.3</span>
                        <span className="text-[10px] text-slate-500">09:00–10:20</span>
                      </div>
                      <div className="mt-0.5 text-[13px] font-semibold leading-tight text-white">Operating Systems • R-301</div>
                    </div>
                  </div>

                  {/* SUN + TUE combined example */}
                  <div className="flex gap-2.5 transition-all duration-200 group-hover:-translate-y-px">
                    <div className="w-12 shrink-0 rounded-xl bg-violet-400/10 py-2 text-center text-[10px] font-bold tracking-[1px] text-violet-400">SUN–TUE</div>
                    <div className="flex-1 rounded-2xl border border-violet-400/15 bg-violet-400/[0.035] px-3 py-2">
                      <div className="flex justify-between text-xs">
                        <span className="font-mono text-violet-300">CSE443.1</span>
                        <span className="text-[10px] text-slate-500">11:00–12:20</span>
                      </div>
                      <div className="mt-0.5 text-[13px] font-semibold leading-tight text-white">Computer Networks • Lab 4</div>
                    </div>
                  </div>

                  {/* WED */}
                  <div className="flex animate-fade-up gap-2.5 transition-all duration-200 group-hover:-translate-y-px" style={{ animationDelay: '580ms' }}>
                    <div className="w-12 shrink-0 rounded-xl bg-amber-400/10 py-2 text-center text-[10px] font-bold tracking-[1px] text-amber-400">WED</div>
                    <div className="flex-1 rounded-2xl border border-amber-400/15 bg-amber-400/[0.035] px-3 py-2">
                      <div className="flex justify-between text-xs">
                        <span className="font-mono text-amber-300">CSE362.2</span>
                        <span className="text-[10px] text-slate-500">14:00–16:50</span>
                      </div>
                      <div className="mt-0.5 text-[13px] font-semibold leading-tight text-white">Software Engineering • R-205</div>
                    </div>
                  </div>
                </div>

                <div className="mt-4 flex items-center justify-between border-t border-white/10 pt-3 text-[10px] text-slate-500">
                  <div>4 courses • 12 sessions • 18.5h</div>
                  <div className="font-medium text-mint-400">Ready to export →</div>
                </div>
              </div>
            </div>

            {/* Small style tags */}
            <div className="mt-3 flex flex-wrap justify-center gap-1.5 text-[10px] text-slate-500 lg:justify-start">
              <span className="rounded border border-white/10 bg-white/[0.03] px-2 py-px">PC</span>
              <span className="rounded border border-white/10 bg-white/[0.03] px-2 py-px">Modern</span>
              <span className="rounded border border-white/10 bg-white/[0.03] px-2 py-px">Futuristic</span>
              <span className="rounded border border-white/10 bg-white/[0.03] px-2 py-px">Mobile</span>
            </div>
          </div>
        </div>

        {/* Device-specific instructions */}
        <div
          className="mt-9 animate-fade-up border-t border-white/10 pt-7"
          style={{ animationDelay: '680ms' }}
        >
          <div className="mb-5 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <div className="text-xs font-semibold uppercase tracking-[.18em] text-mint-300">Import guide</div>
              <h2 className="mt-1 text-xl font-semibold tracking-[-.03em] text-white sm:text-2xl">
                Choose your device and upload the easiest file.
              </h2>
            </div>
            <button
              onClick={scrollToTools}
              className="inline-flex w-fit items-center gap-2 rounded-full border border-mint-400/20 bg-mint-400/10 px-4 py-2 text-sm font-semibold text-mint-200 transition hover:border-mint-300/45 hover:bg-mint-400/15"
            >
              Go to importer <ArrowRight size={15} />
            </button>
          </div>

          <div className="grid gap-4 lg:grid-cols-3">
            <article className="group relative overflow-hidden rounded-3xl border border-white/10 bg-white/[.025] p-5 transition hover:-translate-y-0.5 hover:border-mint-300/35 hover:bg-white/[.04]">
              <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-mint-300/60 to-transparent opacity-0 transition group-hover:opacity-100" />
              <div className="flex items-center gap-3">
                <span className="grid h-11 w-11 place-items-center rounded-2xl border border-mint-400/15 bg-mint-400/10 text-mint-300">
                  <Monitor size={20} />
                </span>
                <div>
                  <div className="text-sm font-semibold text-white">PC / Laptop</div>
                  <div className="text-xs text-slate-500">Best for Chrome, Edge, Firefox</div>
                </div>
              </div>
              <ol className="mt-5 space-y-3 text-sm leading-6 text-slate-300">
                <li className="flex gap-3"><span className="font-mono text-mint-300">1</span><span>Open UMS <strong>Registered Courses</strong> or <strong>Advising Table</strong>.</span></li>
                <li className="flex gap-3"><span className="font-mono text-mint-300">2</span><span>Press <strong>Ctrl + S</strong> and save as HTML / complete webpage.</span></li>
                <li className="flex gap-3"><span className="font-mono text-mint-300">3</span><span>Drop the saved file into the importer. Registered Courses auto-builds the routine.</span></li>
              </ol>
            </article>

            <article className="group relative overflow-hidden rounded-3xl border border-white/10 bg-white/[.025] p-5 transition hover:-translate-y-0.5 hover:border-mint-300/35 hover:bg-white/[.04]">
              <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-cyan-300/60 to-transparent opacity-0 transition group-hover:opacity-100" />
              <div className="flex items-center gap-3">
                <span className="grid h-11 w-11 place-items-center rounded-2xl border border-cyan-400/15 bg-cyan-400/10 text-cyan-300">
                  <Smartphone size={20} />
                </span>
                <div>
                  <div className="text-sm font-semibold text-white">Android</div>
                  <div className="text-xs text-slate-500">Works even if the file has no extension</div>
                </div>
              </div>
              <ol className="mt-5 space-y-3 text-sm leading-6 text-slate-300">
                <li className="flex gap-3"><span className="font-mono text-mint-300">1</span><span>Open the UMS page in Chrome or your browser.</span></li>
                <li className="flex gap-3"><span className="font-mono text-mint-300">2</span><span>Tap menu <strong>⋮</strong> → <strong>Download</strong>. It may save as MHTML or without an extension.</span></li>
                <li className="flex gap-3"><span className="font-mono text-mint-300">3</span><span>Upload that downloaded file. If download fails, upload a clear screenshot.</span></li>
              </ol>
            </article>

            <article className="group relative overflow-hidden rounded-3xl border border-mint-400/25 bg-mint-400/[.04] p-5 shadow-[0_0_60px_rgba(32,222,214,.06)] transition hover:-translate-y-0.5 hover:border-mint-300/45 hover:bg-mint-400/[.06]">
              <div className="absolute right-4 top-4 rounded-full bg-mint-300 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-[#061325]">
                iPhone tip
              </div>
              <div className="flex items-center gap-3 pr-20">
                <span className="grid h-11 w-11 place-items-center rounded-2xl border border-mint-400/20 bg-mint-400/12 text-mint-200">
                  <Smartphone size={20} />
                </span>
                <div>
                  <div className="text-sm font-semibold text-white">iPhone / iPad</div>
                  <div className="text-xs text-slate-500">Use PDF or full-page screenshot</div>
                </div>
              </div>
              <ol className="mt-5 space-y-3 text-sm leading-6 text-slate-300">
                <li className="flex gap-3"><span className="font-mono text-mint-300">1</span><span>Open Registered Courses in Safari and wait until schedules load.</span></li>
                <li className="flex gap-3"><span className="font-mono text-mint-300">2</span><span>Tap <strong>Share</strong> → <strong>Options</strong> → <strong>PDF</strong> → Save to Files.</span></li>
                <li className="flex gap-3"><span className="font-mono text-mint-300">3</span><span>If PDF is missing, use <strong>Print</strong>, pinch open preview, then Share → Save to Files.</span></li>
              </ol>
            </article>
          </div>

          <div className="mt-4 rounded-2xl border border-white/10 bg-black/10 px-4 py-3 text-center text-xs text-slate-400">
            Fastest path: after advising, upload <strong className="text-slate-200">Registered Courses</strong>. Before advising, upload <strong className="text-slate-200">Offered Sections</strong> and use Magic Organizer.
          </div>
        </div>
      </div>
    </section>

      {/* Modal: Full Export Examples with nice animations */}
      {showExportModal && (
        <div
          className="fixed inset-0 z-[200] flex animate-fade-in items-center justify-center bg-black/80 p-3 sm:p-4 backdrop-blur-sm"
          onClick={() => setShowExportModal(false)}
        >
          <div
            className="w-full max-w-6xl max-h-[92dvh] flex flex-col animate-scale-in overflow-hidden rounded-3xl border border-white/10 bg-[#0a1629] shadow-2xl"
            style={{ animationDelay: '60ms' }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header - sticky on mobile */}
            <div 
              className="flex items-center justify-between border-b border-white/10 px-4 py-3 sm:px-6 sm:py-4 sticky top-0 bg-[#0a1629] z-10"
              style={{ animationDelay: '120ms' }}
            >
              <div>
                <div className="flex items-center gap-2 text-base sm:text-lg font-semibold text-white">
                  <Sparkles size={18} className="text-mint-400 sm:size-5" /> Export Examples
                </div>
                <p className="text-[10px] sm:text-xs text-slate-400 hidden sm:block">Real polished outputs from SEU Routine Maker</p>
              </div>
              <button
                onClick={() => setShowExportModal(false)}
                className="rounded-full p-2.5 sm:p-2 text-slate-400 transition hover:bg-white/5 hover:text-white active:bg-white/10"
                aria-label="Close"
              >
                <X size={22} />
              </button>
            </div>

            {/* Scrollable content */}
            <div className="flex-1 overflow-y-auto">
              {/* Examples Grid */}
              <div className="grid gap-3 p-4 sm:gap-4 sm:p-6 sm:grid-cols-2 lg:grid-cols-4">
                {[
                  {
                    src: "/images/seu-weekly-routine-pc.png",
                    title: "PC Version",
                    desc: "Wide desktop table. Ideal for printing, full-screen viewing & sharing.",
                  },
                  {
                    src: "/images/seu-weekly-routine-modern.png",
                    title: "Modern Version",
                    desc: "Clean dark card layout. Premium and very readable on any device.",
                  },
                  {
                    src: "/images/seu-weekly-routine-futuristic.png",
                    title: "Futuristic Version",
                    desc: "Neon glassy dashboard. Bold day rows with beautiful color accents.",
                  },
                  {
                    src: "/images/seu-routine-mobile.png",
                    title: "Mobile Version",
                    desc: "Compact table that keeps the classic PC grid identity on phones.",
                  },
                ].map((ex, i) => (
                  <div
                    key={i}
                    className="group animate-fade-up overflow-hidden rounded-2xl border border-white/10 bg-[#081422] transition-all duration-200 hover:-translate-y-0.5 hover:border-mint-400/40 hover:shadow-xl"
                    style={{ animationDelay: `${220 + i * 70}ms` }}
                  >
                    <div className="relative overflow-hidden bg-black/40">
                      <img
                        src={ex.src}
                        alt={ex.title}
                        className="h-28 w-full object-contain p-2 sm:h-36 md:h-44 transition-transform duration-300 group-hover:scale-[1.015]"
                        loading="lazy"
                      />
                    </div>
                    <div className="p-3 sm:p-4">
                      <div className="font-semibold text-white text-sm sm:text-base">{ex.title}</div>
                      <p className="mt-1 text-[10px] sm:text-xs leading-snug text-slate-400">{ex.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Footer */}
            <div className="border-t border-white/10 bg-[#081422] px-4 py-3 text-center text-[10px] sm:text-[11px] text-slate-500 flex-shrink-0">
              All styles are generated 100% in your browser using html2canvas. No server involved.
            </div>
          </div>
        </div>
      )}
    </>
  );
}
