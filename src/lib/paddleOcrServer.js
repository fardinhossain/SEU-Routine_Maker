import "server-only";
import { extractMarkdownFromJsonl } from "./paddleOcrResult.js";

const PADDLE_JOB_URL = "https://paddleocr.aistudio-app.com/api/v2/ocr/jobs";
const PADDLE_MODEL = "PaddleOCR-VL-1.6";

function apiToken() {
  const token = process.env.PADDLEOCR_API_TOKEN?.trim();
  if (!token) {
    throw new Error("PaddleOCR API is not configured. Set PADDLEOCR_API_TOKEN on the server.");
  }
  return token;
}

function authorizationHeaders() {
  return { Authorization: `bearer ${apiToken()}` };
}

async function checkedJson(response, fallbackMessage) {
  const payload = await response.json().catch(() => null);
  if (!response.ok) {
    const upstreamMessage = payload?.message || payload?.error || payload?.data?.errorMsg;
    throw new Error(upstreamMessage || fallbackMessage);
  }
  return payload;
}

export async function createPaddleOcrJob(file) {
  const form = new FormData();
  form.set("model", PADDLE_MODEL);
  form.set("optionalPayload", JSON.stringify({
    useDocOrientationClassify: false,
    useDocUnwarping: false,
    useChartRecognition: false,
  }));
  form.set("file", file, file.name || "ums-screenshot.png");

  const response = await fetch(PADDLE_JOB_URL, {
    method: "POST",
    headers: authorizationHeaders(),
    body: form,
    cache: "no-store",
  });
  const payload = await checkedJson(response, "PaddleOCR rejected this image.");
  const jobId = payload?.data?.jobId;
  if (!jobId) throw new Error("PaddleOCR did not return a job ID.");
  return String(jobId);
}

export async function getPaddleOcrJob(jobId) {
  const response = await fetch(`${PADDLE_JOB_URL}/${encodeURIComponent(jobId)}`, {
    headers: authorizationHeaders(),
    cache: "no-store",
  });
  const payload = await checkedJson(response, "Could not read the PaddleOCR job status.");
  const data = payload?.data || {};
  const state = String(data.state || "").toLowerCase();
  const progress = data.extractProgress || {};

  if (state === "failed") {
    return { state, error: data.errorMsg || "PaddleOCR could not process this image." };
  }
  if (state !== "done") {
    return {
      state: ["pending", "running"].includes(state) ? state : "pending",
      totalPages: Number(progress.totalPages) || 0,
      extractedPages: Number(progress.extractedPages) || 0,
    };
  }

  const resultUrl = data?.resultUrl?.jsonUrl;
  if (!resultUrl) throw new Error("PaddleOCR finished without a result file.");
  const resultResponse = await fetch(resultUrl, { cache: "no-store" });
  if (!resultResponse.ok) throw new Error("PaddleOCR result download failed.");
  const text = extractMarkdownFromJsonl(await resultResponse.text());
  if (!text) throw new Error("PaddleOCR returned no readable English text.");

  return {
    state: "done",
    totalPages: Number(progress.totalPages) || 0,
    extractedPages: Number(progress.extractedPages) || 0,
    text,
  };
}
