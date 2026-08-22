import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { z } from "zod";

const settingsSchema = z.object({
  deliveryFee: z.number().int().min(0),
  freeDeliveryThreshold: z.number().int().min(0).nullable(),
});

export async function PATCH(req: NextRequest) {
  const admin = await requireAdmin();
  if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  const parsed = settingsSchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: "Invalid settings" }, { status: 400 });

  const updated = await prisma.storeSettings.upsert({
    where: { id: "settings" },
    update: parsed.data,
    create: { id: "settings", ...parsed.data },
  });

  return NextResponse.json(updated);
}
