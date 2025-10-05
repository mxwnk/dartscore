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
  return <Image
    width={200}
    height={200}
    className="h-full w-full"
    src={dataUrl}
    alt="Play dart game qr code"
  />;
}
