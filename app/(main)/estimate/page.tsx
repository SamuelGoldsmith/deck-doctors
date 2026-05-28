import SignInButton from "@/components/signin";
import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen bg-background relative overflow-hidden">

      <div
        className="pointer-events-none absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000000'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }}
      />

      <div className="w-full h-1.5 bg-gradient-to-r from-transparent via-accent to-transparent" />

      <div className="relative flex flex-col items-center justify-start min-h-screen py-12 px-4">

        <div className="w-full max-w-2xl mx-auto text-center mb-8 slide-in-left">

          <h1
            className="text-4xl sm:text-5xl font-bold text-foreground leading-tight mb-4"
            style={{ fontFamily: "'Georgia', 'Times New Roman', serif", letterSpacing: "-0.01em" }}
          >
            Thank You for Your Interest
          </h1>

          <p className="text-lg text-foreground/70 max-w-md mx-auto leading-relaxed">
            Fill out the contact form below and we'll schedule your{" "}
            <span className="text-foreground font-semibold">free estimate</span> at a time that works for you.
          </p>
        </div>

        <div className="flex items-center gap-3 mb-8 bg-secondary/60 border border-accent/20 rounded-xl px-5 py-3 shadow-sm">
          <p className="text-foreground/80 text-sm">Have a question before you start?</p>
          <Link
            href="/contact"
            className="inline-flex items-center gap-1.5 bg-foreground text-amber-100 text-sm font-medium px-4 py-1.5 rounded-lg hover:opacity-90 transition-opacity"
          >
            Contact Us
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </Link>
        </div>
        <div
          className="w-full max-w-2xl mx-auto rounded-2xl overflow-hidden shadow-2xl shadow-black/20 border border-accent/25"
          style={{ background: "var(--color-card, oklch(0.98 0.01 50))" }}
        >
          {/* Card header accent */}
          <div className="bg-accent/15 border-b border-accent/20 px-6 py-4 flex items-center gap-3">
            <div className="flex gap-1.5">
              <span className="w-3 h-3 rounded-full bg-accent/40" />
              <span className="w-3 h-3 rounded-full bg-accent/25" />
              <span className="w-3 h-3 rounded-full bg-accent/15" />
            </div>
            <p className="text-sm text-foreground/60 font-medium tracking-wide ml-1">Estimate Request Form</p>
          </div>
          <div className="w-full" style={{ height: "680px" }}>
            <iframe
              src="https://docs.google.com/forms/d/e/1FAIpQLSfNEeVX4M0-leg1GDXhhcP5rMGRxX7lXHBrAoqR5uAnCkyD9g/viewform?embedded=true"
              width="100%"
              height="100%"
              style={{ display: "block", border: "none" }}
              title="Free Estimate Request Form"
            >
              Loading…
            </iframe>
          </div>
        </div>

        <p className="mt-8 text-sm text-foreground/40 text-center max-w-sm">
          We typically respond within 1 business day. Your information is kept private.
        </p>

      </div>
      <div className="w-full h-1 bg-gradient-to-r from-transparent via-accent/50 to-transparent" />
    </main>
  );
}