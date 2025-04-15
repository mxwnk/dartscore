"use client";
import qrcode from "qrcode";
import { useEffect, useState } from "react";

export function QrCode({ text }: { text: string }) {
  const [dataUrl, setDataUrl] = useState<string | undefined>();

  useEffect(() => {
    qrcode.toDataURL(text).then(setDataUrl);
  }, []);

  if (!dataUrl) {
    return <></>;
  }
  return <img className="h-full w-full" src={dataUrl} />;
}
