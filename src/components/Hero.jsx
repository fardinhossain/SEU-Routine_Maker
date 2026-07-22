import { useEffect, useState } from "react";
import {
  ArrowRight,
  CalendarCheck,
  CalendarDays,
  CheckCircle2,
  ChevronDown,
  Download,
  Eye,
  FileDown,
  FileText,
  Lock,
  Monitor,
  RefreshCw,
  ShieldCheck,
  Sparkles,
  Smartphone,
  Upload,
  UserCheck,
  WandSparkles,
  X,
  Zap,
} from "lucide-react";

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

const deviceGuides = [
  {
    title: "PC / Laptop",
    subtitle: "Best for Chrome, Edge, Firefox",
    icon: Monitor,
    accent: "cream",
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
    accent: "cream",
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
    accent: "cream",
    badge: "iPhone tip",
    steps: [
      <>Open Registered Courses in Safari and wait until schedules load.</>,
      <>Tap <strong>Share</strong> → <strong>Options</strong> → <strong>PDF</strong> → Save to Files.</>,
      <>If PDF is missing, use <strong>Print</strong>, pinch open preview, then Share → Save to Files.</>,
      <>Or in Chrome, tap <strong>Reading Mode</strong> → <strong>Share</strong> → <strong>Print</strong> → <strong>Save as PDF</strong>.</>,
    ],
  },
];

