import React from "react";

const ForgotPasswordFooter = () => {
  return (
    <footer className="absolute bottom-4 text-center text-xs text-gray-500">
      <div className="flex justify-center space-x-2">
        <p className="font-bold">LinkedIn © 2024</p>
        <a className="hover:underline" href="#">
          User Agreement
        </a>
        <a className="hover:underline" href="#">
          Privacy Policy
        </a>
        <a className="hover:underline" href="#">
          Community Guidelines
        </a>
        <a className="hover:underline" href="#">
          Cookie Policy
        </a>
        <a className="hover:underline" href="#">
          Copyright Policy
        </a>
        <a className="hover:underline" href="#">
          Send feedback
        </a>
        <a className="hover:underline" href="#">
          Language
        </a>
      </div>
    </footer>
  );
};

export default ForgotPasswordFooter;
