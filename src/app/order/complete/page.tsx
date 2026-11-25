import type { Metadata } from "next";
import { CompleteView } from "@/components/checkout/CompleteView";
import { checkout } from "@/content/checkout";

export const metadata: Metadata = {
  title: checkout.steps.complete,
  robots: { index: false },
};

export default function OrderCompletePage() {
  return <CompleteView />;
}
