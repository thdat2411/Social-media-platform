import React from "react";
import Header from "./header";
import LoginForm from "./form";
import Footer from "./footer";
import Link from "next/link";

const SignIn = () => {
  return (
    <div className="flex flex-col items-center min-h-screen">
      <Header />
      <LoginForm />
      <div className="mt-4">
        <p className="text-sm">
          New to LinkedIn?
          <Link
            href="/signup"
            className="text-blue-600 hover:underline ml-1 font-semibold"
          >
            Join now
          </Link>
        </p>
      </div>
      <Footer />
    </div>
  );
};

export default SignIn;
