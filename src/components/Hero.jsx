import { useEffect, useState } from "react";
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

function RoutinePreview({ onClick }) {
  return (
    <div className="relative w-full max-w-4xl">
      <div className="pointer-events-none absolute -inset-x-8 bottom-0 h-24 rounded-[50%] bg-mint-400/10 blur-3xl" />
      <div
        onClick={onClick}
        className="group relative mx-auto w-full max-w-[360px] animate-rise-in cursor-pointer overflow-hidden rounded-[1.75rem] border border-mint-400/20 bg-[#0a1629]/95 p-2 shadow-[0_35px_140px_-35px_rgba(32,222,214,.65)] transition-all hover:-translate-y-1 hover:border-mint-300/45 sm:max-w-[520px]"
      >
        <div className="rounded-[1.35rem] border border-white/5 bg-[#081422] p-4 sm:p-5">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <div className="flex items-center gap-2 text-sm font-semibold tracking-tight text-white sm:text-base">
                <CalendarDays size={16} className="text-mint-400" /> SEU Weekly Routine
              </div>
              <div className="text-[10px] uppercase tracking-[2px] text-slate-500">7 days • one clean view</div>
            </div>
            <div className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[10px] font-mono text-mint-300">LIVE</div>
          </div>

          <div className="grid grid-cols-1 gap-2.5 text-sm group-hover:[&>div]:scale-[1.01] min-[430px]:grid-cols-3 min-[430px]:items-stretch sm:block sm:space-y-2.5">
            {[
              ["SAT", "CSE361.3", "Operating Systems • R-301", "09:00–10:20", "cyan"],
              ["SUN–TUE", "CSE443.1", "Computer Networks • Lab 4", "11:00–12:20", "violet"],
              ["WED", "CSE362.2", "Software Engineering • R-205", "14:00–16:50", "amber"],
            ].map(([day, code, title, time, color], index) => (
              <div
                key={day}
                className="grid min-h-[150px] grid-rows-[auto_1fr] gap-2.5 transition-all duration-300 group-hover:-translate-y-px min-[430px]:min-h-[175px] sm:flex sm:min-h-0 sm:gap-2.5"
                style={{ animationDelay: `${420 + index * 90}ms` }}
              >
                <div className={`grid min-h-[44px] place-items-center rounded-2xl px-2 py-2 text-center text-[11px] font-bold tracking-[1px] sm:w-16 sm:shrink-0 sm:py-2.5 ${
                  color === "cyan"
                    ? "bg-cyan-400/10 text-cyan-300"
                    : color === "violet"
                      ? "bg-violet-400/10 text-violet-300"
                      : "bg-amber-400/10 text-amber-300"
                }`}>
                  {day}
                </div>
                <div className={`grid min-h-[92px] flex-1 place-items-center rounded-2xl border px-3 py-3 text-center sm:block sm:min-h-0 sm:px-3.5 sm:py-2.5 sm:text-left ${
                  color === "cyan"
                    ? "border-cyan-400/20 bg-cyan-400/[0.035]"
                    : color === "violet"
                      ? "border-violet-400/20 bg-violet-400/[0.035]"
                      : "border-amber-400/20 bg-amber-400/[0.035]"
                }`}>
                  <div className="flex w-full flex-col items-center justify-center gap-1 text-xs sm:flex-row sm:justify-between sm:gap-3">
                    <span className={`font-mono ${
                      color === "cyan" ? "text-cyan-300" : color === "violet" ? "text-violet-300" : "text-amber-300"
                    }`}>{code}</span>
                    <span className="text-slate-500">{time}</span>
                  </div>
                  <div className="mt-2 text-sm font-semibold leading-tight text-white sm:mt-1 sm:text-[15px]">{title}</div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-4 flex flex-col items-center justify-center gap-2 border-t border-white/10 pt-3 text-center text-[11px] text-slate-500 min-[430px]:flex-row min-[430px]:justify-between">
            <div>4 courses • 12 sessions • 18.5h</div>
            <div className="font-medium text-mint-400">Ready to export →</div>
          </div>
        </div>
      </div>

      <div className="mt-2 flex flex-wrap justify-center gap-1.5 text-[10px] text-slate-500">
        {["PC", "Modern", "Futuristic", "Mobile"].map((label) => (
          <span key={label} className="rounded border border-white/10 bg-white/[0.03] px-2 py-px">{label}</span>
        ))}
      </div>
    </div>
  );
}

export default function Hero({ onGetStarted, onOpenOrganizer }) {
  const [showExportModal, setShowExportModal] = useState(false);

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
      <section className="relative mb-8 w-full overflow-hidden rounded-3xl border border-white/[0.06] bg-[radial-gradient(circle_at_88%_12%,rgba(32,222,214,0.09),transparent_42%),linear-gradient(145deg,#0b172f_0%,#091326_55%)] px-5 py-6 sm:mb-10 sm:px-8 sm:py-8 lg:px-10 lg:py-9">
        <div className="pointer-events-none absolute -right-24 -top-24 h-80 w-80 rounded-full border border-mint-400/10" />
        <div className="pointer-events-none absolute -right-8 top-12 h-40 w-40 rounded-full border border-mint-400/10" />
        <div className="pointer-events-none absolute bottom-[26%] left-0 h-48 w-full bg-[linear-gradient(180deg,transparent,rgba(32,222,214,.035),transparent)]" />

        <div className="relative mx-auto max-w-[1280px]">
          <div className="flex flex-col items-center justify-center gap-8 py-3 text-center lg:min-h-[calc(100svh-145px)] lg:gap-6 xl:min-h-[calc(100svh-135px)]">
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
                className="mt-5 flex animate-fade-up flex-wrap items-center justify-center gap-x-4 gap-y-2 text-sm text-slate-400"
                style={{ animationDelay: "380ms" }}
              >
                <div className="flex items-center gap-1.5">
                  <Lock size={15} className="text-mint-400" /> Private routine storage
                </div>
                <div className="hidden h-1 w-1 rounded-full bg-white/30 sm:block" />
                <div>No login • OCR only when you upload an image</div>
              </div>

              <div
                className="mt-7 flex animate-fade-up flex-col items-center justify-center gap-3 sm:flex-row"
                style={{ animationDelay: "500ms" }}
              >
                <button onClick={scrollToTools} className="primary-button group h-11 min-w-[205px] px-7 text-sm">
                  Import your UMS file
                  <ArrowRight className="transition group-hover:translate-x-0.5" size={18} />
                </button>

                <button
                  onClick={() => {
                    if (onOpenOrganizer) onOpenOrganizer();
                    else window.open("#section-organizer", "_blank");
                  }}
                  className="secondary-button h-11 min-w-[205px] px-6 text-sm"
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

              <div className="mx-auto mt-4 grid max-w-3xl grid-cols-1 gap-2.5 text-sm min-[430px]:grid-cols-3 sm:flex sm:flex-wrap sm:justify-center">
                {heroFeatures.map(({ icon: Icon, title, meta }, index) => (
                  <div
                    key={title}
                    className="flex min-h-[74px] animate-fade-up items-center gap-2.5 rounded-2xl border border-white/10 bg-white/[0.025] px-3.5 py-2.5 text-left sm:min-w-[170px] sm:flex-1"
                    style={{ animationDelay: `${620 + index * 100}ms` }}
                  >
                    <div className="rounded-lg bg-mint-400/10 p-1.5 text-mint-300">
                      <Icon size={17} />
                    </div>
                    <div>
                      <div className="font-semibold text-white">{title}</div>
                      <div className="text-xs text-slate-500">{meta}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <RoutinePreview onClick={() => setShowExportModal(true)} />
          </div>

          <div
            className="mt-7 animate-fade-up pt-6"
            style={{ animationDelay: "680ms" }}
          >
            <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <div className="text-xs font-semibold uppercase tracking-[.18em] text-mint-300">Import guide</div>
                <h2 className="mt-1 text-lg font-semibold tracking-[-.03em] text-white sm:text-xl">
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
