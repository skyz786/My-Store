import PolicyLayout from "@/components/policy/policy-layout";

export const metadata = { title: "Returns & Exchanges" };

export default function ReturnsPage() {
  return (
    <PolicyLayout title="Return &amp; Exchange Policy">
      <p>
        If the size doesn&apos;t fit as expected, exchanges are generally accepted within a short window
        after delivery, provided the item is unworn, unwashed and in its original condition.
      </p>
      <p>
        To request an exchange, please contact us on WhatsApp with your order number and we will guide you
        through the process.
      </p>
      <p className="italic">
        This is placeholder policy text. Exact timelines and conditions will be finalized by the owner.
      </p>
    </PolicyLayout>
  );
}
