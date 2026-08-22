import { z } from "zod";

export const checkoutSchema = z.object({
  customerName: z.string().min(2, "Please enter your full name"),
  phone: z
    .string()
    .min(10, "Enter a valid mobile number")
    .regex(/^[0-9+ -]+$/, "Enter a valid mobile number"),
  whatsapp: z.string().optional().or(z.literal("")),
  address: z.string().min(5, "Please enter your complete address"),
  city: z.string().min(2, "Please enter your city"),
  province: z.string().min(2, "Please select your province"),
  postalCode: z.string().optional().or(z.literal("")),
  notes: z.string().optional().or(z.literal("")),
  paymentMethod: z.enum(["COD", "EASYPAISA"]),
  items: z
    .array(
      z.object({
        productId: z.string().min(1),
        age: z.number().int().min(5).max(14),
        quantity: z.number().int().min(1).max(20),
      })
    )
    .min(1, "Your cart is empty"),
});

export type CheckoutInput = z.infer<typeof checkoutSchema>;
