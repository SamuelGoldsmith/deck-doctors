import Social from "@/components/Social";


export default function Contact() {

  return (
    <main className="">
      <h1 className="text-4xl font-bold text-center mt-8">Contact Us</h1>
      <div className="justify-center mt-8 bg-secondary p-6 rounded-lg shadow-lg max-w-md mx-auto p-15">
      <h3 className="text-3xl text-center mt-4">(413) 400-0884</h3>
      <h3 className="text-3xl text-center mt-4">Contact@DeckDocNE.com</h3>
      <div className="flex justify-center mt-8">  
        <Social />
      </div>
      </div>
    </main>
  );
}
