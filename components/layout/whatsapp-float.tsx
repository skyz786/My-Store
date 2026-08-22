"use client";

import { MessageCircle } from "lucide-react";

export default function WhatsAppFloat() {
  const number = (process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "").replace(/[^0-9]/g, "");
  const message = encodeURIComponent(
    "Assalam o Alaikum, I am interested in Kids Store's Qameez Shalwar collection."
  );
  const href = number ? `https://wa.me/${number}?text=${message}` : `https://wa.me/?text=${message}`;

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat with Kids Store on WhatsApp"
      className="fixed bottom-5 right-5 z-40 flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-lg transition-transform hover:scale-105 focus-visible:scale-105"
    >
      <MessageCircle size={26} fill="white" strokeWidth={0} aria-hidden="true" />
    </a>
  );
}
