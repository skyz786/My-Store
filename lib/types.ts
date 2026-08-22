// Shared frontend types (kept separate from Prisma's generated types so
// client components never need to import @prisma/client).

export type ProductImageDTO = {
  id: string;
  url: string;
  position: number;
};

export type ProductSizeDTO = {
  id?: string;
  age: number;
  inStock: boolean;
};

export type MeasurementDTO = {
  qameezLength: number;
  chest: number;
  shoulder: number;
  sleeveLength: number;
  neck: number;
  shalwarLength: number;
  waist: number;
  notes?: string | null;
};

export type ProductSizeWithMeasurementDTO = ProductSizeDTO & {
  measurement: MeasurementDTO | null;
};

export type ProductDTO = {
  id: string;
  name: string;
  slug: string;
  description: string;
  price: number;
  discountPrice: number | null;
  sku: string;
  stock: number;
  status: "DRAFT" | "PUBLISHED" | "HIDDEN";
  isFeatured: boolean;
  isNewArrival: boolean;
  images: ProductImageDTO[];
  sizes: ProductSizeDTO[] | ProductSizeWithMeasurementDTO[];
  createdAt?: string;
};

export type CartItemDTO = {
  id: string;
  productId: string;
  age: number;
  quantity: number;
  product: ProductDTO;
};

export type CartDTO = {
  id: string;
  items: CartItemDTO[];
};

export type OrderItemDTO = {
  id: string;
  productId: string;
  productName: string;
  age: number;
  quantity: number;
  unitPrice: number;
};

export type OrderDTO = {
  id: string;
  orderNumber: string;
  customerName: string;
  phone: string;
  address: string;
  city: string;
  province: string;
  subtotal: number;
  deliveryFee: number;
  total: number;
  paymentMethod: "COD" | "EASYPAISA";
  paymentStatus: "PENDING" | "PAID" | "FAILED" | "REFUNDED";
  orderStatus: "PENDING" | "CONFIRMED" | "PROCESSING" | "SHIPPED" | "DELIVERED" | "CANCELLED";
  createdAt: string;
  items: OrderItemDTO[];
};

export type UserDTO = {
  id: string;
  name: string;
  email: string;
  role: "CUSTOMER" | "ADMIN";
};
