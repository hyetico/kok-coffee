import type { Metadata } from "next";
import { CartView } from "@/components/cart/CartView";
import { cart } from "@/content/cart";

export const metadata: Metadata = { title: cart.title };

export default function CartPage() {
  return <CartView />;
}
