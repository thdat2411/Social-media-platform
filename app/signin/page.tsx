import Link from "next/link";
import React from "react";
import Footer from "./footer";
import LoginForm from "./form";
import Header from "./header";

const SignIn = () => {
  return (
    <div className="flex min-h-screen flex-col items-center">
      <Header />
      <LoginForm />
      <div className="mt-4">
        <p className="text-sm">
          New to LinkedIn?
          <Link
            href="/signup"
            className="ml-1 font-semibold text-blue-600 hover:underline"
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
