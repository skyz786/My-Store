import { notFound } from "next/navigation";
import Link from "next/link";
import { CheckCircle2, MessageCircle } from "lucide-react";
import { prisma } from "@/lib/db";
import { formatPKR } from "@/lib/format";
import { buildWhatsAppLink, orderWhatsAppMessage } from "@/lib/whatsapp";

export const metadata = { title: "Order Placed Successfully" };

export default async function OrderSuccessPage({
  params,
}: {
  params: Promise<{ orderNumber: string }>;
}) {
  const { orderNumber } = await params;
  const order = await prisma.order.findUnique({
    where: { orderNumber },
    include: { items: true },
  });

  if (!order) notFound();

  return (
    <div className="container-x py-14">
      <div className="max-w-2xl mx-auto text-center">
        <span className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-green-100 text-green-600 mb-5">
          <CheckCircle2 size={32} aria-hidden="true" />
        </span>
        <h1 className="font-display text-2xl sm:text-3xl font-bold">Order Placed Successfully</h1>
        <p className="text-sm text-ink-light mt-2">Thank you, {order.customerName}. We&apos;ve received your order.</p>

        <div className="mt-8 rounded-2xl border border-cream-dark bg-white p-6 text-left space-y-4">
          <div className="grid sm:grid-cols-2 gap-3 text-sm">
            <Info label="Order Number" value={order.orderNumber} />
            <Info label="Payment Method" value={order.paymentMethod === "COD" ? "Cash on Delivery" : "Easypaisa"} />
            <Info label="Order Status" value={order.orderStatus} />
            <Info label="Total" value={formatPKR(order.total)} />
          </div>

          <div className="border-t border-cream-dark pt-4">
            <p className="text-xs font-semibold uppercase tracking-wide text-ink-light mb-2">Items</p>
            <div className="space-y-2">
              {order.items.map((item) => (
                <div key={item.id} className="flex justify-between text-sm">
                  <span>
                    {item.productName} x {item.quantity} (Age {item.age})
                  </span>
                  <span>{formatPKR(item.unitPrice * item.quantity)}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="border-t border-cream-dark pt-4">
            <p className="text-xs font-semibold uppercase tracking-wide text-ink-light mb-2">Delivery Information</p>
            <p className="text-sm">
              {order.address}, {order.city}, {order.province}
            </p>
            <p className="text-sm text-ink-light mt-1">Expected delivery: 3-6 working days</p>
          </div>
        </div>

        <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            href="/shop"
            className="rounded-lg bg-maroon-500 text-white font-semibold px-6 py-3 text-sm hover:bg-maroon-600"
          >
            Continue Shopping
          </Link>
          <a
            href={buildWhatsAppLink(orderWhatsAppMessage(order.orderNumber))}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 rounded-lg border border-[#25D366] text-[#25D366] font-semibold px-6 py-3 text-sm hover:bg-[#25D366]/10"
          >
            <MessageCircle size={16} /> Contact us on WhatsApp
          </a>
        </div>
      </div>
    </div>
  );
}

function Info({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-xs text-ink-light">{label}</p>
      <p className="font-medium">{value}</p>
    </div>
  );
}
