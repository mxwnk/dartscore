import { Navigation } from "./components/app-bar";
import { Footer } from "./components/footer";
import { History } from "./components/history";
import { PlayButton } from "./play-button";

export default function Home() {
  return (
    <>
      <Navigation title="Dart Scoreboard" />
      <div className="p-4">
        <PlayButton />
        <History />
      </div>
      <Footer />
    </>
  );
}
