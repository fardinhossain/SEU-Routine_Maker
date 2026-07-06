import { normalizePdfText } from "./pdfImport.js";
import { extractEnglishTextWithPaddleApi } from "./paddleOcrApi.js";

const MAX_IMAGE_SIZE = 12 * 1024 * 1024;
const OCR_MAX_DIMENSION = 1800;
const OCR_MIN_DIMENSION = 1200;

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

function loadImage(file) {
  return new Promise((resolve, reject) => {
    const image = new Image();
    const objectUrl = URL.createObjectURL(file);
    image.onload = () => {
      URL.revokeObjectURL(objectUrl);
      resolve(image);
    };
    image.onerror = () => {
      URL.revokeObjectURL(objectUrl);
      reject(new Error("This image format cannot be opened. Use a PNG, JPG, WebP, BMP, or TIFF screenshot."));
    };
    image.src = objectUrl;
  });
}

async function prepareImage(file) {
  const image = await loadImage(file);
  const longest = Math.max(image.naturalWidth, image.naturalHeight);
  if (!longest) throw new Error("This image has no readable pixels.");

  const scale = longest > OCR_MAX_DIMENSION
    ? OCR_MAX_DIMENSION / longest
    : longest < OCR_MIN_DIMENSION
      ? Math.min(2.5, OCR_MIN_DIMENSION / longest)
      : 1;
  const width = Math.max(1, Math.round(image.naturalWidth * scale));
  const height = Math.max(1, Math.round(image.naturalHeight * scale));
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const context = canvas.getContext("2d", { alpha: false });
  if (!context) throw new Error("Your browser could not prepare this image for OCR.");
  context.imageSmoothingEnabled = true;
  context.imageSmoothingQuality = "high";
  context.fillStyle = "#fff";
  context.fillRect(0, 0, width, height);
  context.drawImage(image, 0, 0, width, height);

  const samplePoints = [
    [2, 2], [width - 3, 2], [2, height - 3], [width - 3, height - 3],
    [Math.floor(width / 2), 2], [Math.floor(width / 2), height - 3],
  ];
  const averageLuminance = samplePoints.reduce((sum, [x, y]) => {
    const pixel = context.getImageData(Math.max(0, x), Math.max(0, y), 1, 1).data;
    return sum + 0.299 * pixel[0] + 0.587 * pixel[1] + 0.114 * pixel[2];
  }, 0) / samplePoints.length;

  if (averageLuminance < 110) {
    const imageData = context.getImageData(0, 0, width, height);
    const pixels = imageData.data;
    for (let index = 0; index < pixels.length; index += 4) {
      const gray = 0.299 * pixels[index] + 0.587 * pixels[index + 1] + 0.114 * pixels[index + 2];
      const inverted = 255 - gray;
      const value = inverted > 128 ? Math.min(255, inverted + 45) : Math.max(0, inverted - 45);
      pixels[index] = value;
      pixels[index + 1] = value;
      pixels[index + 2] = value;
    }
    context.putImageData(imageData, 0, 0);
  }

  return canvas;
}

function canvasToPngFile(canvas, originalFile) {
  return new Promise((resolve, reject) => {
    canvas.toBlob((blob) => {
      if (!blob) {
        reject(new Error("Your browser could not prepare this image for OCR."));
        return;
      }

      const baseName = String(originalFile?.name || "ums-screenshot")
        .replace(/\.[a-z0-9]+$/i, "")
        .trim() || "ums-screenshot";
      resolve(new File([blob], `${baseName}.png`, { type: "image/png" }));
    }, "image/png");
  });
}

export async function extractUmsTextFromImage(file, onProgress) {
  if (!file) throw new Error("Choose an image first.");
  if (file.size > MAX_IMAGE_SIZE) {
    throw new Error("The image is too large. Choose an image smaller than 12 MB.");
  }

  onProgress?.({ progress: 2, status: "Preparing image" });
  const canvas = await prepareImage(file);

  try {
    onProgress?.({ progress: 8, status: "Sending image to PaddleOCR" });
    const preparedFile = await canvasToPngFile(canvas, file);
    const text = normalizePdfText(await extractEnglishTextWithPaddleApi(preparedFile, {
      onProgress: ({ progress, status }) => onProgress?.({
        progress: Math.max(10, Math.min(99, progress)),
        status,
      }),
    }));
    if (!text.trim()) {
      throw new Error("No readable text was found. Try a clearer or more tightly cropped screenshot.");
    }
    onProgress?.({ progress: 100, status: "Image ready" });
    return text;
  } catch (error) {
    if (/timed out|no readable|cannot be opened|too large/i.test(error?.message || "")) throw error;
    throw new Error(error?.message || "The image could not be read. Try a clear PNG, JPG, or WebP screenshot of the UMS course schedule.");
  } finally {
    canvas.width = 1;
    canvas.height = 1;
  }
}
