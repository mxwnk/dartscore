import { version } from "@/lib/version";

export function Footer() {
  return (
    <div className="flex flex-row fixed bottom-2 text-center left-1/2">
      Version: {version}
    </div>
  );
}
