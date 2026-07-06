const PDF_SIGNATURE = [0x25, 0x50, 0x44, 0x46, 0x2d]; // %PDF-
const MAX_PDF_SIZE = 20 * 1024 * 1024;
const MAX_PDF_PAGES = 30;
const OCR_MAX_PAGES = 12;
const OCR_ASSET_PATH = "/tesseract";
const PDF_PRIVATE_GLYPH_MAP = Object.freeze({
  "\uE002": "G",
  "\uE02C": "a",
  "\uE050": "l",
  "\uE05F": "r",
  "\uE06C": "1",
  "\uE06D": "3",
  "\uE06E": "4",
  "\uE06F": "6",
});
const OCR_DIGIT_MAP = Object.freeze({
  A: "4",
  D: "0",
  I: "1",
  L: "1",
  O: "0",
  Q: "0",
  Z: "2",
  S: "5",
  T: "7",
  G: "6",
  B: "8",
});

function repairOcrDigits(value = "") {
  return String(value).toUpperCase().replace(/[ADILOQZSGTB]/g, (character) => OCR_DIGIT_MAP[character]);
}

function friendlyPdfError(error) {
  const details = `${error?.name || ""} ${error?.message || error || ""}`;

  if (/password|encrypted/i.test(details)) {
    return new Error("This PDF is password-protected. Save or print an unlocked copy, then import it again.");
  }
  if (/invalid pdf|missing pdf|unexpected response|formaterror|corrupt/i.test(details)) {
    return new Error("This PDF is damaged or is not a real PDF file. Download it again from UMS and retry.");
  }
  return error instanceof Error ? error : new Error("The PDF could not be opened.");
}

export function hasPdfSignature(bytes = []) {
  return PDF_SIGNATURE.every((byte, index) => bytes[index] === byte);
}

export async function isPdfFile(file) {
  if (!file) return false;
  const header = new Uint8Array(await file.slice(0, PDF_SIGNATURE.length).arrayBuffer());
  return hasPdfSignature(header);
}

export function normalizePdfText(value = "") {
  return String(value)
    .replace(/[\uE000-\uF8FF]/g, (character) => PDF_PRIVATE_GLYPH_MAP[character] || character)
    .replace(/[\u00a0\u200B-\u200D\uFEFF]/g, " ")
    .replace(/[–—−]/g, "~")
    .replace(/©/g, "@")
    .replace(/\bR[ \t]*E[ \t]*G[ \t]*I[ \t]*S[ \t]*T[ \t]*E[ \t]*R[ \t]*E[ \t]*D[ \t]+C[ \t]*O[ \t]*U[ \t]*R[ \t]*S[ \t]*E[ \t]*S\b/gi, "Registered Courses")
    .replace(/\bO[ \t]*F[ \t]*F[ \t]*E[ \t]*R[ \t]*E[ \t]*D[ \t]+S[ \t]*E[ \t]*C[ \t]*T[ \t]*I[ \t]*O[ \t]*N[ \t]*S?\b/gi, "Offered Sections")
    .replace(/\b([A-Z]{2,6})([0-9][0-9ADILOQZSGTB]{2,3})(?:[ \t]*[.,:][ \t]*|[ \t]+)([0-9ADILOQZSGTB]{1,2})\b/gi, (_, prefix, courseNumber, section) =>
      `${prefix.toUpperCase()}${repairOcrDigits(courseNumber)}.${repairOcrDigits(section)}`,
    )
    .replace(/[–—−]/g, "~")
    .replace(
      /\b([A-Z](?:[ \t]*[A-Z]){1,5})[ \t]*(\d(?:[ \t]*\d){2,3})[ \t]*\.[ \t]*(\d(?:[ \t]*\d){0,2})\b/g,
      (_, prefix, courseNumber, section) =>
        `${prefix.replace(/\s/g, "")}${courseNumber.replace(/\s/g, "")}.${section.replace(/\s/g, "")}`,
    )
    .replace(/\b(S[ \t]*A[ \t]*T|S[ \t]*U[ \t]*N|M[ \t]*O[ \t]*N|T[ \t]*U[ \t]*E|W[ \t]*E[ \t]*D|T[ \t]*H[ \t]*U|F[ \t]*R[ \t]*I)\b/gi, (day) =>
      day.replace(/\s/g, "").toUpperCase(),
    )
    .replace(/\b(?:M[O0]N|TU[E3]|W[E3]D|TH[U0]|FR[I1L]|S[A4]T|S[U0]N)\b/gi, (day) =>
      day.toUpperCase().replace("0", "O").replace("3", "E").replace("1", "I").replace("L", "I").replace("4", "A"),
    )
    .replace(/\bS[ \t]*E[ \t]*U[ \t]*([0-9ILOQZSGB](?:[ \t]*[0-9ILOQZSGB]){2})[ \t]*([A-Z]?)\b/gi, (_, roomNumber, suffix) =>
      `SEU${repairOcrDigits(roomNumber.replace(/\s/g, ""))}${suffix.toUpperCase()}`,
    )
    .replace(/\bS[ \t]*E[ \t]*U[ \t]*(\d(?:[ \t]*\d){2,3})[ \t]*([A-Z]?)\b/gi, (_, roomNumber, suffix) =>
      `SEU${roomNumber.replace(/\s/g, "")}${suffix.toUpperCase()}`,
    )
    .replace(/\b(\d(?:[ \t]*\d)?)[ \t]*:[ \t]*(\d[ \t]*\d)\b/g, (_, hours, minutes) =>
      `${hours.replace(/\s/g, "")}:${minutes.replace(/\s/g, "")}`,
    )
    .replace(/\[[ \t]*([A-Z]{1,3}(?:[ \t]*[A-Z]{1,3}){0,5})[ \t]*\]/g, (_, faculty) => `[${faculty.replace(/\s/g, "")}]`)
    .replace(/\b([A-Z]{2,6})[ \t]+(\d{2,4})[ \t]*[.,:][ \t]*(\d{1,3})\b/g, "$1$2.$3")
    .replace(/\b([A-Z]{2,6})[ \t]*(\d{3})(\d{1,2})\b/g, "$1$2.$3")
    .replace(/\b(\d{1,2})[ \t]*[:.;][ \t]*(\d{2})\b/g, "$1:$2")
    .replace(/(\b\d{1,2}:\d{2})[ \t]*-[ \t]*(\d{1,2}:\d{2}\b)/g, "$1 ~ $2")
    .split(/\r?\n/)
    .map((line) => line.replace(/[ \t]+/g, " ").trim())
    .filter(Boolean)
    .join("\n");
}

