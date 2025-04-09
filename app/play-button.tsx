'use client';
import Link from 'next/link';
import { TargetIcon } from './assets/target-icon';

export function PlayButton() {
  return (
    <div className="pointer w-[350px] rounded-2xl p-4 shadow-2xl bg-primary text-center">
      <Link className="flex flex-col items-center" href="/play">
        <div className="w-[200px] h-[200px]">
          <TargetIcon />
        </div>
        <h3 className="text-5xl text-white">Play</h3>
      </Link>
    </div>
  );
}
