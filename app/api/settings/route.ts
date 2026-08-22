import { NextResponse } from "next/server";
import { getStoreSettings } from "@/lib/settings";

// Public read of store settings the storefront needs (delivery fee, threshold).
export async function GET() {
  const settings = await getStoreSettings();
  return NextResponse.json({
    deliveryFee: settings.deliveryFee,
    freeDeliveryThreshold: settings.freeDeliveryThreshold,
    storeName: settings.storeName,
  });
}
