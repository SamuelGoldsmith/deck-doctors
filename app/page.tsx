import SignInButton from "@/components/signin";
import Image from "next/image";

export default function Home() {
  return (
    <main className="">
      <div className="w-full bg-primary text-accent-foreground flex items-center justify-center h-auto">
        <div className="flex flex-col lg:flex-row p-10 items-center justify-center gap-6">
          <Image
            src="/stethescope.png"
            alt="Stethescope"
            width={200}
            height={200}
            className="mb-4 mx-5"
          />
          <div className="w-full lg:w-1/4 mx-5 text-center lg:text-left">
            <h1 className="text-4xl font-bold">Is your deck in good health?</h1>
            <p className="text-2xl mb-4">
              It is recommended that a deck is repainted every 2–3 years. Is your deck in good health?
            </p>
          </div>
          <div className="w-full lg:w-auto mx-5">
            <iframe
              src="https://docs.google.com/forms/d/e/1FAIpQLSfNEeVX4M0-leg1GDXhhcP5rMGRxX7lXHBrAoqR5uAnCkyD9g/viewform?embedded=true"
              width="100%"
              height="350"
              className="w-full lg:w-[640px] min-h-[350px]"
            >
              Loading…
            </iframe>
          </div>
        </div>
      </div>
      <div className="w-full bg-black text-accent-foreground items-center justify-center h-auto p-10">
        <div className="flex flex-col lg:flex-row p-10 items-center justify-center gap-6">
          <h1 className="text-4xl font-bold mb-4">Our Services</h1>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-5">
          <div className=" p-6 rounded-lg shadow-lg items-center justify-center">
            <Image
              src="/hammer.jpg"
              alt="Hammer"
              width={200}
              height={200}
              className="mb-4 mx-5"
            />
            <h2 className="text-2xl font-semibold mb-2">Deck Inspection</h2>
            <p>Thorough inspection of your deck's condition.</p>
          </div>
          <div className=" p-6 rounded-lg shadow-lg">
            <Image
              src="/roll.jpg"
              alt="Roller"
              width={200}
              height={200}
              className="mb-4 mx-5"
            />
            <h2 className="text-2xl font-semibold mb-2">Deck Repair</h2>
            <p>Professional repair services for damaged decks.</p>
          </div>
          <div className="p-6 rounded-lg shadow-lg">
            <Image
              src="/spray.jpg"
              alt="Spray"
              width={200}
              height={200}
              className="mb-4 mx-5"
            />
            <h2 className="text-2xl font-semibold mb-2">Deck Maintenance</h2>
            <p>Regular maintenance to keep your deck in top shape.</p>
          </div>
          <div className="p-6 rounded-lg shadow-lg">
            <Image
              src="/tape.jpg"
              alt="Tape"
              width={200}
              height={200}
              className="mb-4 mx-5"
            />
            <h2 className="text-2xl font-semibold mb-2">Deck Maintenance</h2>
            <p>Regular maintenance to keep your deck in top shape.</p>
          </div>
        </div>
      </div>
    </main>
  );
}
