'use client';

import { useEffect, useRef, useState } from "react";
import { CheckCircle2, FileCode2, LoaderCircle, Trash2, UploadCloud, WandSparkles } from "lucide-react";
import { extractUmsTextFromImage, isImageFile } from "../lib/imageImport";
import { extractUmsTextFromPdf, isPdfFile } from "../lib/pdfImport";

function readFileAsText(file) {
  if (typeof file.text === "function") return file.text();

  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result || ""));
    reader.onerror = () => reject(new Error("This file could not be read."));
    reader.readAsText(file);
  });
}

export default function ImportPanel({
  rawHtml,
  setRawHtml,
  onParse,
  onClearHtml,
  courseCount,
  parsing,
  successMessage,
  onImportError,
}) {
  const inputRef = useRef(null);
  const [fileName, setFileName] = useState("");
  const [dragging, setDragging] = useState(false);
  const [readingFile, setReadingFile] = useState(false);
  const [fileProgress, setFileProgress] = useState(0);
  const [fileStatus, setFileStatus] = useState("");

  // Clear displayed filename (and file input) whenever imported data is cleared by parent.
  useEffect(() => {
    if (!rawHtml) {
      setFileName("");
      if (inputRef.current) inputRef.current.value = "";
    }
  }, [rawHtml]);

  async function loadFile(file) {
    if (!file) return;
    setReadingFile(true);
    setFileProgress(1);
    setFileStatus("Reading file");
    setFileName(file.name || "Saved UMS page");

    try {
      const pdf = await isPdfFile(file);
      const image = !pdf && await isImageFile(file);
      const updateProgress = ({ progress, status }) => {
            setFileProgress(progress);
            setFileStatus(status);
          };
      const content = pdf
        ? await extractUmsTextFromPdf(file, updateProgress)
        : image
          ? await extractUmsTextFromImage(file, updateProgress)
          : await readFileAsText(file);

      if (!content.trim()) throw new Error("This file is empty.");
      setRawHtml(content);
      onParse(content, { format: pdf ? "pdf-text" : image ? "image-text" : "web-page" });
    } catch (error) {
      const message = error?.message || "This file could not be read.";
      setFileName(message);
      onImportError?.(message);
    } finally {
      setReadingFile(false);
      setFileProgress(0);
      setFileStatus("");
      if (inputRef.current) inputRef.current.value = "";
    }
  }

  function clearHtmlInput() {
    setFileName("");
    if (inputRef.current) inputRef.current.value = "";
    onClearHtml();
  }

  return (
    <section className="panel min-w-0 h-full p-4 sm:p-6" aria-labelledby="import-heading">
      <div className="mb-5 flex flex-col items-start justify-between gap-4 sm:flex-row">
        <div>
          <div className="mb-2 flex items-center gap-2 text-xs font-semibold uppercase tracking-[.18em] text-mint-400">
            <span className="step-number">1</span>
            Import data
          </div>
          <h2 id="import-heading" className="text-lg font-semibold text-white sm:text-xl">Add your UMS export</h2>
          <p className="mt-1 text-sm text-slate-400">Upload the saved page or paste its raw HTML.</p>
        </div>
        <div className="flex w-full shrink-0 flex-wrap justify-start gap-2 sm:w-auto sm:justify-end">
          {courseCount > 0 && successMessage && (
            <span className="flex items-center gap-1.5 rounded-full bg-mint-400/10 px-2.5 py-1 text-xs font-medium text-mint-300">
              <CheckCircle2 size={13} /> {courseCount} parsed
            </span>
          )}
        </div>
      </div>

      <div className="grid min-w-0 gap-3 sm:gap-4 lg:grid-cols-[.8fr_1.2fr]">
        <button
          type="button"
          disabled={parsing || readingFile}
          onClick={() => inputRef.current?.click()}
          onDragOver={(event) => { event.preventDefault(); setDragging(true); }}
          onDragLeave={() => setDragging(false)}
          onDrop={(event) => {
            event.preventDefault();
            setDragging(false);
            loadFile(event.dataTransfer.files[0]);
          }}
          className={`group flex min-h-36 min-w-0 w-full flex-col items-center justify-center rounded-xl border border-dashed px-4 text-center transition sm:min-h-44 sm:rounded-2xl sm:px-5 ${
            dragging ? "border-mint-400 bg-mint-400/10" : "border-white/15 bg-white/[.025] hover:border-mint-400/45 hover:bg-mint-400/[.035]"
          }`}
        >
          <span className="mb-3 grid h-12 w-12 place-items-center rounded-2xl border border-white/10 bg-white/[.04] text-mint-400 transition group-hover:-translate-y-0.5">
            <UploadCloud size={23} />
          </span>
          <span className="text-sm font-semibold text-slate-200">Drop your UMS page, PDF, or screenshot here</span>
          <span className="mt-1 max-w-60 truncate text-xs text-slate-500">{fileStatus || fileName || "HTML, MHTML, PDF, PNG, JPG, WebP, or an extensionless Android download"}</span>
          {!fileName && !readingFile && (
            <>
              <span className="mt-1.5 text-[10px] text-slate-600">iPhone: Share → Markup → Done → Save to Files</span>
              <span className="mt-1 text-[10px] text-amber-200/60">Screenshot OCR is processed by PaddleOCR AI Studio.</span>
            </>
          )}
          {readingFile && (
            <span className="mt-3 h-1.5 w-40 overflow-hidden rounded-full bg-white/10" aria-hidden="true">
              <span className="block h-full rounded-full bg-mint-400 transition-[width]" style={{ width: `${Math.max(5, fileProgress)}%` }} />
            </span>
          )}
          <input
            ref={inputRef}
            className="hidden"
            type="file"
            onChange={(event) => loadFile(event.target.files?.[0])}
          />
        </button>

        <label className="block min-w-0 max-w-full">
          <span className="mb-2 flex items-center gap-2 text-xs font-medium text-slate-400">
            <FileCode2 size={14} /> Or paste raw HTML
          </span>
          <textarea
            value={rawHtml}
            onChange={(event) => setRawHtml(event.target.value)}
            onBlur={() => {
              if (rawHtml.trim()) onParse(rawHtml);
            }}
            className="field min-h-28 min-w-0 max-w-full resize-y font-mono text-xs leading-5 sm:min-h-36 lg:min-h-44"
            placeholder={'<div class="ums-grid-offered-section">…</div>'}
            spellCheck="false"
          />
        </label>
      </div>

      {!parsing && !readingFile && (successMessage || rawHtml) && (
        <div className="mt-4 flex flex-col gap-2.5 sm:flex-row sm:items-stretch">
          {successMessage && (
            <div className="flex flex-1 items-start gap-2.5 rounded-xl border border-mint-400/20 bg-mint-400/[.07] px-3.5 py-3 text-sm text-mint-300" role="status">
              <CheckCircle2 className="mt-0.5 shrink-0" size={17} />
              <span>{successMessage}</span>
            </div>
          )}
          {rawHtml && (
            <button
              type="button"
              onClick={clearHtmlInput}
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-rose-400/15 bg-rose-400/[.045] px-4 py-3 text-sm font-medium text-rose-300/80 transition hover:border-rose-400/30 hover:bg-rose-400/[.09] hover:text-rose-200"
              title="Clear imported data, parsed sections, and routine data"
            >
              <Trash2 size={15} /> Clear import
            </button>
          )}
          {successMessage && (
            <a
              href="/organizer"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-violet-400/25 bg-violet-400/[.09] px-4 py-3 text-sm font-semibold text-violet-200 transition hover:border-violet-300/45 hover:bg-violet-400/[.14]"
            >
              <WandSparkles size={16} /> Open Magic Organizer
            </a>
          )}
        </div>
      )}

      {(parsing || readingFile) && (
        <div className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-xl border border-mint-400/15 bg-mint-400/[.06] px-3.5 py-2.5 text-xs font-medium text-mint-300 sm:w-auto">
          <LoaderCircle className="animate-spin" size={15} />
          {readingFile ? fileStatus || "Reading file…" : "Parsing and saving sections…"}
        </div>
      )}
    </section>
  );
}
