"use server";
import { revalidatePath } from "next/cache";

export async function refresh(gameId: string) {
  revalidatePath(`/play/${gameId}`);
}
