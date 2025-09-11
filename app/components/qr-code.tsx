"use client";
import Image from "next/image";
import qrcode from "qrcode";
import { useEffect, useState } from "react";

export function QrCode({ text }: { text: string }) {
  const [dataUrl, setDataUrl] = useState<string | undefined>();

  useEffect(() => {
    qrcode.toDataURL(text).then(setDataUrl);
  }, [text]);

  if (!dataUrl) {
    return <></>;
  }
  return <Image className="h-full w-full" src={dataUrl} alt="QR Code" />;
}
