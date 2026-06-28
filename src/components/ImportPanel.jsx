import { useRef, useState } from "react";
import { CheckCircle2, FileCode2, LoaderCircle, UploadCloud } from "lucide-react";

export default function ImportPanel({ rawHtml, setRawHtml, onParse, courseCount, parsing }) {
  const inputRef = useRef(null);
  const [fileName, setFileName] = useState("");
  const [dragging, setDragging] = useState(false);

  function loadFile(file) {
    if (!file) return;
    if (!file.name.toLowerCase().endsWith(".html") && !file.name.toLowerCase().endsWith(".htm")) {
      setFileName("Please choose an HTML file");
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      setRawHtml(String(reader.result || ""));
      setFileName(file.name);
    };
    reader.readAsText(file);
  }

  return (
    <section className="panel h-full p-5 sm:p-6" aria-labelledby="import-heading">
      <div className="mb-5 flex items-start justify-between gap-4">
        <div>
          <div className="mb-2 flex items-center gap-2 text-xs font-semibold uppercase tracking-[.18em] text-mint-400">
            <span className="step-number">1</span>
            Import data
          </div>
          <h2 id="import-heading" className="text-xl font-semibold text-white">Add your UMS export</h2>
          <p className="mt-1 text-sm text-slate-400">Upload the saved page or paste its raw HTML.</p>
        </div>
        {courseCount > 0 && (
          <span className="flex shrink-0 items-center gap-1.5 rounded-full bg-mint-400/10 px-2.5 py-1 text-xs font-medium text-mint-300">
            <CheckCircle2 size={13} /> {courseCount} parsed
          </span>
        )}
      </div>

      <div className="grid gap-4 lg:grid-cols-[.8fr_1.2fr]">
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          onDragOver={(event) => { event.preventDefault(); setDragging(true); }}
          onDragLeave={() => setDragging(false)}
          onDrop={(event) => {
            event.preventDefault();
            setDragging(false);
            loadFile(event.dataTransfer.files[0]);
          }}
          className={`group flex min-h-44 flex-col items-center justify-center rounded-2xl border border-dashed px-5 text-center transition ${
            dragging ? "border-mint-400 bg-mint-400/10" : "border-white/15 bg-white/[.025] hover:border-mint-400/45 hover:bg-mint-400/[.035]"
          }`}
        >
          <span className="mb-3 grid h-12 w-12 place-items-center rounded-2xl border border-white/10 bg-white/[.04] text-mint-400 transition group-hover:-translate-y-0.5">
            <UploadCloud size={23} />
          </span>
          <span className="text-sm font-semibold text-slate-200">Drop your .html file here</span>
          <span className="mt-1 max-w-52 truncate text-xs text-slate-500">{fileName || "or click to browse your computer"}</span>
          <input
            ref={inputRef}
            className="hidden"
            type="file"
            accept=".html,.htm,text/html"
            onChange={(event) => loadFile(event.target.files?.[0])}
          />
        </button>

        <label className="block">
          <span className="mb-2 flex items-center gap-2 text-xs font-medium text-slate-400">
            <FileCode2 size={14} /> Or paste raw HTML
          </span>
          <textarea
            value={rawHtml}
            onChange={(event) => setRawHtml(event.target.value)}
            className="field min-h-36 resize-y font-mono text-xs leading-5 lg:min-h-44"
            placeholder={'<div class="ums-grid-offered-section">…</div>'}
            spellCheck="false"
          />
        </label>
      </div>

      <button type="button" className="primary-button mt-4 w-full sm:w-auto" onClick={onParse} disabled={parsing}>
        {parsing ? <LoaderCircle className="animate-spin" size={17} /> : <FileCode2 size={17} />}
        {parsing ? "Parsing sections…" : "Parse & save data"}
      </button>
    </section>
  );
}