export function pdfTextItemsToText(items = []) {
  const positioned = items
    .filter((item) => typeof item?.str === "string" && item.str.trim())
    .map((item) => ({
      text: item.str.trim(),
      x: Number(item.transform?.[4]) || 0,
      y: Number(item.transform?.[5]) || 0,
      height: Math.abs(Number(item.height)) || 10,
    }))
    .sort((left, right) => right.y - left.y || left.x - right.x);

  const rows = [];
  positioned.forEach((item) => {
    const tolerance = Math.max(2, item.height * 0.45);
    const row = rows.find((candidate) => Math.abs(candidate.y - item.y) <= tolerance);
    if (row) {
      row.items.push(item);
      row.y = (row.y * (row.items.length - 1) + item.y) / row.items.length;
    } else {
      rows.push({ y: item.y, items: [item] });
    }
  });

  return normalizePdfText(
    rows
      .sort((left, right) => right.y - left.y)
      .map((row) => row.items.sort((left, right) => left.x - right.x).map((item) => item.text).join(" "))
      .join("\n"),
  );
}

export function pdfTextItemsInContentOrder(items = []) {
  const lines = [];
  let currentLine = [];
  let previous = null;

  function flushLine() {
    if (currentLine.length) lines.push(currentLine.join(" "));
    currentLine = [];
  }

  items.forEach((item) => {
    const text = typeof item?.str === "string" ? item.str.trim() : "";
    if (!text) return;

    const current = {
      y: Number(item.transform?.[5]) || 0,
      height: Math.abs(Number(item.height)) || 10,
    };
    const changedLine = previous
      && Math.abs(previous.y - current.y) > Math.max(2, Math.min(previous.height, current.height) * 0.45);

    if (changedLine) flushLine();
    currentLine.push(text);
    if (item.hasEOL) flushLine();
    previous = current;
  });
  flushLine();

  return normalizePdfText(lines.join("\n"));
}

