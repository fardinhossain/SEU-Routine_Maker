/**
 * Shared, high-quality preprocessing for Tesseract OCR on UMS timetable screenshots/PDF pages.
 * Goals: clean black text on white, crisp edges, good scale, handle dark mode screenshots,
 * reduce noise and improve character separation for digits/letters common in course codes.
 */

const OCR_MAX_DIMENSION = 2200; // slightly higher for better accuracy on dense tables
const OCR_MIN_DIMENSION = 1400;
const OCR_MOBILE_MAX_DIMENSION = 1800;
const OCR_MOBILE_MIN_DIMENSION = 1200;

function getTargetScale(width, height) {
  const longest = Math.max(width, height);
  if (!longest) return 1;

  // Mobile detection (coarse pointer or small viewport)
  const isMobileLike =
    (typeof window !== "undefined" &&
      (window.matchMedia?.("(pointer: coarse)").matches ||
        window.innerWidth < 768 ||
        (navigator && navigator.maxTouchPoints > 1))) ||
    false;

  const maxDim = isMobileLike ? OCR_MOBILE_MAX_DIMENSION : OCR_MAX_DIMENSION;
  const minDim = isMobileLike ? OCR_MOBILE_MIN_DIMENSION : OCR_MIN_DIMENSION;

  if (longest > maxDim) return maxDim / longest;
  if (longest < minDim) return Math.min(2.8, minDim / longest);
  return 1;
}

function loadImageFromFile(file) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const url = URL.createObjectURL(file);
    img.onload = () => {
      URL.revokeObjectURL(url);
      resolve(img);
    };
    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error("Failed to load image for OCR preprocessing."));
    };
    img.src = url;
  });
}

/**
 * Apply a simple 3x3 sharpen kernel (unsharp style).
 */
function applySharpen(imageData) {
  const data = imageData.data;
  const width = imageData.width;
  const height = imageData.height;
  const copy = new Uint8ClampedArray(data);
  const kernel = [0, -1, 0, -1, 5, -1, 0, -1, 0];

  for (let y = 1; y < height - 1; y += 1) {
    for (let x = 1; x < width - 1; x += 1) {
      let r = 0, g = 0, b = 0;
      for (let ky = -1; ky <= 1; ky += 1) {
        for (let kx = -1; kx <= 1; kx += 1) {
          const idx = ((y + ky) * width + (x + kx)) * 4;
          const k = kernel[(ky + 1) * 3 + (kx + 1)];
          r += copy[idx] * k;
          g += copy[idx + 1] * k;
          b += copy[idx + 2] * k;
        }
      }
      const idx = (y * width + x) * 4;
      data[idx] = Math.max(0, Math.min(255, r));
      data[idx + 1] = Math.max(0, Math.min(255, g));
      data[idx + 2] = Math.max(0, Math.min(255, b));
    }
  }
}

/**
 * Stretch contrast and convert to strong grayscale.
 */
function stretchAndGrayscale(imageData) {
  const data = imageData.data;
  let min = 255;
  let max = 0;

  // Find min/max luminance
  for (let i = 0; i < data.length; i += 4) {
    const lum = 0.299 * data[i] + 0.587 * data[i + 1] + 0.114 * data[i + 2];
    if (lum < min) min = lum;
    if (lum > max) max = lum;
  }

  const range = Math.max(1, max - min);
  const targetLow = 20;
  const targetHigh = 235;

  for (let i = 0; i < data.length; i += 4) {
    const lum = 0.299 * data[i] + 0.587 * data[i + 1] + 0.114 * data[i + 2];
    let stretched = ((lum - min) / range) * (targetHigh - targetLow) + targetLow;
    // slight extra pop
    stretched = Math.max(0, Math.min(255, stretched));
    data[i] = data[i + 1] = data[i + 2] = stretched;
  }
}

/**
 * Detect if predominantly dark (screenshot in dark mode / inverted UI).
 */
function isDarkBackground(context, w, h) {
  const samples = [
    [2, 2], [w - 3, 2], [2, h - 3], [w - 3, h - 3],
    [Math.floor(w / 2), 2], [Math.floor(w / 2), h - 3],
    [Math.floor(w * 0.25), Math.floor(h * 0.5)],
    [Math.floor(w * 0.75), Math.floor(h * 0.5)],
  ];
  let sum = 0;
  for (const [x, y] of samples) {
    const p = context.getImageData(Math.max(0, x), Math.max(0, y), 1, 1).data;
    sum += 0.299 * p[0] + 0.587 * p[1] + 0.114 * p[2];
  }
  return (sum / samples.length) < 115;
}

/**
 * Invert + boost contrast for dark screenshots.
 */
function invertAndBoost(imageData) {
  const data = imageData.data;
  for (let i = 0; i < data.length; i += 4) {
    const g = 0.299 * data[i] + 0.587 * data[i + 1] + 0.114 * data[i + 2];
    const inv = 255 - g;
    // push values away from middle for crisper text
    const v = inv > 128 ? Math.min(255, inv + 55) : Math.max(0, inv - 55);
    data[i] = data[i + 1] = data[i + 2] = v;
  }
}

