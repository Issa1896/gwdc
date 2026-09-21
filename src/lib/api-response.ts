import { NextResponse } from "next/server";

export interface ApiErrorPayload {
  code: string;
  message: string;
  fields?: Record<string, string>;
  requestId?: string;
}

export function apiError(status: number, code: string, message: string, fields?: Record<string, string>) {
  const requestId = `req_${Math.random().toString(36).substring(2, 9)}`;
  return NextResponse.json(
    {
      error: {
        code,
        message,
        fields,
        requestId,
      },
    },
    { status },
  );
}

export function apiSuccess<T>(data: T, status = 200, headers?: Record<string, string>) {
  return NextResponse.json(data, { status, headers });
}