function pdfTextStats(text = "") {
  const normalized = normalizePdfText(text).toUpperCase();
  const courseCodes = new Set(
    [...normalized.matchAll(/\b[A-Z]{2,6}\d{2,4}\.\d{1,3}\b/g)].map((match) => match[0]),
  );
  const meetings = [...normalized.matchAll(
    /\b(?:SAT|SUN|MON|TUE|WED|THU|FRI)\s*#\s*\d{1,2}:\d{2}\s*~\s*\d{1,2}:\d{2}\s*@\s*[A-Z0-9-]+\b/g,
  )].length;

  return {
    courseCount: courseCodes.size,
    meetingCount: meetings,
    score: courseCodes.size * 100 + meetings * 10,
  };
}

export function chooseBestPdfText(candidates = []) {
  return candidates
    .map((text, index) => ({ text: normalizePdfText(text), index, ...pdfTextStats(text) }))
    .filter((candidate) => candidate.text)
    .sort((left, right) =>
      right.score - left.score
        || right.courseCount - left.courseCount
        || right.meetingCount - left.meetingCount
        || left.index - right.index,
    )[0]?.text || "";
}

function pdfCourseBlocks(text = "", candidateIndex = 0) {
  const normalized = normalizePdfText(text);
  const matches = [...normalized.matchAll(/\b[A-Z]{2,6}\d{2,4}\.\d{1,3}\b/gi)];

  return matches.map((match, blockIndex) => {
    const nextMatch = matches[blockIndex + 1];
    const block = normalizePdfText(normalized.slice(match.index, nextMatch?.index ?? normalized.length));
    const meetingCount = pdfTextStats(block).meetingCount;
    const extraMeetingPenalty = Math.max(0, meetingCount - 2) * 25;
    const score = (meetingCount ? 100 : 0)
      + Math.min(meetingCount, 2) * 10
      - extraMeetingPenalty
      + (/\[[A-Z]{2,6}\]/i.test(block) ? 5 : 0)
      + (candidateIndex === 0 ? 2 : 0);

    return {
      code: match[0].toUpperCase(),
      text: block,
      meetingCount,
      score,
      candidateIndex,
      blockIndex,
    };
  });
}

export function mergePdfTextCandidates(candidates = []) {
  const normalizedCandidates = candidates.map(normalizePdfText).filter(Boolean);
  const blocksByCode = new Map();

  normalizedCandidates.forEach((candidate, candidateIndex) => {
    pdfCourseBlocks(candidate, candidateIndex).forEach((block) => {
      if (!block.meetingCount) return;
      const current = blocksByCode.get(block.code);
      if (!current || block.score > current.score) blocksByCode.set(block.code, block);
    });
  });

  const orderedBlocks = [...blocksByCode.values()].sort((left, right) =>
    left.candidateIndex - right.candidateIndex || left.blockIndex - right.blockIndex,
  );
  if (!orderedBlocks.length) return chooseBestPdfText(normalizedCandidates);

  const hasRegisteredCourses = normalizedCandidates.some((text) => /\bREGISTERED COURSES\b/i.test(text));
  const hasOfferedSections = normalizedCandidates.some((text) => /\b(?:OFFERED SECTIONS?|ADVISING TABLE|PREREGISTERED)\b/i.test(text));
  const heading = hasRegisteredCourses
    ? "Registered Courses"
    : hasOfferedSections
      ? "Offered Sections"
      : "";

  return normalizePdfText([heading, ...orderedBlocks.map((block) => block.text)].filter(Boolean).join("\n"));
}

function containsUmsTimetable(text = "") {
  return /\b[A-Z]{2,6}\d{2,4}\.\d{1,3}\b/i.test(text)
    && /\b(?:SAT|SUN|MON|TUE|WED|THU|FRI)\b[^\n]{0,40}\d{1,2}:\d{2}/i.test(text);
}

async function loadPdfDocument(data) {
  const pdfjs = await import("pdfjs-dist/legacy/build/pdf.mjs");
  pdfjs.GlobalWorkerOptions.workerSrc = new URL(
    "pdfjs-dist/legacy/build/pdf.worker.min.mjs",
    import.meta.url,
  ).toString();
  return pdfjs.getDocument({ data }).promise;
}

async function extractTextLayer(pdf, onProgress) {
  const contentOrderPages = [];
  const visualOrderPages = [];
  for (let pageNumber = 1; pageNumber <= pdf.numPages; pageNumber += 1) {
    const page = await pdf.getPage(pageNumber);
    const content = await page.getTextContent();
    contentOrderPages.push(pdfTextItemsInContentOrder(content.items));
    visualOrderPages.push(pdfTextItemsToText(content.items));
    onProgress?.({
      progress: Math.round((pageNumber / pdf.numPages) * 65),
      status: `Reading PDF page ${pageNumber} of ${pdf.numPages}`,
    });
    page.cleanup();
  }
  return mergePdfTextCandidates([
    contentOrderPages.join("\n"),
    visualOrderPages.join("\n"),
  ]);
}

