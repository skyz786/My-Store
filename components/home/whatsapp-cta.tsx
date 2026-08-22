import { MessageCircle } from "lucide-react";

export default function WhatsAppCTA() {
  const whatsappNumber = (process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "").replace(/[^0-9]/g, "");
  const message = encodeURIComponent(
    "Assalam o Alaikum, I would like to know more about Kids Store's Qameez Shalwar collection."
  );
  const href = whatsappNumber ? `https://wa.me/${whatsappNumber}?text=${message}` : `https://wa.me/?text=${message}`;

  return (
    <section className="container-x py-14">
      <div className="rounded-2xl bg-[#25D366]/10 border border-[#25D366]/30 p-8 sm:p-10 flex flex-col sm:flex-row items-center justify-between gap-6">
        <div className="text-center sm:text-left">
          <h2 className="font-display text-xl sm:text-2xl font-bold">Prefer to Order on WhatsApp?</h2>
          <p className="text-sm text-ink-light mt-1.5">
            Message Zeeshan directly for quick help choosing the right size or placing your order.
          </p>
        </div>
        <a
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 rounded-lg bg-[#25D366] text-white font-semibold px-6 py-3 text-sm hover:opacity-90 shrink-0"
        >
          <MessageCircle size={18} /> Chat on WhatsApp
        </a>
      </div>
    </section>
  );
}
