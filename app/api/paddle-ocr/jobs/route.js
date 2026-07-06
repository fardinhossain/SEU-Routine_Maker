import { NextResponse } from "next/server";
import { createPaddleOcrJob } from "../../../../src/lib/paddleOcrServer";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 30;

const MAX_IMAGE_SIZE = 12 * 1024 * 1024;

export async function POST(request) {
  try {
    const form = await request.formData();
    const file = form.get("file");
    if (!(file instanceof File)) {
      return NextResponse.json({ error: "Choose an image first." }, { status: 400 });
    }
    if (file.size <= 0 || file.size > MAX_IMAGE_SIZE) {
      return NextResponse.json({ error: "Choose an image between 1 byte and 12 MB." }, { status: 413 });
    }
    if (file.type && !file.type.startsWith("image/")) {
      return NextResponse.json({ error: "Only image files are accepted for OCR." }, { status: 415 });
    }

    const jobId = await createPaddleOcrJob(file);
    return NextResponse.json({ jobId }, { headers: { "Cache-Control": "no-store" } });
  } catch (error) {
    const message = error?.message || "PaddleOCR could not start.";
    const status = /not configured/i.test(message) ? 503 : 502;
    return NextResponse.json({ error: message }, { status });
  }
}
