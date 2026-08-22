import { z } from "zod";

export const measurementSchema = z.object({
  age: z.number().int().min(5).max(14),
  inStock: z.boolean().default(true),
  qameezLength: z.number().positive(),
  chest: z.number().positive(),
  shoulder: z.number().positive(),
  sleeveLength: z.number().positive(),
  neck: z.number().positive(),
  shalwarLength: z.number().positive(),
  waist: z.number().positive(),
  notes: z.string().optional(),
});

export const productImageSchema = z.object({
  url: z.string().url(),
  publicId: z.string().min(1),
  position: z.number().int().min(0).default(0),
});

const productFieldsSchema = z.object({
  name: z.string().min(3).max(150),
  description: z.string().min(10),
  price: z.number().int().positive(),
  discountPrice: z.number().int().positive().nullable().optional(),
  sku: z.string().min(3).optional(),
  stock: z.number().int().min(0),
  status: z.enum(["DRAFT", "PUBLISHED", "HIDDEN"]).default("DRAFT"),
  isFeatured: z.boolean().default(false),
  isNewArrival: z.boolean().default(false),
  categoryId: z.string().optional().nullable(),
  images: z.array(productImageSchema).min(1, "At least one product image is required"),
  sizes: z.array(measurementSchema).min(1, "At least one age/size is required"),
});

export const createProductSchema = productFieldsSchema.refine(
  (data) => !data.discountPrice || data.discountPrice < data.price,
  { message: "Discount price must be lower than the regular price", path: ["discountPrice"] }
);

export const updateProductSchema = productFieldsSchema.partial().extend({
  images: z.array(productImageSchema).optional(),
  sizes: z.array(measurementSchema).optional(),
});

export type CreateProductInput = z.infer<typeof createProductSchema>;
