// pages/_app.tsx
import AuthContext from "@/app/context/AuthContext";
import { AppProps } from "next/app";
import "./globals.css";

const MyApp = ({ Component, pageProps }: AppProps) => {
  return (
    <>
      <AuthContext>
        <Component {...pageProps} />
      </AuthContext>
    </>
  );
};

export default MyApp;
