import { useEffect, useState } from "react";
import {
  ArrowRight,
  CalendarDays,
  ChevronDown,
  Download,
  FileText,
  Lock,
  Monitor,
  RefreshCw,
  Sparkles,
  Smartphone,
  WandSparkles,
  X,
  Zap,
} from "lucide-react";

const HEADLINE_TEXT = "Routine Maker SEU builds your SEU routine within seconds.";

const heroFeatures = [
  { icon: Zap, title: "Instant import", meta: "HTML • PDF • OCR" },
  { icon: CalendarDays, title: "Conflict smart", meta: "Overlap warnings" },
  { icon: Sparkles, title: "Clean exports", meta: "PNG + PDF" },
];

const deviceGuides = [
  {
    title: "PC / Laptop",
    subtitle: "Best for Chrome, Edge, Firefox",
    icon: Monitor,
    accent: "mint",
    steps: [
      <>Open UMS <strong>Registered Courses</strong> or <strong>Advising Table</strong>.</>,
      <>Press <strong>Ctrl + S</strong> and save as HTML / complete webpage.</>,
      <>Drop the saved file into the importer. Registered Courses auto-builds the routine.</>,
    ],
  },
  {
    title: "Android",
    subtitle: "Works even if the file has no extension",
    icon: Smartphone,
    accent: "cyan",
    steps: [
      <>Open the UMS page in Chrome or your browser.</>,
      <>Tap menu <strong>⋮</strong> → <strong>Download</strong>. It may save as MHTML or without an extension.</>,
      <>Upload that downloaded file. If download fails, upload a clear screenshot.</>,
    ],
  },
  {
    title: "iPhone / iPad",
    subtitle: "Use PDF or full-page screenshot",
    icon: Smartphone,
    accent: "mint",
    badge: "iPhone tip",
    steps: [
      <>Open Registered Courses in Safari and wait until schedules load.</>,
      <>Tap <strong>Share</strong> → <strong>Options</strong> → <strong>PDF</strong> → Save to Files.</>,
      <>If PDF is missing, use <strong>Print</strong>, pinch open preview, then Share → Save to Files.</>,
      <>Or in Chrome, tap <strong>Reading Mode</strong> → <strong>Share</strong> → <strong>Print</strong> → <strong>Save as PDF</strong>.</>,
    ],
  },
];

const exportExamples = [
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
];

