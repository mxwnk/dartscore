export const dynamic = 'force-dynamic';

import { Navigation } from "./components/app-bar";
import { Footer } from "./components/footer";
import { History } from "./components/history";
import { PlayButton } from "./play-button";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { UsersIcon } from "lucide-react";

export default function Home() {
  return (
    <>
      <Navigation title="Dartscore" end={
        <Button variant="ghost" size="icon" asChild>
          <Link href="/players"><UsersIcon className="h-5 w-5" /></Link>
        </Button>
      } />
      <div className="p-4 pb-12 mb-12 md:p-4 flex flex-col items-center mx-auto max-w-[500px]">
        <PlayButton />
        <History />
      </div>
      <Footer />
    </>
  );
}
