import { prisma } from "@/lib/db";

// Store-wide configurable settings (delivery fee, free-delivery threshold, etc.)
// kept as a single row so the admin can change them without redeploying.
export async function getStoreSettings() {
  const settings = await prisma.storeSettings.upsert({
    where: { id: "settings" },
    update: {},
    create: {
      id: "settings",
      deliveryFee: 200,
      freeDeliveryThreshold: 5000,
      whatsappNumber: process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "",
      storeName: "Kids Store",
    },
  });
  return settings;
}

export function calculateDeliveryFee(subtotal: number, deliveryFee: number, freeThreshold: number | null) {
  if (freeThreshold != null && subtotal >= freeThreshold) return 0;
  return deliveryFee;
}
