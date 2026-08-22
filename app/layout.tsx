import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/layout/navbar";
import Footer from "@/components/layout/footer";
import WhatsAppFloat from "@/components/layout/whatsapp-float";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://kidsstore.example.com";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Kids Store | Kids Qameez Shalwar",
    template: "%s | Kids Store",
  },
  description:
    "Shop beautifully tailored children's Qameez Shalwar for boys aged 5 to 14 years. Traditional style, comfortable fitting, carefully tailored by Zeeshan.",
  keywords: [
    "kids qameez shalwar",
    "boys qameez shalwar",
    "children traditional wear Pakistan",
    "kids eid dress",
    "boys shalwar kameez",
  ],
  openGraph: {
    title: "Kids Store | Kids Qameez Shalwar",
    description: "Elegant, tailored Qameez Shalwar for boys aged 5 to 14 years.",
    url: SITE_URL,
    siteName: "Kids Store",
    locale: "en_PK",
    type: "website",
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full flex flex-col bg-(--color-cream) text-(--color-ink)">
        <Navbar />
        <main className="flex-1">{children}</main>
        <Footer />
        <WhatsAppFloat />
      </body>
    </html>
  );
}
