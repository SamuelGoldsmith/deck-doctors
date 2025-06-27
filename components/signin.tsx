"use client";

import { signIn } from "next-auth/react";

export default function SignInButton() {
  return (
    <button
      onClick={() => signIn("google")} // or just signIn() to show all providers
      className="px-4 py-2 bg-blue-500 text-white rounded"
    >
      Sign in with Google
    </button>
  );
}
