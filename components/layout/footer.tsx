import Link from "next/link";
import { MessageCircle, Phone } from "lucide-react";
import Logo from "@/components/ui/logo";

const FOOTER_LINKS = [
  { href: "/", label: "Home" },
  { href: "/shop", label: "Shop" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
  { href: "/delivery", label: "Delivery" },
  { href: "/returns", label: "Returns" },
  { href: "/privacy", label: "Privacy" },
  { href: "/terms", label: "Terms" },
];

export default function Footer() {
  const whatsappNumber = (process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "").replace(/[^0-9]/g, "");

  return (
    <footer className="border-t border-cream-dark bg-white mt-16">
      <div className="container-x py-12 grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <Logo />
          <p className="mt-4 text-sm text-ink-light max-w-xs">
            Quality children&apos;s Qameez Shalwar, tailored with care.
          </p>
        </div>

        <div>
          <h3 className="text-sm font-semibold text-maroon-600 mb-3">Explore</h3>
          <ul className="space-y-2">
            {FOOTER_LINKS.map((l) => (
              <li key={l.href}>
                <Link href={l.href} className="text-sm text-ink-light hover:text-maroon-600">
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="text-sm font-semibold text-maroon-600 mb-3">Contact</h3>
          <ul className="space-y-2 text-sm text-ink-light">
            <li>Tailor: Zeeshan</li>
            <li className="flex items-center gap-2">
              <Phone size={14} aria-hidden="true" /> +92 3XX XXXXXXX
            </li>
            <li>
              <a
                href={whatsappNumber ? `https://wa.me/${whatsappNumber}` : "https://wa.me/"}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-[#25D366] font-medium"
              >
                <MessageCircle size={14} aria-hidden="true" /> Chat on WhatsApp
              </a>
            </li>
          </ul>
        </div>

        <div>
          <h3 className="text-sm font-semibold text-maroon-600 mb-3">Shop by Age</h3>
          <ul className="space-y-2 text-sm text-ink-light">
            <li>
              <Link href="/shop?ageGroup=5-8" className="hover:text-maroon-600">5–8 Years</Link>
            </li>
            <li>
              <Link href="/shop?ageGroup=9-11" className="hover:text-maroon-600">9–11 Years</Link>
            </li>
            <li>
              <Link href="/shop?ageGroup=12-14" className="hover:text-maroon-600">12–14 Years</Link>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-cream-dark">
        <div className="container-x py-5 text-xs text-ink-light flex flex-col sm:flex-row gap-2 sm:justify-between">
          <span>&copy; {new Date().getFullYear()} Kids Store. All rights reserved.</span>
          <span>Owned &amp; tailored by Zeeshan</span>
        </div>
      </div>
    </footer>
  );
}
