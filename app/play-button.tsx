'use client';
import Link from 'next/link';
import { TargetIcon } from './assets/target-icon';
import { Card } from '@/components/ui/card';

export function PlayButton() {
  return (
    <Card className="pointer w-full p-4 text-center">
      <Link className="flex flex-col items-center" href="/play">
        <div className="w-[200px] h-[200px]">
          <TargetIcon />
        </div>
        <h3 className="text-5xl">Play X01</h3>
      </Link>
    </Card>
  );
}
