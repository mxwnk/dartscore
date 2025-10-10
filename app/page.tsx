export const dynamic = 'force-dynamic';

import { Navigation } from "./components/app-bar";
import { Footer } from "./components/footer";
import { History } from "./components/history";
import { PlayButton } from "./play-button";

export default function Home() {
  return (
    <>
      <Navigation title="Dartscore" />
      <div className="pt-4 pb-12 md:p-4 flex flex-col items-center">
        <PlayButton />
        <History />
      </div>
      <Footer />
    </>
  );
}
