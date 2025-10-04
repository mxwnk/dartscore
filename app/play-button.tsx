'use client';
import Link from 'next/link';
import { TargetIcon } from './assets/target-icon';

export function PlayButton() {
  return (
    <div className="pointer bg-popover text-muted-foreground w-[350px] h-[300px] rounded-2xl p-4 border-b-10 shadow-2xl shadow-black text-center">
      <Link className="flex flex-col items-center" href="/play">
        <div className="w-[200px] h-[200px]">
          <TargetIcon />
        </div>
        <h3 className="text-5xl">Play</h3>
      </Link>
    </div>
  );
}
