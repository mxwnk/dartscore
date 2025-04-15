"use server";
import { revalidateTag } from "next/cache";

export async function refresh(gameId: string) {
  revalidateTag(`/play/${gameId}`);
}
