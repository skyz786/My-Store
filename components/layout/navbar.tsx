"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Menu, X, Search, ShoppingBag, MessageCircle, User } from "lucide-react";
import Logo from "@/components/ui/logo";
import type { UserDTO } from "@/lib/types";

const NAV_LINKS = [
  { href: "/", label: "Home" },
  { href: "/shop", label: "Shop" },
  { href: "/shop?ageGroup=5-8", label: "5–8 Years" },
  { href: "/shop?ageGroup=9-11", label: "9–11 Years" },
  { href: "/shop?ageGroup=12-14", label: "12–14 Years" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [cartCount, setCartCount] = useState(0);
  const [user, setUser] = useState<UserDTO | null>(null);
  const router = useRouter();
  const whatsappNumber = (process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "").replace(/[^0-9]/g, "");

  useEffect(() => {
    fetch("/api/auth/me")
      .then((r) => r.json())
      .then((d) => setUser(d.user))
      .catch(() => {});
  }, []);

  useEffect(() => {
    queueMicrotask(() => {
      if (!user) {
        setCartCount(0);
        return;
      }
      fetch("/api/cart")
        .then((r) => (r.ok ? r.json() : null))
        .then((d) => {
          if (d?.cart) {
            const count = d.cart.items.reduce((sum: number, i: { quantity: number }) => sum + i.quantity, 0);
            setCartCount(count);
          }
        })
        .catch(() => {});
    });
  }, [user]);

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    setSearchOpen(false);
    router.push(`/shop?q=${encodeURIComponent(query)}`);
  }

  return (
    <header className="sticky top-0 z-30 border-b border-cream-dark bg-cream/95 backdrop-blur">
      <div className="container-x flex h-16 items-center justify-between gap-4">
        <Logo />

        <nav className="hidden lg:flex items-center gap-6" aria-label="Primary navigation">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              className="text-sm font-medium text-ink hover:text-maroon-600 transition-colors"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-1 sm:gap-2">
          <button
            aria-label="Search products"
            onClick={() => setSearchOpen((s) => !s)}
            className="p-2 rounded-full hover:bg-cream-dark text-ink"
          >
            <Search size={20} />
          </button>

          <a
            href={
              whatsappNumber
                ? `https://wa.me/${whatsappNumber}`
                : "https://wa.me/"
            }
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Contact Kids Store on WhatsApp"
            className="hidden sm:flex p-2 rounded-full hover:bg-cream-dark text-[#25D366]"
          >
            <MessageCircle size={20} />
          </a>

          <Link
            href={user ? "/account/orders" : "/login"}
            aria-label={user ? "My account" : "Login"}
            className="p-2 rounded-full hover:bg-cream-dark text-ink"
          >
            <User size={20} />
          </Link>

          <Link
            href="/cart"
            aria-label="View cart"
            className="relative p-2 rounded-full hover:bg-cream-dark text-ink"
          >
            <ShoppingBag size={20} />
            {cartCount > 0 && (
              <span className="absolute -top-0.5 -right-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-maroon-500 px-1 text-[10px] font-semibold text-white">
                {cartCount}
              </span>
            )}
          </Link>

          <button
            aria-label={open ? "Close menu" : "Open menu"}
            onClick={() => setOpen((o) => !o)}
            className="lg:hidden p-2 rounded-full hover:bg-cream-dark text-ink"
          >
            {open ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {searchOpen && (
        <div className="border-t border-cream-dark bg-cream">
          <form onSubmit={handleSearch} className="container-x py-3 flex gap-2">
            <input
              autoFocus
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search Qameez Shalwar..."
              className="flex-1 rounded-lg border border-cream-dark bg-white px-4 py-2 text-sm focus:outline-none"
            />
            <button
              type="submit"
              className="rounded-lg bg-maroon-500 px-4 py-2 text-sm font-medium text-white hover:bg-maroon-600"
            >
              Search
            </button>
          </form>
        </div>
      )}

      {open && (
        <nav
          aria-label="Mobile navigation"
          className="lg:hidden border-t border-cream-dark bg-cream px-4 pb-4 pt-2 flex flex-col gap-1"
        >
          {NAV_LINKS.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              onClick={() => setOpen(false)}
              className="py-2.5 text-sm font-medium text-ink hover:text-maroon-600 border-b border-cream-dark last:border-0"
            >
              {link.label}
            </Link>
          ))}
          <a
            href={whatsappNumber ? `https://wa.me/${whatsappNumber}` : "https://wa.me/"}
            target="_blank"
            rel="noopener noreferrer"
            className="py-2.5 text-sm font-medium text-[#25D366] flex items-center gap-2"
          >
            <MessageCircle size={16} /> Order on WhatsApp
          </a>
        </nav>
      )}
    </header>
  );
}
