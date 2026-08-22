import PolicyLayout from "@/components/policy/policy-layout";

export const metadata = { title: "Privacy Policy" };

export default function PrivacyPage() {
  return (
    <PolicyLayout title="Privacy Policy">
      <p>
        Kids Store collects only the information needed to process your order — your name, contact number,
        and delivery address. We do not sell or share your personal information with third parties beyond
        what is required to deliver your order.
      </p>
      <p>
        Payment information, where applicable, is handled through secure, industry-standard methods and is
        never stored in plain text.
      </p>
      <p className="italic">
        This is placeholder policy text and does not constitute legal advice. The owner should review and
        finalize this policy before going live.
      </p>
    </PolicyLayout>
  );
}