/**
 * Strong binarization: text becomes pure black, bg pure white.
 * Good threshold after stretch for clean printed/screenshot text.
 */
function binarize(imageData, threshold = 168) {
  const data = imageData.data;
  for (let i = 0; i < data.length; i += 4) {
    const g = data[i]; // already grayscale
    const v = g > threshold ? 255 : 0;
    data[i] = data[i + 1] = data[i + 2] = v;
  }
}

/**
 * Light median-like noise reduction for isolated pixels (3x3).
 * Only applied lightly to avoid blurring text.
 */
function denoiseLight(imageData) {
  const data = imageData.data;
  const w = imageData.width;
  const h = imageData.height;
  const copy = new Uint8ClampedArray(data);

  for (let y = 1; y < h - 1; y += 1) {
    for (let x = 1; x < w - 1; x += 1) {
      const idx = (y * w + x) * 4;
      const center = copy[idx];
      // count neighbors close to center (for binary-ish)
      let same = 0;
      for (let ky = -1; ky <= 1; ky += 1) {
        for (let kx = -1; kx <= 1; kx += 1) {
          if (kx === 0 && ky === 0) continue;
          const nidx = ((y + ky) * w + (x + kx)) * 4;
          if (Math.abs(copy[nidx] - center) < 30) same += 1;
        }
      }
      if (same <= 1) {
        // isolated speck -> use surrounding average
        let sum = 0;
        let cnt = 0;
        for (let ky = -1; ky <= 1; ky += 1) {
          for (let kx = -1; kx <= 1; kx += 1) {
            if (kx === 0 && ky === 0) continue;
            const nidx = ((y + ky) * w + (x + kx)) * 4;
            sum += copy[nidx];
            cnt += 1;
          }
        }
        const avg = Math.round(sum / cnt);
        data[idx] = data[idx + 1] = data[idx + 2] = avg > 128 ? 255 : 0;
      }
    }
  }
}

/**
 * Main entry: returns a cleaned canvas ready for Tesseract recognize().
 * Accepts File, HTMLImageElement, or existing Canvas.
 */
export async function prepareCanvasForOcr(input, options = {}) {
  let sourceCanvas;

  if (input instanceof HTMLCanvasElement) {
    sourceCanvas = input;
  } else {
    let img;
    if (input instanceof HTMLImageElement) {
      img = input;
    } else if (input && typeof input === "object" && input.size) {
      // File or Blob
      img = await loadImageFromFile(input);
    } else {
      throw new Error("Unsupported input for OCR preprocessing.");
    }

    const scale = getTargetScale(img.naturalWidth || img.width, img.naturalHeight || img.height);
    const w = Math.max(1, Math.round((img.naturalWidth || img.width) * scale));
    const h = Math.max(1, Math.round((img.naturalHeight || img.height) * scale));

    const c = document.createElement("canvas");
    c.width = w;
    c.height = h;
    const ctx = c.getContext("2d", { alpha: false });
    if (!ctx) throw new Error("Canvas context unavailable for OCR prep.");
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = "high";
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, w, h);
    ctx.drawImage(img, 0, 0, w, h);
    sourceCanvas = c;
  }

  const w = sourceCanvas.width;
  const h = sourceCanvas.height;
  if (w < 8 || h < 8) return sourceCanvas;

  const ctx = sourceCanvas.getContext("2d", { alpha: false });
  if (!ctx) return sourceCanvas;

  let imageData = ctx.getImageData(0, 0, w, h);

  // 1. Stretch contrast + grayscale
  stretchAndGrayscale(imageData);
  ctx.putImageData(imageData, 0, 0);

  // 2. Dark mode handling
  if (isDarkBackground(ctx, w, h)) {
    imageData = ctx.getImageData(0, 0, w, h);
    invertAndBoost(imageData);
    ctx.putImageData(imageData, 0, 0);
  }

  // 3. Sharpen
  imageData = ctx.getImageData(0, 0, w, h);
  applySharpen(imageData);
  ctx.putImageData(imageData, 0, 0);

  // 4. Light denoise (optional, cheap)
  imageData = ctx.getImageData(0, 0, w, h);
  denoiseLight(imageData);
  ctx.putImageData(imageData, 0, 0);

  // 5. Final strong binarize — this is the single biggest accuracy booster for timetables
  imageData = ctx.getImageData(0, 0, w, h);
  binarize(imageData, options.threshold ?? 162);
  ctx.putImageData(imageData, 0, 0);

  // Re-apply tiny sharpen after binary to keep stroke crispness
  imageData = ctx.getImageData(0, 0, w, h);
  applySharpen(imageData);
  ctx.putImageData(imageData, 0, 0);

  return sourceCanvas;
}

export const OCR_PREPROCESS_CONSTANTS = {
  OCR_MAX_DIMENSION,
  OCR_MIN_DIMENSION,
  OCR_MOBILE_MAX_DIMENSION,
  OCR_MOBILE_MIN_DIMENSION,
};
