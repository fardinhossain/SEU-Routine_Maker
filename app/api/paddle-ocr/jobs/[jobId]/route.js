import { NextResponse } from "next/server";
import { getPaddleOcrJob } from "../../../../../src/lib/paddleOcrServer";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 30;

export async function GET(_request, context) {
  try {
    const { jobId } = await context.params;
    if (!/^[A-Za-z0-9_-]{1,160}$/.test(jobId || "")) {
      return NextResponse.json({ error: "Invalid OCR job ID." }, { status: 400 });
    }
    const result = await getPaddleOcrJob(jobId);
    return NextResponse.json(result, { headers: { "Cache-Control": "no-store" } });
  } catch (error) {
    return NextResponse.json(
      { error: error?.message || "PaddleOCR status check failed." },
      { status: 502 },
    );
  }
}
