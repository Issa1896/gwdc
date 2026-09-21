import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

/** Healthcheck liveness & readiness probe para Docker e Kubernetes. */
export async function GET() {
  return NextResponse.json(
    {
      status: "ok",
      service: "gwdc-platform",
      version: "1.0.0",
      uptime: process.uptime(),
      timestamp: new Date().toISOString(),
    },
    { status: 200 },
  );
}
