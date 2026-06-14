import SignOutButton from "../signout";
import { getSession } from "@/lib/serverUtils";

export default async function Footer() {
  const session = await getSession();

  if (!session) return null;

  return (
    <footer className="surface-dark border-t border-white/10">
      <div className="mx-auto flex w-full max-w-7xl items-center gap-3 px-4 py-4 sm:px-6 lg:px-8">
        {session.user?.image && (
          <img
            src={session.user.image}
            alt=""
            className="h-8 w-8 rounded-full"
          />
        )}
        <span className="text-sm text-surface-dark-foreground/85">
          {session.user?.name}
        </span>
        <div className="ml-auto">
          <SignOutButton />
        </div>
      </div>
    </footer>
  );
}