function UmsToRoutineAnimation() {
  const [coords, setCoords] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setCoords({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
  };

  return (
    <div
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="group/hero-anim relative mx-auto flex h-[200px] w-full max-w-[480px] items-center justify-center overflow-hidden rounded-[2rem] border border-white/[0.06] bg-[#071122]/40 backdrop-blur-sm p-4 shadow-2xl animate-rise-in transition-all duration-500 hover:border-cyan-400/20 hover:bg-[#071122]/50 cursor-crosshair"
    >
      {/* Background Tech Grid */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.015)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.015)_1px,transparent_1px)] bg-[size:20px_20px] [mask-image:radial-gradient(ellipse_at_center,white,transparent_80%)]" />

      {/* Interactive Cursor Glow */}
      {isHovered && (
        <div
          className="pointer-events-none absolute -inset-px rounded-[2rem] opacity-100 transition-opacity duration-300"
          style={{
            background: `radial-gradient(150px circle at ${coords.x}px ${coords.y}px, rgba(34, 211, 238, 0.12), transparent 80%)`,
          }}
        />
      )}

      {/* Radar Expansion/Pulsing Waves */}
      <div className="absolute h-[100px] w-[100px] rounded-full border border-mint-400/10 animate-[ping_4s_infinite] group-hover/hero-anim:animate-[ping_2s_infinite] transition-all duration-500" />
      <div className="absolute h-[160px] w-[160px] rounded-full border border-mint-400/5 animate-[ping_5s_infinite_1.5s] group-hover/hero-anim:animate-[ping_2.5s_infinite_0.75s] transition-all duration-500" />
      <div className="absolute h-[220px] w-[220px] rounded-full border border-dashed border-white/5 transition-all duration-500 group-hover/hero-anim:scale-105 group-hover/hero-anim:border-white/10 group-hover/hero-anim:animate-[spin_25s_linear_infinite]" />
      <div className="absolute h-[320px] w-[320px] rounded-full border border-dashed border-white/5 opacity-50 transition-all duration-500 group-hover/hero-anim:scale-105 group-hover/hero-anim:opacity-70 group-hover/hero-anim:animate-[spin_35s_linear_infinite_reverse]" />

      {/* Content Layout */}
      <div className="relative flex items-center justify-between w-full max-w-[360px] gap-3">
        
        {/* Left Side: UMS Doc (Clickable Link) */}
        <a
          href="https://ums.seu.edu.bd/"
          target="_blank"
          rel="noopener noreferrer"
          title="Go to SEU UMS website"
          className="group/box flex flex-col items-center justify-center h-[96px] w-[86px] rounded-2xl border border-white/10 bg-[#081424]/90 p-3 transition-all duration-300 hover:scale-105 hover:border-cyan-400/30 hover:bg-[#0c1d35] hover:shadow-[0_0_15px_rgba(34,211,238,0.1)]"
        >
          <div className="flex flex-1 items-center justify-center text-slate-400 group-hover/box:text-cyan-300 transition-colors duration-300">
            <FileText size={32} strokeWidth={1.5} />
          </div>
          <span className="mt-1.5 text-[11px] font-bold tracking-[0.08em] text-slate-400 group-hover/box:text-cyan-300 transition-colors duration-300">UMS</span>
        </a>

        {/* Center: Connect Line + Rotating Sync Badge */}
        <div className="flex flex-col items-center justify-center flex-1 relative">
          {/* Connector Line */}
          <div className="absolute left-[-16px] right-[-16px] top-[24px] h-[1px] bg-gradient-to-r from-transparent via-mint-500/30 to-transparent transition-all duration-500 group-hover/hero-anim:via-mint-400/50" />
          
          {/* Traveling Energy Particles */}
          <div className="absolute left-[-6px] right-[-6px] top-[20px] overflow-hidden h-[9px] pointer-events-none w-[calc(100%+12px)]">
            <div className="absolute top-[4px] h-[1px] w-[15px] bg-gradient-to-r from-transparent via-cyan-300 to-transparent blur-[0.5px] animate-flow-particle" />
            <div className="absolute top-[4px] h-[1px] w-[15px] bg-gradient-to-r from-transparent via-cyan-300 to-transparent blur-[0.5px] animate-flow-particle" style={{ animationDelay: "1s" }} />
          </div>
          
          {/* Sync Badge */}
          <div className="relative z-10 flex h-[48px] w-[48px] items-center justify-center rounded-full border border-mint-400/30 bg-[#0c1b35] shadow-[0_0_20px_rgba(32,222,214,0.15)] transition-all duration-500 hover:scale-110 group-hover/hero-anim:border-mint-400/50 group-hover/hero-anim:shadow-[0_0_30px_rgba(32,222,214,0.25)]">
            <RefreshCw size={18} className="text-mint-300 animate-[spin_10s_linear_infinite] group-hover/hero-anim:animate-[spin_4s_linear_infinite]" />
          </div>
          <span className="mt-1.5 text-[9px] font-bold tracking-[0.2em] text-slate-500 transition-colors duration-500 group-hover/hero-anim:text-mint-300">TO</span>
        </div>

        {/* Right Side: Routine Calendar (Clickable Link) */}
        <button
          onClick={() => {
            const routineEl = document.getElementById("routine");
            if (routineEl) {
              routineEl.scrollIntoView({ behavior: "smooth", block: "start" });
            } else {
              document.getElementById("tools")?.scrollIntoView({ behavior: "smooth", block: "start" });
            }
          }}
          title="Scroll to routine section"
          className="group/box flex flex-col items-center justify-center h-[96px] w-[86px] rounded-2xl border border-mint-400/20 bg-[#081424]/90 p-3 transition-all duration-300 hover:scale-105 hover:border-mint-400/40 hover:bg-[#0c1d35] hover:shadow-[0_0_30px_rgba(32,222,214,0.18)] cursor-pointer"
        >
          <div className="flex flex-1 items-center justify-center text-mint-300 animate-pulse group-hover/box:scale-110 transition-transform duration-300">
            <CalendarDays size={32} strokeWidth={1.5} />
          </div>
          <span className="mt-1.5 text-[11px] font-bold tracking-[0.08em] text-mint-300">ROUTINE</span>
        </button>

      </div>
    </div>
  );
}