function InteractiveDashboardMockup({ onGoToImport, onGoToRoutine }) {
  return (
    <div className="relative mx-auto w-full max-w-[560px] perspective-[1000deg]">
      {/* Background Orbital Rings & Glow */}
      <div className="pointer-events-none absolute -right-12 -top-12 h-72 w-72 rounded-full border border-[#412D15]/50/40 bg-[radial-gradient(circle,rgba(225,220,201,0.06)_0%,transparent_70%)] blur-md" />
      <div className="pointer-events-none absolute -left-12 -bottom-12 h-64 w-64 rounded-full border border-[#412D15]/50/30 bg-[radial-gradient(circle,rgba(196,154,98,0.05)_0%,transparent_70%)] blur-md" />

      {/* Main Glass Dashboard Tablet */}
      <div className="relative overflow-hidden rounded-3xl border border-[#412D15]/50 bg-[#1F150C]/30 backdrop-blur-md p-5 sm:p-6 shadow-[0_25px_70px_rgba(0,0,0,0.9)] backdrop-blur-2xl transition-all duration-500 hover:border-[#E1DCC9]/40 hover:shadow-[0_30px_90px_rgba(0,0,0,0.95)]">
        {/* Subtle Top Header Label */}
        <div className="flex items-center justify-between border-b border-[#412D15]/50/60 pb-3">
          <span className="text-[10px] font-bold tracking-[0.2em] text-[#E1DCC9] uppercase">
            Your Class Routine
          </span>
          <div className="flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full bg-[#E1DCC9]/80" />
            <span className="h-2 w-2 rounded-full bg-[#C49A62]/60" />
            <span className="h-2 w-2 rounded-full bg-emerald-400/80" />
          </div>
        </div>

        {/* Top Flow Row: Import -> Wand -> Result */}
        <div className="mt-4 grid grid-cols-[1fr_auto_1fr] items-center gap-3">
          {/* Step 1: Import Box */}
          <button
            type="button"
            onClick={onGoToImport}
            className="group flex flex-col items-center justify-center rounded-2xl border border-[#412D15]/50 bg-black p-3.5 text-center shadow-inner transition hover:scale-[1.03] hover:border-[#E1DCC9]/70 cursor-pointer"
            title="Go to Import Section"
          >
            <div className="grid h-9 w-9 place-items-center rounded-xl border border-[#412D15]/50 bg-black text-[#E1DCC9] transition group-hover:border-[#E1DCC9]/60">
              <FileText size={18} />
            </div>
            <span className="mt-2 text-xs font-bold text-white transition group-hover:text-[#E1DCC9]">Import UMS File</span>
            <span className="mt-0.5 text-[10px] text-[#C7BFD0]">.html, .mhtml, .pdf</span>
            <div className="mt-2 grid h-6 w-6 place-items-center rounded-full bg-[#E1DCC9] text-[#000000] text-xs font-bold transition group-hover:bg-white group-hover:scale-110">
              ↑
            </div>
          </button>

          {/* Step 2: Magic Wand Connector */}
          <div className="flex flex-col items-center justify-center">
            <div className="relative grid h-10 w-10 place-items-center rounded-full border border-[#E1DCC9]/40 bg-black text-[#E1DCC9] shadow-[0_0_18px_rgba(225,220,201,0.25)] animate-pulse">
              <WandSparkles size={18} />
            </div>
          </div>

          {/* Step 3: Output Box */}
          <button
            type="button"
            onClick={onGoToRoutine}
            className="group flex flex-col items-center justify-center rounded-2xl border border-[#E1DCC9]/40 bg-black p-3.5 text-center shadow-inner transition hover:scale-[1.03] hover:border-[#E1DCC9]/90 cursor-pointer"
            title="Go to Routine View Section"
          >
            <div className="grid h-9 w-9 place-items-center rounded-xl border border-[#E1DCC9]/40 bg-black text-[#E1DCC9] transition group-hover:border-[#E1DCC9]/80">
              <CalendarDays size={18} />
            </div>
            <span className="mt-2 text-xs font-bold text-white transition group-hover:text-[#E1DCC9]">Your Routine</span>
            <span className="mt-0.5 text-[10px] text-[#C7BFD0]">Organized. Optimized.</span>
            <div className="mt-2 grid h-6 w-6 place-items-center rounded-full bg-[#E1DCC9] text-[#000000] text-xs font-bold shadow-[0_0_12px_rgba(225,220,201,0.4)] transition group-hover:bg-white group-hover:scale-110">
              ✓
            </div>
          </button>
        </div>

        {/* Timetable Schedule Grid Preview */}
        <div className="mt-5 overflow-hidden rounded-2xl border border-[#412D15]/50 bg-black/60 p-3">
          <div className="grid grid-cols-[50px_1fr_1fr_1fr_1fr_1fr_1fr] text-center text-[10px] font-semibold text-[#C7BFD0] border-b border-[#412D15]/50 pb-1.5">
            <span>Time</span>
            <span>Sun</span>
            <span>Mon</span>
            <span>Wed</span>
            <span>Thu</span>
            <span>Fri</span>
            <span>Sat</span>
          </div>

          <div className="mt-2 space-y-1.5 text-[10px]">
            {/* Row 1 */}
            <div className="grid grid-cols-[50px_1fr_1fr_1fr_1fr_1fr_1fr] items-center gap-1 text-center">
              <span className="font-mono text-[9px] text-[#C7BFD0]">08:00</span>
              <div className="rounded bg-[#E1DCC9]/20 border border-[#E1DCC9]/40 py-1 font-bold text-[#E1DCC9]">OS</div>
              <div className="opacity-0">-</div>
              <div className="opacity-0">-</div>
              <div className="opacity-0">-</div>
              <div className="opacity-0">-</div>
              <div className="opacity-0">-</div>
            </div>

            {/* Row 2 */}
            <div className="grid grid-cols-[50px_1fr_1fr_1fr_1fr_1fr_1fr] items-center gap-1 text-center">
              <span className="font-mono text-[9px] text-[#C7BFD0]">10:00</span>
              <div className="opacity-0">-</div>
              <div className="opacity-0">-</div>
              <div className="rounded bg-[#C49A62]/20 border border-[#C49A62]/40 py-1 font-bold text-[#C49A62]">DBMS</div>
              <div className="opacity-0">-</div>
              <div className="rounded bg-emerald-500/20 border border-emerald-400/40 py-1 font-bold text-emerald-200">AG</div>
              <div className="opacity-0">-</div>
            </div>

            {/* Row 3 */}
            <div className="grid grid-cols-[50px_1fr_1fr_1fr_1fr_1fr_1fr] items-center gap-1 text-center">
              <span className="font-mono text-[9px] text-[#C7BFD0]">12:00</span>
              <div className="opacity-0">-</div>
              <div className="rounded bg-[#D6B588]/20 border border-[#D6B588]/40 py-1 font-bold text-[#D6B588]">DS</div>
              <div className="opacity-0">-</div>
              <div className="rounded bg-amber-500/20 border border-amber-400/40 py-1 font-bold text-amber-200">MIS</div>
              <div className="opacity-0">-</div>
              <div className="rounded bg-[#E1DCC9]/20 border border-[#E1DCC9]/40 py-1 font-bold text-[#E1DCC9]">ENG</div>
            </div>

            {/* Row 4 */}
            <div className="grid grid-cols-[50px_1fr_1fr_1fr_1fr_1fr_1fr] items-center gap-1 text-center">
              <span className="font-mono text-[9px] text-[#C7BFD0]">02:00</span>
              <div className="opacity-0">-</div>
              <div className="opacity-0">-</div>
              <div className="rounded bg-emerald-500/20 border border-emerald-400/40 py-1 font-bold text-emerald-200">BIG</div>
              <div className="opacity-0">-</div>
              <div className="opacity-0">-</div>
              <div className="rounded bg-[#C49A62]/20 border border-[#C49A62]/40 py-1 font-bold text-[#C49A62]">WT</div>
            </div>

            {/* Row 5 */}
            <div className="grid grid-cols-[50px_1fr_1fr_1fr_1fr_1fr_1fr] items-center gap-1 text-center">
              <span className="font-mono text-[9px] text-[#C7BFD0]">04:00</span>
              <div className="opacity-0">-</div>
              <div className="opacity-0">-</div>
              <div className="opacity-0">-</div>
              <div className="rounded bg-[#D6B588]/20 border border-[#D6B588]/40 py-1 font-bold text-[#D6B588]">WT</div>
              <div className="opacity-0">-</div>
              <div className="opacity-0">-</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function Hero({ onGetStarted, onOpenOrganizer, onGoToImport, onGoToRoutine }) {
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

  const scrollToImport = () => {
    if (onGoToImport) {
      onGoToImport();
    } else {
      document.getElementById("tools")?.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  const scrollToRoutine = () => {
    if (onGoToRoutine) {
      onGoToRoutine();
    } else {
      document.getElementById("routine-view")?.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <>
      <section className="relative mb-12 w-full overflow-hidden rounded-3xl border border-[#412D15]/50 bg-[#000000] px-4 py-8 sm:px-8 sm:py-12 lg:px-12">
        {/* Background Ambient Elements */}
        <div className="pointer-events-none absolute -right-32 -top-32 h-[450px] w-[450px] rounded-full border border-[#412D15]/30 bg-[radial-gradient(circle,rgba(225,220,201,0.04)_0%,transparent_70%)]" />
        <div className="pointer-events-none absolute -left-32 bottom-0 h-[400px] w-[400px] rounded-full border border-[#412D15]/20 bg-[radial-gradient(circle,rgba(196,154,98,0.04)_0%,transparent_70%)]" />

        <div className="relative mx-auto max-w-[1360px]">
          {/* Main 2-Column Layout */}
          <div className="grid gap-12 lg:grid-cols-12 lg:items-center">
            {/* Left Hero Column */}
            <div className="lg:col-span-7 flex flex-col items-start text-left">
              {/* Badge Pill & Headline Wrapper */}
              <div className="-mt-1 sm:-mt-2">
                <div className="inline-flex items-center gap-2 rounded-full border border-[#412D15]/50 bg-[#1F150C]/30 backdrop-blur-md px-4 py-1.5 text-xs font-semibold text-[#E1DCC9] shadow-sm">
                  <Sparkles size={14} className="text-[#E1DCC9]" />
                  <span>BUILT FOR SOUTHEAST UNIVERSITY STUDENTS</span>
                </div>

                {/* Large Headline */}
                <h1 className="mt-3.5 text-4xl font-extrabold tracking-tight text-white sm:text-6xl lg:text-[62px] leading-[1.08]">
                  Build your SEU <br />
                  <span className="text-[#E1DCC9]">routine within </span>
                  <span className="text-[#E1DCC9] drop-shadow-[0_0_20px_rgba(225,220,201,0.25)] font-black">
                    seconds.
                  </span>
                </h1>
              </div>

              {/* Action Buttons Row */}
              <div className="mt-7 sm:mt-9 flex flex-wrap items-center gap-3.5 w-full">
                <button
                  onClick={scrollToTools}
                  className="inline-flex items-center justify-center gap-2.5 rounded-2xl bg-[#E1DCC9] px-7 py-3.5 text-sm font-bold text-[#000000] shadow-[0_0_30px_rgba(225,220,201,0.25)] transition duration-200 hover:bg-[#EFEBDC] hover:scale-[1.02] active:scale-[0.98]"
                >
                  <Upload size={18} />
                  <span>Import your UMS file</span>
                  <ArrowRight size={18} />
                </button>

                <button
                  onClick={() => {
                    if (onOpenOrganizer) onOpenOrganizer();
                    else window.open("#section-organizer", "_blank");
                  }}
                  className="inline-flex items-center justify-center gap-2 rounded-2xl border border-[#412D15]/50 bg-[#1F150C]/30 backdrop-blur-md/35 backdrop-blur-md px-6 py-3.5 text-sm font-semibold text-white backdrop-blur transition duration-200 hover:border-[#E1DCC9]/40 hover:bg-[#2E1E12]/35 backdrop-blur-md hover:scale-[1.02]"
                >
                  <WandSparkles size={18} className="text-[#E1DCC9]" />
                  <span>Use Magic Organizer</span>
                </button>

                <button
                  onClick={() => setShowExportModal(true)}
                  className="inline-flex items-center justify-center gap-2 rounded-2xl border border-[#412D15]/50 bg-[#1F150C]/30 backdrop-blur-md/35 backdrop-blur-md px-5 py-3.5 text-sm font-semibold text-[#C7BFD0] backdrop-blur transition duration-200 hover:border-[#E1DCC9]/40 hover:text-white"
                >
                  <Eye size={18} />
                  <span>See examples</span>
                </button>
              </div>

              {/* Feature Pills Row */}
              <div className="mt-8 flex flex-wrap items-center gap-3">
                <div className="inline-flex items-center gap-2 rounded-full border border-[#412D15]/50/80 bg-[#1F150C]/30 backdrop-blur-md/25 backdrop-blur-md px-4 py-2 text-xs font-semibold text-[#C7BFD0]">
                  <Zap size={14} className="text-[#E1DCC9]" />
                  <span>Instant & Smart</span>
                </div>
                <div className="inline-flex items-center gap-2 rounded-full border border-[#412D15]/50/80 bg-[#1F150C]/30 backdrop-blur-md/25 backdrop-blur-md px-4 py-2 text-xs font-semibold text-[#C7BFD0]">
                  <ShieldCheck size={14} className="text-emerald-400" />
                  <span>Conflict Free</span>
                </div>
                <div className="inline-flex items-center gap-2 rounded-full border border-[#412D15]/50/80 bg-[#1F150C]/30 backdrop-blur-md/25 backdrop-blur-md px-4 py-2 text-xs font-semibold text-[#C7BFD0]">
                  <FileDown size={14} className="text-[#E1DCC9]" />
                  <span>Export to PDF / PNG</span>
                </div>
              </div>
            </div>

            {/* Right Hero Column: Interactive Dashboard Mockup */}
            <div className="lg:col-span-5 flex items-center justify-center">
              <InteractiveDashboardMockup onGoToImport={scrollToImport} onGoToRoutine={scrollToRoutine} />
            </div>
          </div>

          {/* Import Device Guide Accordion */}
          <div className="mt-8 flex flex-col items-start">
            <button
              onClick={() => setShowGuide((prev) => !prev)}
              className="inline-flex items-center justify-center gap-2.5 rounded-xl border border-[#412D15]/60 bg-[#1F150C]/40 backdrop-blur-md px-5 py-2.5 text-center text-sm font-semibold text-[#E1DCC9] shadow-sm transition hover:border-[#E1DCC9]/50 hover:bg-[#2E1E12]/50 hover:text-white cursor-pointer"
            >
              <FileText size={16} className="text-[#E1DCC9]" />
              <span>Import Guide</span>
              <ChevronDown
                size={16}
                className={`shrink-0 text-[#C7BFD0] transition-transform duration-300 ${showGuide ? "rotate-180" : ""}`}
              />
            </button>

            <div
              className={`grid w-full transition-all duration-300 ease-in-out ${
                showGuide ? "mt-5 grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
              }`}
            >
              <div className="overflow-hidden">
                <div className="mb-3 flex justify-end">
                  <button
                    onClick={scrollToTools}
                    className="inline-flex w-fit items-center gap-2 rounded-full border border-[#412D15]/50 bg-[#2E1E12]/35 backdrop-blur-md px-4 py-2 text-sm font-semibold text-[#E1DCC9] transition hover:border-[#E1DCC9]/45 hover:bg-[#412D15]/25 backdrop-blur-md"
                  >
                    Go to importer <ArrowRight size={15} />
                  </button>
                </div>

                <div className="grid gap-4 lg:grid-cols-3">
                  {deviceGuides.map(({ title, subtitle, icon: Icon, badge, steps }) => (
                    <article
                      key={title}
                      className="group relative overflow-hidden rounded-2xl border border-[#412D15]/50 bg-[#1F150C]/30 backdrop-blur-md/35 backdrop-blur-md p-4 transition hover:-translate-y-0.5 hover:border-[#E1DCC9]/40"
                    >
                      {badge && (
                        <div className="absolute right-4 top-4 rounded-full bg-[#E1DCC9] px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-[#000000]">
                          {badge}
                        </div>
                      )}
                      <div className={badge ? "flex items-center gap-3 pr-20" : "flex items-center gap-3"}>
                        <span className="grid h-11 w-11 place-items-center rounded-2xl border border-[#412D15]/50 bg-[#2E1E12]/35 backdrop-blur-md text-[#E1DCC9]">
                          <Icon size={20} />
                        </span>
                        <div>
                          <div className="text-sm font-semibold text-white">{title}</div>
                          <div className="text-xs text-[#C7BFD0]">{subtitle}</div>
                        </div>
                      </div>
                      <ol className="mt-4 space-y-2.5 text-sm leading-6 text-[#C7BFD0]">
                        {steps.map((step, index) => (
                          <li key={index} className="flex gap-3">
                            <span className="font-mono text-[#E1DCC9]">{index + 1}</span>
                            <span>{step}</span>
                          </li>
                        ))}
                      </ol>
                    </article>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Export Examples Modal */}
      {showExportModal && (
        <div
          className="fixed inset-0 z-[200] flex animate-fade-in items-center justify-center bg-black/85 p-3 backdrop-blur-md sm:p-4"
          onClick={() => setShowExportModal(false)}
        >
          <div
            className="flex max-h-[92dvh] w-full max-w-6xl animate-scale-in flex-col overflow-hidden rounded-3xl border border-[#412D15] bg-[#120B05] shadow-2xl"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="sticky top-0 z-10 flex items-center justify-between border-b border-[#412D15]/50 bg-[#1F150C]/30 backdrop-blur-md px-4 py-3 sm:px-6 sm:py-4">
              <div>
                <div className="flex items-center gap-2 text-base font-semibold text-white sm:text-lg">
                  <Sparkles size={18} className="text-[#E1DCC9] sm:size-5" /> Export Examples
                </div>
                <p className="hidden text-[10px] text-[#C7BFD0] sm:block sm:text-xs">Real polished outputs from SEU Routine Maker</p>
              </div>
              <button
                onClick={() => setShowExportModal(false)}
                className="rounded-full p-2.5 text-[#C7BFD0] transition hover:bg-white/5 hover:text-white"
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
                    className="group overflow-hidden rounded-2xl border border-[#412D15]/50 bg-black/40 transition-all duration-200 hover:-translate-y-0.5 hover:border-[#E1DCC9]/40"
                  >
                    <div className="relative overflow-hidden bg-black/60">
                      <img
                        src={example.src}
                        alt={example.title}
                        className="h-28 w-full object-contain p-2 transition-transform duration-300 group-hover:scale-[1.015] sm:h-36 md:h-44"
                        loading="lazy"
                      />
                    </div>
                    <div className="p-3 sm:p-4">
                      <div className="text-sm font-semibold text-white sm:text-base">{example.title}</div>
                      <p className="mt-1 text-[10px] leading-snug text-[#C7BFD0] sm:text-xs">{example.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
