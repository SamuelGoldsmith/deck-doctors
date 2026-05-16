"use client";
import Social from "./Social";
import * as React from "react";

export default function Footer() {
  return (
    <footer className="w-full border-t mt-10 bg-secondary p-3 px-5 flex items-center justify-center sm:flex">
      <div className="mr-auto">
        <a
          href="/employee-portal"
          target="_blank"
          rel="noopener noreferrer"
          className="text-sm text-primary-foreground rounded-md border bg-primary  p-2 hover:p-3"
        >
          Employee Portal
        </a>
      </div>

      <div className="">
        <Social />
      </div>

      <div className="ml-auto">
        <p className="text-sm text-gray-500 dark:text-gray-400 whitespace-nowrap hidden sm:block">
          HIC: CT: 0701796 MA: 215589
        </p>
      </div>
    </footer>


  );
}
