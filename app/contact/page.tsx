import { MessageCircle, Phone, MapPin } from "lucide-react";

export const metadata = { title: "Contact Us" };

export default function ContactPage() {
  const whatsappNumber = (process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "").replace(/[^0-9]/g, "");

  return (
    <div className="container-x py-14">
      <div className="max-w-2xl mx-auto">
        <h1 className="font-display text-3xl font-bold mb-6">Contact Us</h1>
        <p className="text-sm text-ink-light mb-8">
          Have a question about sizing, an order, or a custom request? Reach out to Zeeshan directly.
        </p>
        <div className="space-y-4">
          <div className="flex items-start gap-3 rounded-xl border border-cream-dark bg-white p-5">
            <MessageCircle className="text-[#25D366] mt-0.5" size={20} aria-hidden="true" />
            <div>
              <p className="text-sm font-semibold">WhatsApp</p>
              <a
                href={whatsappNumber ? `https://wa.me/${whatsappNumber}` : "https://wa.me/"}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-maroon-600 hover:underline"
              >
                Chat with us
              </a>
            </div>
          </div>
          <div className="flex items-start gap-3 rounded-xl border border-cream-dark bg-white p-5">
            <Phone className="text-maroon-500 mt-0.5" size={20} aria-hidden="true" />
            <div>
              <p className="text-sm font-semibold">Phone</p>
              <p className="text-sm text-ink-light">+92 3XX XXXXXXX</p>
            </div>
          </div>
          <div className="flex items-start gap-3 rounded-xl border border-cream-dark bg-white p-5">
            <MapPin className="text-maroon-500 mt-0.5" size={20} aria-hidden="true" />
            <div>
              <p className="text-sm font-semibold">Location</p>
              <p className="text-sm text-ink-light">Pakistan (exact address to be added by the owner)</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
