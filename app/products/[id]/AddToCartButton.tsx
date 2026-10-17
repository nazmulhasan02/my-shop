
"use client";

import { useState } from "react";
import { useCart } from "../../CartContext";

type AddToCartButtonProps = {
  product: {
    id: number;
    name: string;
    price: number;
    emoji: string;
  };
};

export default function AddToCartButton({
  product,
}: AddToCartButtonProps) {
  const { addToCart } = useCart();
  const [message, setMessage] = useState("");

  function handleAddToCart() {
    addToCart({
      id: product.id,
      name: product.name,
      price: product.price,
      emoji: product.emoji,
    });

    setMessage("Product added to cart successfully!");
  }

  return (
    <div>
      <button
        onClick={handleAddToCart}
        className="w-full rounded-xl bg-indigo-600 px-6 py-4 font-bold text-white shadow-lg transition hover:bg-indigo-700"
      >
        🛒 Add to Cart
      </button>

      {message && (
        <p className="mt-3 text-center text-sm font-medium text-green-600">
          {message}
        </p>
      )}
    </div>
  );
}
