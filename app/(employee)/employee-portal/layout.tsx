import Navbar from "@/components/employee/navbar";
import Footer from "@/components/employee/footer";
import { getSession } from "@/lib/serverUtils";
import SignInButton from "@/components/signin";

export default async function EmployeeLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await getSession();

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1 px-4 py-8 sm:px-6 lg:px-8">
        {session ? (
          children
        ) : (
          <div className="flex flex-col items-center justify-center gap-4 py-24 text-center">
            <h1 className="font-display text-h2 font-bold">Access Denied</h1>
            <p className="text-muted-foreground">
              You must be signed in to view this page.
            </p>
            <SignInButton />
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
}
