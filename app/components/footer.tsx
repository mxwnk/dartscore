import { version } from "@/lib/version";

export function Footer() {
  return (
    <div className="bg-black w-full fixed bottom-2 text-center p-2">
      Version: {version}
    </div>
  );
}
