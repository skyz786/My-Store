import { getStoreSettings } from "@/lib/settings";
import SettingsForm from "@/components/admin/settings-form";

export const metadata = { title: "Store Settings" };

export default async function AdminSettingsPage() {
  const settings = await getStoreSettings();
  return (
    <div>
      <h1 className="font-display text-2xl font-bold mb-6">Store Settings</h1>
      <SettingsForm
        deliveryFee={settings.deliveryFee}
        freeDeliveryThreshold={settings.freeDeliveryThreshold}
      />
      <div className="max-w-xl mt-8 rounded-xl border border-cream-dark bg-white p-6">
        <h2 className="text-sm font-semibold mb-2">WhatsApp Number</h2>
        <p className="text-xs text-ink-light">
          Set via the <code className="bg-cream-dark px-1.5 py-0.5 rounded">NEXT_PUBLIC_WHATSAPP_NUMBER</code>{" "}
          environment variable and redeploy. It is used across the navbar, product pages, checkout and footer.
        </p>
      </div>
    </div>
  );
}
