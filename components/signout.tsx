"use client";

import { signOut } from "next-auth/react";

export default function SignOutButton() {
  return (
    <button
      onClick={() => signOut()}
      className="px-4 py-2 bg-blue-500 text-white rounded"
    >
      Sign Out
    </button>
  );
}
