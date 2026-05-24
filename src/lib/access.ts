import { cookies } from "next/headers";

export const PAID_COOKIE = "vibetrendr_paid";

export async function isPaidUser() {
  const cookieStore = await cookies();
  return cookieStore.get(PAID_COOKIE)?.value === "1";
}
