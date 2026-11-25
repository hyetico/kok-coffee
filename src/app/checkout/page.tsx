import type { Metadata } from "next";
import { CheckoutView } from "@/components/checkout/CheckoutView";
import { checkout } from "@/content/checkout";

export const metadata: Metadata = { title: checkout.title };

export default function CheckoutPage() {
  return <CheckoutView />;
}
