import { version } from "@/lib/version";

export function Footer() {
  return (
    <div className="bg-muted w-full fixed bottom-0 text-center p-2">
      Version: {version}
    </div>
  );
}
