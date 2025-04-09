import { arrayOf } from "@/app/utils/array";

export function generateMany<T>({ count, fn }: { count: number, fn: () => T }) {
    return arrayOf(count).map(_ => fn());
}