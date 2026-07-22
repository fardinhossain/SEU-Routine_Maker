import { useEffect } from "react";
import { Database, HardDrive, Image, ShieldCheck, Trash2, X } from "lucide-react";

const POLICY_ITEMS = [
  {
    icon: Database,
    title: "No server database",
    text: "The app has no backend or cloud database. Your UMS HTML, PDF, courses, and routine are not sent to an application server.",
  },
  {
    icon: HardDrive,
    title: "Browser-only storage",
    text: "Imported text, parsed courses, selected codes, and custom labels stay in this browser's localStorage until you reset or clear site data.",
  },
  {
    icon: Image,
    title: "Image OCR service",
    text: "HTML and PDF parsing stays in your browser. When you scan a screenshot, that image is sent through this app's server to PaddleOCR AI Studio for text extraction; the app does not permanently save it.",
  },
  {
    icon: Trash2,
    title: "You control removal",
    text: "Clear import removes imported and parsed data. Clear routine removes selections and the image preview. Reset saved data removes everything saved by the app.",
  },
];

export default function DataPolicyModal({ onClose }) {
  useEffect(() => {
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const handleKeyDown = (event) => {
      if (event.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-[90] flex items-end justify-center bg-black/90 p-0 backdrop-blur-md sm:items-center sm:p-5"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <section
        role="dialog"
        aria-modal="true"
        aria-labelledby="data-policy-title"
        className="max-h-[92vh] w-full overflow-y-auto rounded-t-3xl border border-[#412D15] bg-[#120B05] shadow-2xl sm:max-w-2xl sm:rounded-3xl"
      >
        <div className="sticky top-0 z-10 flex items-start justify-between gap-4 border-b border-[#412D15] bg-[#120B05] px-5 py-5 sm:px-7">
          <div className="flex items-center gap-3">
            <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-[#E1DCC9] text-[#000000]">
              <ShieldCheck size={20} />
            </span>
            <div>
              <h2 id="data-policy-title" className="text-lg font-semibold text-white">User Data Policy</h2>
              <p className="mt-0.5 text-xs text-[#C7BFD0]">Private by design · Last updated June 2026</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="grid h-9 w-9 shrink-0 place-items-center rounded-xl border border-[#412D15] bg-[#1F150C]/50 text-slate-400 transition hover:bg-white/[.07] hover:text-white cursor-pointer"
            aria-label="Close data policy"
          >
            <X size={17} />
          </button>
        </div>

        <div className="p-5 sm:p-7">
          <p className="text-sm leading-6 text-slate-300">
            SEU Routine Maker does not request UMS credentials, create user accounts, or keep a routine database. Screenshot OCR uses PaddleOCR AI Studio; other routine processing remains in your browser.
          </p>

          <div className="mt-5 grid gap-3 sm:grid-cols-2">
            {POLICY_ITEMS.map(({ icon: Icon, title, text }) => (
              <article key={title} className="rounded-2xl border border-[#412D15]/60 bg-[#1A1108] p-4">
                <Icon size={17} className="text-[#E1DCC9]" />
                <h3 className="mt-3 text-sm font-semibold text-slate-100">{title}</h3>
                <p className="mt-1 text-xs leading-5 text-[#C7BFD0]">{text}</p>
              </article>
            ))}
          </div>

          <div className="mt-5 rounded-2xl border border-amber-400/20 bg-amber-400/[.06] p-4 text-xs leading-5 text-amber-100/75">
            <strong className="text-amber-100">Shared-device notice:</strong> Browser localStorage is not encrypted. If you use a public or shared device, select <strong className="text-amber-100">Reset saved data</strong> and clear the browser's site data when finished.
          </div>

          <button type="button" onClick={onClose} className="primary-button mt-5 w-full sm:w-auto">
            I understand
          </button>
        </div>
      </section>
    </div>
  );
}
