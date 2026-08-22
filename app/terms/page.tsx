import PolicyLayout from "@/components/policy/policy-layout";

export const metadata = { title: "Terms & Conditions" };

export default function TermsPage() {
  return (
    <PolicyLayout title="Terms &amp; Conditions">
      <p>
        By placing an order with Kids Store, you agree to provide accurate contact and delivery information
        and to accept delivery of the item(s) ordered.
      </p>
      <p>
        Product prices, availability and measurements are as described on the product page at the time of
        order. Kids Store reserves the right to update pricing and availability at any time.
      </p>
      <p className="italic">
        This is placeholder policy text and does not constitute legal advice. The owner should review and
        finalize these terms before going live.
      </p>
    </PolicyLayout>
  );
}
