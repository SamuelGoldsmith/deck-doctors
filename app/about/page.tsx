import SignInButton from "@/components/signin";
import Image from "next/image";
import Review from "@/components/review";
import reviews from "../../data/reviews.json";
export default function Home() {

  return (
    <main className="">
      <div className="flex flex-col items-center">
        <div className="md:flex lg:w-6/10 md:w-8/10 sm:w-8/10 rounded-sm p-3  m-3 bg-primary text-primary-foreground overflow-hidden">
          <div className="m-3">
            <h1 className="text-4xl font-bold   mb-4">Our Mission</h1>
            <hr className="my-4 border-t-2 border-accent" />

            <p className="  sm:text-l md:text-2xl mt-4">Welcome to Deck Doctor, where we bring your outdoor spaces to life with expert restoration services! Established with a passion for craftsmanship and a commitment to excellence, trust Deck Doctors in transforming decks into stunning, vibrant extensions of your home. </p>
          </div>
          <Image src="/ppaint.jpg" alt="Paul painting a railing" className="h-full max-w-full ml-3" width={250} height={200} />

        </div>

        <div className="md:flex lg:w-6/10 md:w-8/10 sm:w-8/10 rounded-sm p-3  m-3 bg-secondary text-secondary-foreground overflow-hidden">
          <div className="m-3">
            <h1 className="text-4xl font-bold   mb-4">Why Choose Us?</h1>
            <hr className="border-t-2 border-secondary-foreground mb-6" />

            <ul>
              <li>
                <p className="text-left text-2xl mt-4">
                  <span className="text-left text-2xl mt-4 mr-5 font-bold">Expert Craftsmanship:</span>
                  <br /> Our team of skilled individuals are dedicated to delivering top-notch craftsmanship on every project. With extreme focus on detail, we ensure that every deck we work on meets the highest standards of quality.
                </p>
              </li>
              <li>

                <p className="text-left text-2xl mt-4">
                  <span className="text-left text-2xl mt-4 mr-5 font-bold">Premiun Materials:</span>
                  <br /> We use the best materials and products available to ensure that your deck not only looks fantastic but is also protected against the elements. Our high-quality paints and finishes are designed to withstand the test of time.
                </p>
              </li>
              <li>
                <p className="text-left text-2xl mt-4">
                  <span className="text-left text-2xl mt-4 mr-5 font-bold">Customized Solutions:</span>
                  <br /> Every deck is unique, and so are the needs of our clients. We offer personalized solutions tailored to your specific requirements, whether it’s a complete deck makeover, touch-up, or regular maintenance.
                </p>
              </li>
              <li>
                <p className="text-left text-2xl mt-4">
                  <span className="text-left text-2xl mt-4 mr-5 font-bold">Customer Satisfaction:</span>
                  <br /> Our customers are at the heart of everything we do. From the initial consultation to the final brushstroke, we prioritize clear communication, transparency, and a seamless experience. Your satisfaction is our ultimate goal.
                </p>
              </li>
            </ul>
          </div>
          {/* <Image src="/logo-black-tp.png" alt="Deck Doctor Logo" width={250} height={200} /> */}
        </div>

        <div className="md:flex lg:w-6/10 md:w-8/10 sm:w-8/10 rounded-sm p-3  m-3 bg-primary text-primary-foreground overflow-hidden">
          <div className="m-3">
            <h1 className="text-4xl font-bold   mb-4">Our Services</h1>
            <hr className="my-4 border-t-2 border-accent" />

            <p className="  sm:text-l md:text-2xl mt-4-">
              <b>Decks</b> (Rehab, Restore, Renew & New Construction)
              <br />
              <b>Front Doors</b> (Refinish, Paint, or Replace)
              <br />
              <b>Garage Doors</b> (Clean, Paint, or Replace)
              <br />
              <b>Cement Stoops</b> (Power Wash, Repair, or Refinish)
              <br />
              <b>Railings</b> (Refinish or New Install)
              <br />
              <b>Fences</b> (Paint, Stain, Clean, Repair)
              <br />
              <b>Power Washing</b> (Home, Patio, Outdoor Furniture, Sheds, Walkways)
              <br />
              <b>Paver Pressure Washing & Sealing</b>
              <br />
              <b>Driveway Power Washing</b> (Concrete, Asphalt, & Pavers)
              <br />
              <b>Yard Clutter & Junk Removal</b>
              <br />
              <b>Exterior Stairs & Steps</b> (Cleaning, Repair, or Replacement)
              <br />
              <em>And More!</em></p>
          </div>
          <Image src="/ppaint.jpg" alt="Paul painting a railing" className="h-full max-w-full ml-3" width={250} height={200} />

        </div>
      </div>
    </main>
  );
}
