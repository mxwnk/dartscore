'use client';
import { Disc } from 'lucide-react';
import Link from 'next/link';

export function PlayButton() {
  return (
    <div className="pointer w-[400px] rounded-2xl p-4 shadow-2xl bg-primary text-center">
      <Link className="flex flex-col items-center" href="/play">
        <Disc className="w-[80%] h-[80%] text-white" />
        <h3 className="text-5xl text-white">Play</h3>
      </Link>
    </div>
  );
}
