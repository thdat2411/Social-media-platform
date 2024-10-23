import LandingHeader from "./components/landing-header";
import LandingMainContent from "./components/landing-main-content";

export default function Home() {
  return (
    <div className="flex max-h-screen flex-col items-center">
      <LandingHeader />
      <LandingMainContent />
    </div>
  );
}
