import Review from "@/components/review";
import reviews from "../../data/reviews.json";
export default function Reviews() {

  return (
    <main className="">
      <div className="text-right w-full">
        <a href="https://share.google/PhUOpIj2nIsZN3IWA"
          target="_blank"
          rel="noreferrer"
          className="p-5 text-link hover:underline text-right w-full "
        >
          See more here
        </a>
      </div>
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
