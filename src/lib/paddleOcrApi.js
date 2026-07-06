const POLL_INTERVAL_MS = 3000;
const OCR_TIMEOUT_MS = 4 * 60 * 1000;

function delay(milliseconds, signal) {
  return new Promise((resolve, reject) => {
    let timer;
    const abort = () => {
      clearTimeout(timer);
      reject(new DOMException("OCR cancelled.", "AbortError"));
    };
    if (signal?.aborted) {
      abort();
      return;
    }
    signal?.addEventListener("abort", abort, { once: true });
    timer = setTimeout(() => {
      signal?.removeEventListener("abort", abort);
      resolve();
    }, milliseconds);
  });
}

async function responseJson(response, fallbackMessage) {
  const payload = await response.json().catch(() => null);
  if (!response.ok) throw new Error(payload?.error || fallbackMessage);
  return payload;
}

export async function extractEnglishTextWithPaddleApi(file, { onProgress, signal } = {}) {
  const form = new FormData();
  form.set("file", file, file.name || "ums-screenshot.png");
  onProgress?.({ progress: 8, status: "Uploading image securely" });
  const createResponse = await fetch("/api/paddle-ocr/jobs", {
    method: "POST",
    body: form,
    signal,
  });
  const { jobId } = await responseJson(createResponse, "Could not start PaddleOCR.");
  if (!jobId) throw new Error("The OCR server did not return a job ID.");

  const deadline = Date.now() + OCR_TIMEOUT_MS;
  while (Date.now() < deadline) {
    await delay(POLL_INTERVAL_MS, signal);
    const statusResponse = await fetch(`/api/paddle-ocr/jobs/${encodeURIComponent(jobId)}`, {
      cache: "no-store",
      signal,
    });
    const result = await responseJson(statusResponse, "Could not check PaddleOCR progress.");
    if (result.state === "failed") throw new Error(result.error || "PaddleOCR could not read this image.");
    if (result.state === "done") {
      if (!result.text?.trim()) throw new Error("PaddleOCR returned no readable English text.");
      onProgress?.({ progress: 100, status: "PaddleOCR complete" });
      return result.text;
    }

    const total = Number(result.totalPages) || 0;
    const extracted = Number(result.extractedPages) || 0;
    const pageProgress = total > 0 ? Math.min(1, extracted / total) : 0;
    onProgress?.({
      progress: Math.max(18, Math.round(18 + pageProgress * 76)),
      status: total > 0 ? `Reading page ${Math.min(extracted + 1, total)} of ${total}` : "PaddleOCR is reading the image",
    });
  }

  throw new Error("PaddleOCR took too long. Try a smaller or more tightly cropped image.");
}
