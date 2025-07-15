"use client";
import Social from "./Social";
import * as React from "react";

export default function Footer() {
  return (
    <footer className="w-full border-t mt-10 bottom-0 bg-secondary fixed h-16 px-5 flex items-center justify-center relative">
      {/* Centered Social */}
      <div className="absolute left-1/2 transform -translate-x-1/2">
        <Social />
      </div>

      {/* Right-aligned HIC */}
      <div className="ml-auto">
        <p className="text-sm text-gray-500 dark:text-gray-400 whitespace-nowrap hidden sm:block">
          HIC: CT: 0701796 MA: 215589
        </p>
      </div>
    </footer>
  );
}
