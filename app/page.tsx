import LandingHeader from "./components/landing-header";
import LandingMainContent from "./components/landing-main-content";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen items-center">
      <LandingHeader />
      <LandingMainContent />
    </div>
  );
}
