import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { z } from "zod";

const schema = z.object({ name: z.string().min(2) });

export async function POST(req: NextRequest) {
  const admin = await requireAdmin();
  if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  const parsed = schema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: "Invalid category name" }, { status: 400 });

  const slugBase = parsed.data.name.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
  let slug = slugBase;
  let i = 1;
  while (await prisma.category.findUnique({ where: { slug } })) {
    slug = `${slugBase}-${i++}`;
  }

  const category = await prisma.category.create({ data: { name: parsed.data.name, slug } });
  return NextResponse.json(category, { status: 201 });
}
