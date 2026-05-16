import Review from "@/components/review";
import reviews from "../../../data/reviews.json";
export default function Reviews() {

  return (
    <main className="m-3 ">
      <div className="text-right w-full  hover:underline cursor-pointer">
        <a href="https://share.google/PhUOpIj2nIsZN3IWA"
          target="_blank"
          rel="noreferrer"
          className="p-2 cursor-pointer hover:underline text-right w-full rounded-xl border border-0.5 bg-primary text-primary-foreground"
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
