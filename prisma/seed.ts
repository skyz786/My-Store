// Development seed data for Kids Store.
// Run with: npx prisma db seed
//
// IMPORTANT: These are clearly-marked SAMPLE products for local testing.
// The admin should replace/add real products through /admin/products.

import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const connectionString = process.env.DATABASE_URL;
if (!connectionString) throw new Error("DATABASE_URL is not configured");

const prisma = new PrismaClient({
  adapter: new PrismaPg({ connectionString }),
});

// Local neutral placeholder — sample products ship with this instead of a
// real photo. Replace it in /admin/products by editing each sample product
// and uploading actual Qameez Shalwar photos (or delete the samples).
const SAMPLE_IMAGE = "/placeholder-product.svg";

const AGES = [5, 6, 7, 8, 9, 10, 11, 12, 13, 14];

// Base measurements at age 5, incremented per year — realistic tailoring progression.
function measurementsFor(age: number) {
  const step = age - 5;
  return {
    qameezLength: 22 + step * 0.9,
    chest: 24 + step * 0.9,
    shoulder: 10 + step * 0.35,
    sleeveLength: 15 + step * 0.6,
    neck: 12 + step * 0.3,
    shalwarLength: 22 + step * 0.85,
    waist: 20 + step * 0.55,
  };
}

async function main() {
  console.log("Seeding Kids Store sample data (development only)...");

  // Admin user
  const adminPasswordHash = await bcrypt.hash("Admin@12345", 12);
  await prisma.user.upsert({
    where: { email: "zeeshan@kidsstore.pk" },
    update: {},
    create: {
      name: "Zeeshan",
      email: "zeeshan@kidsstore.pk",
      passwordHash: adminPasswordHash,
      role: "ADMIN",
    },
  });
  console.log("Admin login → zeeshan@kidsstore.pk / Admin@12345 (change this after first login)");

  // Sample customer
  const customerPasswordHash = await bcrypt.hash("Customer@123", 12);
  await prisma.user.upsert({
    where: { email: "customer@example.com" },
    update: {},
    create: {
      name: "Sample Customer",
      email: "customer@example.com",
      passwordHash: customerPasswordHash,
      role: "CUSTOMER",
    },
  });

  // Category
  const category = await prisma.category.upsert({
    where: { slug: "festive-wear" },
    update: {},
    create: { name: "Festive Wear", slug: "festive-wear" },
  });

  const products = [
    {
      name: "Royal Blue Kids Qameez Shalwar (Sample)",
      description:
        "A rich royal blue Qameez Shalwar with subtle traditional embroidery on the collar. Comfortable cotton-blend fabric, tailored for everyday wear and special occasions alike.",
      price: 3500,
      discountPrice: 2999,
      isFeatured: true,
      isNewArrival: true,
    },
    {
      name: "White Traditional Kids Qameez Shalwar (Sample)",
      description:
        "A classic white Qameez Shalwar, perfect for Eid and festive gatherings. Soft, breathable fabric with a clean traditional cut.",
      price: 3200,
      discountPrice: null,
      isFeatured: true,
      isNewArrival: false,
    },
    {
      name: "Black Premium Kids Qameez Shalwar (Sample)",
      description:
        "An elegant black Qameez Shalwar with a premium finish, designed for a polished, formal traditional look.",
      price: 3800,
      discountPrice: 3299,
      isFeatured: false,
      isNewArrival: true,
    },
    {
      name: "Cream Festive Kids Qameez Shalwar (Sample)",
      description:
        "A warm cream-toned Qameez Shalwar with delicate detailing, ideal for festive occasions and family events.",
      price: 3600,
      discountPrice: null,
      isFeatured: true,
      isNewArrival: false,
    },
  ];

  for (const p of products) {
    const slug = p.name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");

    const sku = `KS-${slug.slice(0, 12).toUpperCase()}-${Math.floor(1000 + Math.random() * 9000)}`;

    await prisma.product.upsert({
      where: { slug },
      update: {},
      create: {
        name: p.name,
        slug,
        description: p.description,
        price: p.price,
        discountPrice: p.discountPrice,
        sku,
        stock: 25,
        status: "PUBLISHED",
        isFeatured: p.isFeatured,
        isNewArrival: p.isNewArrival,
        categoryId: category.id,
        images: {
          create: [
            { url: SAMPLE_IMAGE, publicId: "local-placeholder", position: 0 },
          ],
        },
        sizes: {
          create: AGES.map((age) => ({
            age,
            inStock: true,
            measurement: { create: measurementsFor(age) },
          })),
        },
      },
    });
  }

  console.log(`Seeded ${products.length} sample products (ages 5-14 each).`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
