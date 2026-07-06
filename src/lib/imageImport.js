import { normalizePdfText, chooseBestPdfText } from "./pdfImport.js";
import { prepareCanvasForOcr } from "./ocrPreprocess.js";

const MAX_IMAGE_SIZE = 12 * 1024 * 1024;
const OCR_SETUP_TIMEOUT_MS = 60000;
const OCR_RECOGNIZE_TIMEOUT_MS = 120000;
const OCR_ASSET_PATH = "/tesseract";

function startsWith(bytes, signature) {
  return signature.every((byte, index) => bytes[index] === byte);
}

export function hasImageSignature(bytes = []) {
  const ascii = String.fromCharCode(...Array.from(bytes).slice(0, 12));
  return startsWith(bytes, [0x89, 0x50, 0x4e, 0x47]) // PNG
    || startsWith(bytes, [0xff, 0xd8, 0xff]) // JPEG
    || ascii.startsWith("GIF87a")
    || ascii.startsWith("GIF89a")
    || (ascii.startsWith("RIFF") && ascii.slice(8, 12) === "WEBP")
    || startsWith(bytes, [0x42, 0x4d]) // BMP
    || startsWith(bytes, [0x49, 0x49, 0x2a, 0x00]) // little-endian TIFF
    || startsWith(bytes, [0x4d, 0x4d, 0x00, 0x2a]); // big-endian TIFF
}

export async function isImageFile(file) {
  if (!file) return false;
  if (String(file.type || "").toLowerCase().startsWith("image/")) return true;
  const header = new Uint8Array(await file.slice(0, 12).arrayBuffer());
  return hasImageSignature(header);
}

function withTimeout(promise, timeoutMs, message) {
  let timer;
  const timeout = new Promise((_, reject) => {
    timer = setTimeout(() => reject(new Error(message)), timeoutMs);
  });
  return Promise.race([promise, timeout]).finally(() => clearTimeout(timer));
}

function ocrProgress(message) {
  const status = String(message.status || "").toLowerCase();
  const progress = typeof message.progress === "number" ? message.progress : 0;
  if (status.includes("recognizing")) return 45 + progress * 50;
  if (status.includes("loading language")) return 20 + progress * 20;
  if (status.includes("initializing")) return 10 + progress * 25;
  return 5 + progress * 40;
}

function ocrStatus(message) {
  const status = String(message.status || "").toLowerCase();
  if (status.includes("recognizing")) return "Reading image text";
  if (status.includes("loading language")) return "Loading OCR language";
  if (status.includes("initializing")) return "Starting OCR engine";
  return "Preparing image scanner";
}

// prepareImage kept for backward compatibility in case other code imports it, but now delegates to strong shared version.
async function prepareImage(file) {
  return prepareCanvasForOcr(file);
}

export async function extractUmsTextFromImage(file, onProgress) {
  if (!file) throw new Error("Choose an image first.");
  if (file.size > MAX_IMAGE_SIZE) {
    throw new Error("The image is too large. Choose an image smaller than 12 MB.");
  }

  onProgress?.({ progress: 2, status: "Preparing image" });
  const canvas = await prepareCanvasForOcr(file);
  let worker;

  try {
    const { createWorker, PSM } = await import("tesseract.js");
    worker = await withTimeout(createWorker("eng", 1, {
      workerPath: `${OCR_ASSET_PATH}/worker.min.js`,
      corePath: OCR_ASSET_PATH,
      langPath: `${OCR_ASSET_PATH}/lang`,
      logger: (message) => onProgress?.({
        progress: Math.round(ocrProgress(message)),
        status: ocrStatus(message),
      }),
    }), OCR_SETUP_TIMEOUT_MS, "Image OCR setup timed out. Please try again.");

    // Run two passes with different segmentation modes + choose best result.
    // SPARSE_TEXT good for scattered screenshot blocks; SINGLE_COLUMN good for list-style.
    const candidates = [];
    const baseParams = {
      tessedit_ocr_engine_mode: "3",
      preserve_interword_spaces: "1",
      user_defined_dpi: "300",
      tessedit_char_whitelist: "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789 .,:;#-_[]()|/\\~@&",
    };

    await worker.setParameters({ ...baseParams, tessedit_pageseg_mode: PSM.SPARSE_TEXT });
    const r1 = await withTimeout(
      worker.recognize(canvas),
      OCR_RECOGNIZE_TIMEOUT_MS,
      "Image OCR timed out. Try a clearer or more tightly cropped screenshot.",
    );
    candidates.push(r1.data.text);

    await worker.setParameters({ ...baseParams, tessedit_pageseg_mode: PSM.SINGLE_COLUMN });
    const r2 = await withTimeout(
      worker.recognize(canvas),
      OCR_RECOGNIZE_TIMEOUT_MS,
      "Image OCR timed out. Try a clearer or more tightly cropped screenshot.",
    );
    candidates.push(r2.data.text);

    const rawText = chooseBestPdfText(candidates) || candidates[0] || "";
    const text = normalizePdfText(rawText);
    if (!text.trim()) {
      throw new Error("No readable text was found. Try a clearer or more tightly cropped screenshot.");
    }
    onProgress?.({ progress: 100, status: "Image ready" });
    return text;
  } catch (error) {
    if (/timed out|no readable|cannot be opened|too large/i.test(error?.message || "")) throw error;
    throw new Error("The image could not be read. Try a clear PNG, JPG, or WebP screenshot of the UMS course schedule.");
  } finally {
    canvas.width = 1;
    canvas.height = 1;
    if (worker) await worker.terminate().catch(() => {});
  }
}
