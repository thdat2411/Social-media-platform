// pages/_app.tsx
import { AppProps } from "next/app";
import { useRouter } from "next/router";
import { useEffect } from "react";
import "./globals.css";

const MyApp = ({ Component, pageProps }: AppProps) => {
  const router = useRouter();

  useEffect(() => {
    const handleRouteChange = () => {
      window.scrollTo(0, 0); // Scroll to top on route change
    };

    // Subscribe to router events
    router.events.on("routeChangeComplete", handleRouteChange);

    // Clean up the event listener on unmount
    return () => {
      router.events.off("routeChangeComplete", handleRouteChange);
    };
  }, [router.events]);

  return <Component {...pageProps} />;
};

export default MyApp;
