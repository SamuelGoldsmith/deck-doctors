import SignInButton from "@/components/signin";
import Image from "next/image";
import Review from "@/components/review";
import reviews from "../../data/reviews.json";
export default function Home() {

  return (
    <main className="">

      <div className="justify-center mx-auto px-20 py-10 bg-secondary text-secondary-foreground">
        {/* <Image src="/logo-black-tp.png" alt="Deck Doctor Logo" width={250} height={200} /> */}
        <p className="text-center text-2xl mt-4">Welcome to Deck Doctor, where we bring your outdoor spaces to life with expert restoration services! Established with a passion for craftsmanship and a commitment to excellence, trust Deck Doctors in transforming decks into stunning, vibrant extensions of your home. </p>
      </div>


      <div className="justify-center mx-auto px-20 py-10 bg-primary text-primary-foreground">
        <h1 className="text-4xl font-bold text-center">Our Mission</h1>
        {/* <Image src="/logo-black-tp.png" alt="Deck Doctor Logo" width={250} height={200} /> */}
        <p className="text-center text-2xl mt-4">Welcome to Deck Doctor, where we bring your outdoor spaces to life with expert restoration services! Established with a passion for craftsmanship and a commitment to excellence, trust Deck Doctors in transforming decks into stunning, vibrant extensions of your home. </p>
      </div>

      <div className="justify-center mx-auto px-20 py-10  bg-secondary text-secondary-foreground">
        <h1 className="text-4xl font-bold text-center">Why Choose Us?</h1>
        {/* <Image src="/logo-black-tp.png" alt="Deck Doctor Logo" width={250} height={200} /> */}
        <ul>
          <li>
            <div className="flex justify-center">
              <p className="text-left text-2xl mt-4">
                <p className="text-left text-2xl mt-4 mr-5 font-bold">Expert Craftsmanship:</p>
                &emsp; Our team of skilled individuals are dedicated to delivering top-notch craftsmanship on every project. With extreme focus on detail, we ensure that every deck we work on meets the highest standards of quality.
              </p>
            </div>
          </li>
          <li>
            <div className="flex justify-center">
              <p className="text-left text-2xl mt-4">
                <p className="text-left text-2xl mt-4 mr-5 font-bold">Premiun Materials:</p>
                &emsp; We use the best materials and products available to ensure that your deck not only looks fantastic but is also protected against the elements. Our high-quality paints and finishes are designed to withstand the test of time.
              </p>
            </div>
          </li>
          <li>
            <div className="flex justify-center">
              <p className="text-left text-2xl mt-4">
                <p className="text-left text-2xl mt-4 mr-5 font-bold">Customized Solutions:</p>
                &emsp; Every deck is unique, and so are the needs of our clients. We offer personalized solutions tailored to your specific requirements, whether it’s a complete deck makeover, touch-up, or regular maintenance.
              </p>
            </div>
          </li>
          <li>
            <div className="flex justify-center">
              <p className="text-left text-2xl mt-4">
                <p className="text-left text-2xl mt-4 mr-5 font-bold">Customer Satisfaction:</p>
                &emsp; Our customers are at the heart of everything we do. From the initial consultation to the final brushstroke, we prioritize clear communication, transparency, and a seamless experience. Your satisfaction is our ultimate goal.
              </p>
            </div>
          </li>
        </ul>
      </div>

      <div className="justify-center mx-auto px-20 py-10 bg-primary text-primary-foreground">
        <h1 className="text-4xl font-bold text-center">Our Mission</h1>
        {/* <Image src="/logo-black-tp.png" alt="Deck Doctor Logo" width={250} height={200} /> */}
        <p className="text-center text-2xl mt-4">Welcome to Deck Doctor, where we bring your outdoor spaces to life with expert restoration services! Established with a passion for craftsmanship and a commitment to excellence, trust Deck Doctors in transforming decks into stunning, vibrant extensions of your home. </p>
      </div>
    </main>
  );
}
