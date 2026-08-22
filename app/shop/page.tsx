import { Suspense } from "react";
import ShopClient from "@/components/shop/shop-client";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Shop Kids Qameez Shalwar",
  description: "Browse the full Kids Store collection of boys' Qameez Shalwar, ages 5 to 14.",
};

export default function ShopPage() {
  return (
    <Suspense>
      <ShopClient />
    </Suspense>
  );
}
