import PolicyLayout from "@/components/policy/policy-layout";

export const metadata = { title: "Delivery Policy" };

export default function DeliveryPage() {
  return (
    <PolicyLayout title="Delivery Policy">
      <p>
        Orders are typically processed and dispatched within 2–4 working days. Delivery across Pakistan is
        handled through trusted courier partners and generally takes 3–6 working days depending on your
        location.
      </p>
      <p>
        Delivery charges are calculated at checkout and may be waived for orders above a threshold set by
        Kids Store. You can review the exact delivery fee before placing your order.
      </p>
      <p className="italic">
        This is placeholder policy text. The owner can update exact delivery timelines and areas once finalized.
      </p>
    </PolicyLayout>
  );
}
