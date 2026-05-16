import * as React from "react";
import SignInButton from "../signin";
import SignOutButton from "../signout";
import { getSession } from "@/lib/serverUtils";

export default async function Footer() {
  const session = await getSession();
  console.log("Footer session:", session?.user?.image);
  return (
    <footer className="w-full border-t mt-10 bg-secondary p-3 px-5 flex items-center justify-center sm:flex">
      {session ? (
        <>
        <img src={session?.user?.image || ""} alt="Icon" className="w-8 h-8 rounded-full mr-2" />
        <h3 className="mr-3">{session?.user?.name}</h3>
        <SignOutButton />
        </>
      ) : (
        <></>
      )}
    </footer>
  );
}
