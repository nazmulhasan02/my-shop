
"use client";

import { useEffect, useState, type FormEvent } from "react";
import { supabase } from "@/lib/supabase";
import type { User } from "@supabase/supabase-js";

type Review = {
  id: number;
  product_id: string;
  user_id: string;
  rating: number;
  review: string;
  created_at: string;
};

type ProductReviewsProps = {
  productId: string;
};

export default function ProductReviews({
  productId,
}: ProductReviewsProps) {
  const [user, setUser] = useState<User | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [rating, setRating] = useState(5);
  const [reviewText, setReviewText] = useState("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState("");

  async function loadReviews() {
    const { data, error } = await supabase
      .from("product_reviews")
      .select("id, product_id, user_id, rating, review, created_at")
      .eq("product_id", productId)
      .order("created_at", { ascending: false });

    if (error) {
      setMessage("Reviews load kora jayni. Please try again.");
      return;
    }

    const loadedReviews = (data ?? []) as Review[];
    setReviews(loadedReviews);
  }

  useEffect(() => {
    let active = true;

    async function initialize() {
      const { data: authData } = await supabase.auth.getUser();

      const { data, error } = await supabase
        .from("product_reviews")
        .select("id, product_id, user_id, rating, review, created_at")
        .eq("product_id", productId)
        .order("created_at", { ascending: false });

      if (!active) return;

      setUser(authData.user);

      if (error) {
        setMessage("Reviews load kora jayni. Please refresh.");
      } else {
        const loadedReviews = (data ?? []) as Review[];
        setReviews(loadedReviews);

        const ownReview = loadedReviews.find(
          (item) => item.user_id === authData.user?.id
        );

        if (ownReview) {
          setRating(ownReview.rating);
          setReviewText(ownReview.review);
        }
      }

      setLoading(false);
    }

    initialize();

    return () => {
      active = false;
    };
  }, [productId]);

  const ownReview = reviews.find(
    (item) => item.user_id === user?.id
  );

  const averageRating =
    reviews.length > 0
      ? reviews.reduce((total, item) => total + item.rating, 0) /
        reviews.length
      : 0;

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage("");

    if (!user) {
      setMessage("Review dite hole prothome login koro.");
      return;
    }

    const cleanReview = reviewText.trim();

    if (cleanReview.length < 3 || cleanReview.length > 1000) {
      setMessage("Review 3 theke 1000 character-er moddhe likho.");
      return;
    }

    setSubmitting(true);

    const { error } = await supabase.from("product_reviews").upsert(
      {
        product_id: productId,
        user_id: user.id,
        rating,
        review: cleanReview,
      },
      {
        onConflict: "product_id,user_id",
      }
    );

    if (error) {
      setMessage(`Review save kora jayni: ${error.message}`);
      setSubmitting(false);
      return;
    }

    setMessage("Review successfully saved!");
    await loadReviews();
    setSubmitting(false);
  }

  async function handleDelete() {
    if (!user || !ownReview) return;

    const confirmed = window.confirm(
      "Are you sure?"
    );

    if (!confirmed) return;

    setMessage("");

    const { error } = await supabase
      .from("product_reviews")
      .delete()
      .eq("product_id", productId)
      .eq("user_id", user.id);

    if (error) {
      setMessage(`Review delete kora jayni: ${error.message}`);
      return;
    }

    setRating(5);
    setReviewText("");
    setMessage("Review successfully deleted!");
    await loadReviews();
  }

  return (
    <section className="mt-6 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-7">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-xl font-extrabold text-slate-900">
            Customer Reviews & Ratings
          </h2>
          <p className="mt-1 text-sm text-slate-500">
            Share your experience with this product.
          </p>
        </div>

        <div className="rounded-xl bg-amber-50 px-4 py-3">
          <p className="text-lg font-extrabold text-slate-900">
            {reviews.length > 0 ? averageRating.toFixed(1) : "—"}{" "}
            <span className="text-amber-500">★</span>
          </p>
          <p className="text-xs text-slate-500">
            {reviews.length}{" "}
            {reviews.length === 1 ? "review" : "reviews"}
          </p>
        </div>
      </div>

      <div className="my-6 h-px bg-slate-100" />

      <h3 className="text-base font-bold text-slate-900">
        {ownReview ? "Edit Your Review" : "Write a Review"}
      </h3>

      {!user ? (
        <p className="mt-3 rounded-xl bg-indigo-50 p-4 text-sm text-indigo-800">
          Review dite hole prothome{" "}
          <a
            href="/account"
            className="font-bold underline underline-offset-2"
          >
            login
          </a>{" "}
          koro.
        </p>
      ) : (
        <form onSubmit={handleSubmit} className="mt-4">
          <label className="text-sm font-semibold text-slate-700">
            Your Rating
          </label>

          <div className="mt-2 flex items-center gap-1">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                onClick={() => setRating(star)}
                aria-label={`${star} star rating`}
                aria-pressed={rating === star}
                className={`text-3xl transition hover:scale-110 ${
                  star <= rating
                    ? "text-amber-400"
                    : "text-slate-300"
                }`}
              >
                ★
              </button>
            ))}
            <span className="ml-2 text-sm text-slate-500">
              {rating}/5
            </span>
          </div>

          <label
            htmlFor="product-review"
            className="mt-4 block text-sm font-semibold text-slate-700"
          >
            Your Review
          </label>

          <textarea
            id="product-review"
            value={reviewText}
            onChange={(event) => setReviewText(event.target.value)}
            placeholder="Tell others about your experience..."
            rows={4}
            maxLength={1000}
            required
            className="mt-2 w-full resize-y rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
          />

          <p className="mt-1 text-right text-xs text-slate-400">
            {reviewText.length}/1000
          </p>

          <div className="mt-3 flex flex-wrap gap-3">
            <button
              type="submit"
              disabled={submitting}
              className="rounded-xl bg-indigo-600 px-5 py-3 text-sm font-bold text-white transition hover:bg-indigo-700 disabled:opacity-60"
            >
              {submitting
                ? "Saving..."
                : ownReview
                  ? "Update Review"
                  : "Save Review"}
            </button>

            {ownReview && (
              <button
                type="button"
                onClick={handleDelete}
                className="rounded-xl border border-rose-200 px-5 py-3 text-sm font-bold text-rose-600 transition hover:bg-rose-50"
              >
                Delete My Review
              </button>
            )}
          </div>
        </form>
      )}

      {message && (
        <p
          role="status"
          className="mt-4 rounded-lg bg-slate-50 p-3 text-sm text-slate-700"
        >
          {message}
        </p>
      )}

      <div className="my-6 h-px bg-slate-100" />

      <h3 className="text-base font-bold text-slate-900">
        What Customers Say
      </h3>

      {loading ? (
        <p className="mt-4 text-sm text-slate-500">
          Loading reviews...
        </p>
      ) : reviews.length === 0 ? (
        <p className="mt-4 rounded-xl bg-slate-50 p-5 text-sm text-slate-500">
          No reviews yet. Be the first to review this product!
        </p>
      ) : (
        <div className="mt-4 space-y-4">
          {reviews.map((item) => (
            <article
              key={item.id}
              className="rounded-xl border border-slate-100 p-4"
            >
              <div className="flex flex-wrap items-center justify-between gap-2">
                <p className="text-sm font-bold text-slate-800">
                  {user?.id === item.user_id
                    ? "Your Review"
                    : "Customer"}
                </p>

                <time
                  dateTime={item.created_at}
                  className="text-xs text-slate-400"
                >
                  {new Date(item.created_at).toLocaleDateString(
                    "en-GB",
                    {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    }
                  )}
                </time>
              </div>

              <div
                className="mt-2 text-lg text-amber-400"
                aria-label={`${item.rating} out of 5 stars`}
              >
                {"★".repeat(item.rating)}
                <span className="text-slate-200">
                  {"★".repeat(5 - item.rating)}
                </span>
              </div>

              <p className="mt-2 whitespace-pre-wrap text-sm leading-6 text-slate-600">
                {item.review}
              </p>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}