export default function Hero({ onGetStarted, onOpenOrganizer }) {
  const [showExportModal, setShowExportModal] = useState(false);
  const [showGuide, setShowGuide] = useState(false);

  useEffect(() => {
    if (!showExportModal) return undefined;
    const handleKey = (event) => {
      if (event.key === "Escape") setShowExportModal(false);
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [showExportModal]);

  const scrollToTools = () => {
    if (onGetStarted) {
      onGetStarted();
    } else {
      document.getElementById("tools")?.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <>
      <section className="relative mb-8 w-full overflow-hidden rounded-3xl border border-white/[0.06] bg-[radial-gradient(circle_at_88%_12%,rgba(32,222,214,0.09),transparent_42%),linear-gradient(145deg,#0b172f_0%,#091326_55%)] px-5 py-6 sm:mb-10 sm:px-8 sm:py-8 lg:px-10 lg:py-6">
        <div className="pointer-events-none absolute -right-24 -top-24 h-80 w-80 rounded-full border border-mint-400/10" />
        <div className="pointer-events-none absolute -right-8 top-12 h-40 w-40 rounded-full border border-mint-400/10" />
        <div className="pointer-events-none absolute bottom-[26%] left-0 h-48 w-full bg-[linear-gradient(180deg,transparent,rgba(32,222,214,.035),transparent)]" />

        <div className="relative mx-auto max-w-[1280px]">
          <div className="flex flex-col items-center justify-center gap-8 py-3 text-center lg:gap-6">
            <div className="max-w-5xl">
              <div
                className="mx-auto inline-flex animate-fade-in items-center gap-2 rounded-full border border-mint-400/20 bg-mint-400/[0.07] px-4 py-1.5 text-xs font-medium tracking-[0.5px] text-mint-300"
                style={{ animationDelay: "80ms" }}
              >
                <Sparkles size={14} />
                ROUTINE MAKER SEU - BUILT FOR SOUTHEAST UNIVERSITY STUDENTS
              </div>

              <h1
                className="mx-auto mt-5 max-w-3xl text-balance text-4xl font-semibold leading-[1.05] tracking-[-0.05em] text-white sm:text-5xl lg:text-[58px] xl:text-[64px]"
                aria-label={HEADLINE_TEXT}
              >
                  <span className="sr-only">{HEADLINE_TEXT}</span>
                <span aria-hidden="true" className="block overflow-hidden">
                  <span className="hero-title-word" style={{ "--hero-delay": "0ms" }}>Build your</span>{" "}
                  <span className="hero-title-word hero-title-word-glow" style={{ "--hero-delay": "110ms" }}>SEU routine</span>
                </span>
                <span aria-hidden="true" className="block overflow-hidden">
                  <span className="hero-title-word" style={{ "--hero-delay": "220ms" }}>within seconds.</span>
                </span>
              </h1>



              <div
                className="mt-7 flex animate-fade-up flex-col items-center justify-center gap-3 sm:flex-row"
                style={{ animationDelay: "500ms" }}
              >
                <button onClick={scrollToTools} className="primary-button group h-11 w-full max-w-[305px] px-7 text-sm sm:w-auto sm:min-w-[205px]">
                  Import your UMS file
                  <ArrowRight className="transition group-hover:translate-x-0.5" size={18} />
                </button>

                <button
                  onClick={() => {
                    if (onOpenOrganizer) onOpenOrganizer();
                    else window.open("#section-organizer", "_blank");
                  }}
                  className="secondary-button h-11 w-full max-w-[305px] px-6 text-sm sm:w-auto sm:min-w-[205px]"
                >
                  <WandSparkles size={18} />
                  Use Magic Organizer
                </button>

                <button
                  onClick={() => setShowExportModal(true)}
                  className="secondary-button hidden h-11 min-w-[185px] items-center gap-2 px-5 text-sm sm:inline-flex"
                >
                  See export examples
                  <Download size={16} />
                </button>
              </div>
            </div>

            {/* Animation Section */}
            <div className="w-full max-w-5xl mt-4">
              <UmsToRoutineAnimation />
            </div>
          </div>

          <div
            className="mt-7 animate-fade-up pt-6"
            style={{ animationDelay: "680ms" }}
          >
            <button
              onClick={() => setShowGuide((prev) => !prev)}
              className="flex w-full items-center justify-between gap-3 rounded-2xl border border-white/10 bg-white/[0.025] px-5 py-3.5 text-left transition hover:border-mint-300/35 hover:bg-white/[0.04]"
            >
              <div>
                <div className="text-xs font-semibold uppercase tracking-[.18em] text-mint-300">Import guide</div>
                <div className="mt-0.5 text-sm font-semibold tracking-[-.02em] text-white sm:text-base">Choose your device and upload the easiest file.</div>
              </div>
              <ChevronDown
                size={20}
                className={`shrink-0 text-slate-400 transition-transform duration-300 ${showGuide ? "rotate-180" : ""}`}
              />
            </button>

            <div
              className={`grid transition-all duration-300 ease-in-out ${
                showGuide ? "mt-4 grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
              }`}
            >
              <div className="overflow-hidden">
                <div className="mb-3 flex justify-end">
                  <button
                    onClick={scrollToTools}
                    className="inline-flex w-fit items-center gap-2 rounded-full border border-mint-400/20 bg-mint-400/10 px-4 py-2 text-sm font-semibold text-mint-200 transition hover:border-mint-300/45 hover:bg-mint-400/15"
                  >
                    Go to importer <ArrowRight size={15} />
                  </button>
                </div>

                <div className="grid gap-4 lg:grid-cols-3">
                  {deviceGuides.map(({ title, subtitle, icon: Icon, accent, badge, steps }) => (
                    <article
                      key={title}
                      className={`group relative overflow-hidden rounded-2xl border p-4 transition hover:-translate-y-0.5 ${
                        badge
                          ? "border-mint-400/25 bg-mint-400/[.04] shadow-[0_0_60px_rgba(32,222,214,.06)] hover:border-mint-300/45 hover:bg-mint-400/[.06]"
                          : "border-white/10 bg-white/[.025] hover:border-mint-300/35 hover:bg-white/[.04]"
                      }`}
                    >
                      {badge && (
                        <div className="absolute right-4 top-4 rounded-full bg-mint-300 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-[#061325]">
                          {badge}
                        </div>
                      )}
                      <div className={badge ? "flex items-center gap-3 pr-20" : "flex items-center gap-3"}>
                        <span className={`grid h-11 w-11 place-items-center rounded-2xl border ${
                          accent === "cyan"
                            ? "border-cyan-400/15 bg-cyan-400/10 text-cyan-300"
                            : "border-mint-400/15 bg-mint-400/10 text-mint-300"
                        }`}>
                          <Icon size={20} />
                        </span>
                        <div>
                          <div className="text-sm font-semibold text-white">{title}</div>
                          <div className="text-xs text-slate-500">{subtitle}</div>
                        </div>
                      </div>
                      <ol className="mt-4 space-y-2.5 text-sm leading-6 text-slate-300">
                        {steps.map((step, index) => (
                          <li key={index} className="flex gap-3">
                            <span className="font-mono text-mint-300">{index + 1}</span>
                            <span>{step}</span>
                          </li>
                        ))}
                      </ol>
                    </article>
                  ))}
                </div>

                <div className="mt-4 rounded-2xl border border-white/10 bg-black/10 px-4 py-3 text-center text-xs text-slate-400">
                  Fastest path: after advising, upload <strong className="text-slate-200">Registered Courses</strong>. Before advising, upload <strong className="text-slate-200">Offered Sections</strong> and use Magic Organizer.
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {showExportModal && (
        <div
          className="fixed inset-0 z-[200] flex animate-fade-in items-center justify-center bg-black/80 p-3 backdrop-blur-sm sm:p-4"
          onClick={() => setShowExportModal(false)}
        >
          <div
            className="flex max-h-[92dvh] w-full max-w-6xl animate-scale-in flex-col overflow-hidden rounded-3xl border border-white/10 bg-[#0a1629] shadow-2xl"
            style={{ animationDelay: "60ms" }}
            onClick={(event) => event.stopPropagation()}
          >
            <div className="sticky top-0 z-10 flex items-center justify-between border-b border-white/10 bg-[#0a1629] px-4 py-3 sm:px-6 sm:py-4">
              <div>
                <div className="flex items-center gap-2 text-base font-semibold text-white sm:text-lg">
                  <Sparkles size={18} className="text-mint-400 sm:size-5" /> Export Examples
                </div>
                <p className="hidden text-[10px] text-slate-400 sm:block sm:text-xs">Real polished outputs from SEU Routine Maker</p>
              </div>
              <button
                onClick={() => setShowExportModal(false)}
                className="rounded-full p-2.5 text-slate-400 transition hover:bg-white/5 hover:text-white active:bg-white/10 sm:p-2"
                aria-label="Close"
              >
                <X size={22} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto">
              <div className="grid gap-3 p-4 sm:grid-cols-2 sm:gap-4 sm:p-6 lg:grid-cols-4">
                {exportExamples.map((example, index) => (
                  <div
                    key={example.title}
                    className="group animate-fade-up overflow-hidden rounded-2xl border border-white/10 bg-[#081422] transition-all duration-200 hover:-translate-y-0.5 hover:border-mint-400/40 hover:shadow-xl"
                    style={{ animationDelay: `${220 + index * 70}ms` }}
                  >
                    <div className="relative overflow-hidden bg-black/40">
                      <img
                        src={example.src}
                        alt={example.title}
                        className="h-28 w-full object-contain p-2 transition-transform duration-300 group-hover:scale-[1.015] sm:h-36 md:h-44"
                        loading="lazy"
                      />
                    </div>
                    <div className="p-3 sm:p-4">
                      <div className="text-sm font-semibold text-white sm:text-base">{example.title}</div>
                      <p className="mt-1 text-[10px] leading-snug text-slate-400 sm:text-xs">{example.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="shrink-0 border-t border-white/10 bg-[#081422] px-4 py-3 text-center text-[10px] text-slate-500 sm:text-[11px]">
              All styles are generated 100% in your browser using html2canvas. No server involved.
            </div>
          </div>
        </div>
      )}
    </>
  );
}
