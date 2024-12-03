import React from "react";

const MyItemsFooter = () => {
  return (
    <footer className="relative h-fit py-4 pt-8 text-gray-600">
      <div className="container grid grid-cols-5 gap-8 px-4">
        {/* Column 1 */}
        <div className="flex flex-col space-y-2">
          <a href="#" className="text-xs hover:underline">
            About
          </a>
          <a href="#" className="text-xs hover:underline">
            Professional Community Policies
          </a>
          <a href="#" className="text-xs hover:underline">
            Privacy & Terms
          </a>
          <a href="#" className="text-xs hover:underline">
            Sales Solutions
          </a>
          <a href="#" className="text-xs hover:underline">
            Safety Center
          </a>
        </div>
        {/* Column 2 */}
        <div className="flex flex-col space-y-2">
          <a href="#" className="text-xs hover:underline">
            Accessibility
          </a>
          <a href="#" className="text-xs hover:underline">
            Careers
          </a>
          <a href="#" className="text-xs hover:underline">
            Ad Choices
          </a>
          <a href="#" className="text-xs hover:underline">
            Mobile
          </a>
        </div>
        {/* Column 3 */}
        <div className="flex flex-col space-y-2">
          <a href="#" className="text-xs hover:underline">
            Talent Solutions
          </a>
          <a href="#" className="text-xs hover:underline">
            Marketing Solutions
          </a>
          <a href="#" className="text-xs hover:underline">
            Advertising
          </a>
          <a href="#" className="text-xs hover:underline">
            Small Business
          </a>
        </div>
        {/* Column 4 */}
        <div className="flex flex-col space-y-4">
          <div>
            <div className="flex flex-col items-start space-y-2">
              <span className="text-xs font-semibold text-gray-800">
                Questions?
              </span>
              <a href="#" className="text-xs hover:underline">
                Visit our Help Center.
              </a>
            </div>
          </div>
          <div>
            <div className="flex flex-col items-start space-y-2">
              <span className="text-xs font-semibold text-gray-800">
                Manage your account and privacy
              </span>
              <a href="#" className="text-xs hover:underline">
                Go to your Settings.
              </a>
            </div>
          </div>
          <div>
            <div className="flex flex-col items-start space-y-2">
              <span className="text-xs font-semibold text-gray-800">
                Recommendation transparency
              </span>
              <a href="#" className="text-xs hover:underline">
                Learn more about Recommended Content.
              </a>
            </div>
          </div>
        </div>
        <div className="flex flex-col space-y-2">
          <label htmlFor="language" className="text-xs font-semibold">
            Select Language
          </label>
          <select
            id="language"
            className="rounded-md border bg-white p-1 text-xs"
          >
            <option value="en">English (English)</option>
            {/* Add more language options as needed */}
          </select>
        </div>
      </div>
      {/* Footer Bottom */}
      <div className="mt-2 text-left text-xs text-gray-500">
        LinkedIn Corporation © 2024
      </div>
    </footer>
  );
};

export default MyItemsFooter;
