import { NextResponse } from "next/server";

const COOKIE = "sas3_customer_session";
const MAX_AGE = 60 * 60 * 24;

/** Server-set cookie so middleware reliably sees the customer session. */
export async function POST() {
  const response = NextResponse.json({ ok: true });
  response.cookies.set({
    name: COOKIE,
    value: "1",
    path: "/",
    sameSite: "lax",
    maxAge: MAX_AGE,
    httpOnly: false,
  });
  return response;
}

export async function DELETE() {
  const response = NextResponse.json({ ok: true });
  response.cookies.set({
    name: COOKIE,
    value: "",
    path: "/",
    maxAge: 0,
  });
  return response;
}
