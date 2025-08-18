import SignInButton from "@/components/signin";
import Image from "next/image";
import Review from "@/components/review";
import reviews from "../../data/reviews.json";
export default function Reviews() {

  return (
    <main className="">
      {reviews.map((review, index) => (
        <Review
          key={`review-${index}`}
          name={review["reviewer"]}
          review={review["text"]}
          stars={review["rating"]} />
      ))}
    </main>
  );
}
