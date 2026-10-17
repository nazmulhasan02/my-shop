
export type Product = {
  id: number;
  name: string;
  price: number;
  emoji: string;
  category: string;
  image: string;
};

export const products: Product[] = [
  {
    id: 1,
    name: "Classic T-Shirt",
    price: 550,
    emoji: "👕",
    category: "Fashion",
    image:
      "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=600&q=80",
  },
  {
    id: 5,
    name: "Casual Shirt",
    price: 850,
    emoji: "👔",
    category: "Fashion",
    image:
      "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?auto=format&fit=crop&w=600&q=80",
  },
  {
    id: 3,
    name: "Smart Watch",
    price: 2500,
    emoji: "⌚",
    category: "Electronics",
    image:
      "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=600&q=80",
  },
  {
    id: 6,
    name: "Wireless Headphones",
    price: 1600,
    emoji: "🎧",
    category: "Electronics",
    image:
      "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=600&q=80",
  },
  {
    id: 2,
    name: "Running Sneakers",
    price: 1800,
    emoji: "👟",
    category: "Shoes",
    image:
      "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=600&q=80",
  },
  {
    id: 4,
    name: "Backpack",
    price: 1200,
    emoji: "🎒",
    category: "Bags",
    image:
      "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=600&q=80",
  },
  {
    id: 7,
    name: "Classic Sunglasses",
    price: 650,
    emoji: "🕶️",
    category: "Accessories",
    image:
      "https://images.unsplash.com/photo-1511499767150-a48a237f0083?auto=format&fit=crop&w=600&q=80",
  },
  {
    id: 8,
    name: "Everyday Wallet",
    price: 450,
    emoji: "👛",
    category: "Accessories",
    image:
      "https://images.unsplash.com/photo-1627123424574-724758594e93?auto=format&fit=crop&w=600&q=80",
  },
  {
    id: 9,
    name: "Modern Desk Lamp",
    price: 950,
    emoji: "💡",
    category: "Home & Living",
    image:
      "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&w=600&q=80",
  },
  {
    id: 10,
    name: "Reusable Water Bottle",
    price: 350,
    emoji: "🥤",
    category: "Home & Living",
    image:
      "https://images.unsplash.com/photo-1602143407151-7111542de6e8?auto=format&fit=crop&w=600&q=80",
  },
];