async function extractWithOcr(pdf, onProgress) {
  if (pdf.numPages > OCR_MAX_PAGES) {
    throw new Error(`This scanned PDF has too many pages for mobile OCR. Use a PDF with ${OCR_MAX_PAGES} pages or fewer.`);
  }

  const { createWorker, PSM } = await import("tesseract.js");
  const worker = await createWorker("eng", 1, {
    workerPath: `${OCR_ASSET_PATH}/worker.min.js`,
    corePath: OCR_ASSET_PATH,
    langPath: `${OCR_ASSET_PATH}/lang`,
    logger: (message) => {
      if (typeof message.progress !== "number") return;
      onProgress?.({ progress: 65 + Math.round(message.progress * 30), status: "Reading scanned PDF" });
    },
  });

  try {
    await worker.setParameters({
      tessedit_pageseg_mode: PSM.SPARSE_TEXT,
      preserve_interword_spaces: "1",
      tessedit_char_whitelist: "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789 .,:;#-_[]|/\\~@&",
    });
    const pages = [];

    for (let pageNumber = 1; pageNumber <= pdf.numPages; pageNumber += 1) {
      const page = await pdf.getPage(pageNumber);
      const baseViewport = page.getViewport({ scale: 1 });
      const scale = Math.min(2, 1800 / Math.max(baseViewport.width, baseViewport.height));
      const viewport = page.getViewport({ scale });
      const canvas = document.createElement("canvas");
      canvas.width = Math.max(1, Math.ceil(viewport.width));
      canvas.height = Math.max(1, Math.ceil(viewport.height));
      const context = canvas.getContext("2d", { alpha: false });
      await page.render({ canvasContext: context, viewport }).promise;
      const result = await worker.recognize(canvas);
      pages.push(result.data.text);
      canvas.width = 1;
      canvas.height = 1;
      page.cleanup();
      onProgress?.({
        progress: 65 + Math.round((pageNumber / pdf.numPages) * 34),
        status: `Scanning PDF page ${pageNumber} of ${pdf.numPages}`,
      });
    }

    return normalizePdfText(pages.join("\n"));
  } finally {
    await worker.terminate();
  }
}

export async function extractUmsTextFromPdf(file, onProgress) {
  if (file.size > MAX_PDF_SIZE) {
    throw new Error("The PDF is too large. Choose a UMS PDF smaller than 20 MB.");
  }
  onProgress?.({ progress: 2, status: "Opening PDF" });
  const data = new Uint8Array(await file.arrayBuffer());
  let pdf;
  try {
    pdf = await loadPdfDocument(data);
  } catch (error) {
    throw friendlyPdfError(error);
  }

  try {
    if (pdf.numPages > MAX_PDF_PAGES) {
      throw new Error(`The PDF is too long. Choose a UMS export with ${MAX_PDF_PAGES} pages or fewer.`);
    }

    let text = await extractTextLayer(pdf, onProgress);
    if (containsUmsTimetable(text)) {
      if (pdf.numPages <= 3 && /\bREGISTERED COURSES\b/i.test(text)) {
        try {
          onProgress?.({ progress: 66, status: "Verifying visible PDF courses" });
          const ocrText = await extractWithOcr(pdf, onProgress);
          text = mergePdfTextCandidates([text, ocrText]);
        } catch {
          // A valid PDF text layer remains usable if optional OCR verification fails.
        }
      }
      onProgress?.({ progress: 100, status: "PDF ready" });
      return text;
    }

    onProgress?.({ progress: 66, status: "No usable text layer; starting OCR" });
    const ocrText = await extractWithOcr(pdf, onProgress);
    if (!containsUmsTimetable(ocrText)) {
      const hasCourseCodes = /\b[A-Z]{2,6}\d{2,4}\.\d{1,3}\b/i.test(ocrText);
      throw new Error(hasCourseCodes
        ? "Course codes were found, but none had a readable schedule. Courses without a specific schedule are skipped."
        : "No readable UMS course schedules were found in this PDF.");
    }
    onProgress?.({ progress: 100, status: "PDF ready" });
    return ocrText;
  } finally {
    await pdf.destroy();
  }
}
