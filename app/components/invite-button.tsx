"use client";

import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { QrCode } from "./qr-code";
import { Share2 } from "lucide-react";
import { useEffect, useState } from "react";

export function InviteButton() {
  const [location, setLocation] = useState<string | undefined>();

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }
    setLocation(window.location.href);
  }, []);
  if (!location) {
    return <></>;
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <button className="cursor-pointer" aria-label="Open Dialog">
          <Share2 className="h-6 w-6" />
        </button>
      </DialogTrigger>
      <DialogContent className="flex flex-col items-center">
        <DialogTitle>Join game</DialogTitle>
        <div className="w-[100%] max-w-[500px] p-1 border-2 rounded-md border-primary">
          <QrCode text={location} />
        </div>
      </DialogContent>
    </Dialog>
  );
}
