import Image from "next/image";
import Link from "next/link";

export default function Hero() {
  return (
    <section className="bg-maroon-600 text-white">
      <div className="container-x py-12 sm:py-16 lg:py-20">
        <div className="grid lg:grid-cols-2 gap-10 lg:gap-14 items-center">

          {/* LEFT CONTENT */}
          <div>
            <span className="inline-block bg-yellow-400 text-maroon-900 text-xs sm:text-sm font-semibold px-4 py-2 rounded-full mb-5">
              Boys Age 5–14 Years
            </span>

            <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight">
              Elegant Qameez
              <br />
              Shalwar for Little
              <br />
              Gentlemen
            </h1>

            <p className="mt-5 text-sm sm:text-base text-white/85 max-w-xl leading-relaxed">
              Traditional style, comfortable fitting and carefully tailored
              outfits for boys aged 5 to 14 years.
            </p>

            <div className="flex flex-wrap gap-3 mt-7">
              <Link
                href="/shop"
                className="rounded-lg bg-yellow-400 text-maroon-900 px-5 py-3 text-sm font-semibold hover:bg-yellow-300 transition"
              >
                Shop Collection
              </Link>

              <a
                href="https://wa.me/"
                className="rounded-lg border border-white/50 px-5 py-3 text-sm font-semibold hover:bg-white/10 transition"
              >
                Order on WhatsApp
              </a>
            </div>
          </div>

          {/* RIGHT IMAGE */}
          <div className="relative h-[500px] sm:h-[600px] w-full overflow-hidden rounded-2xl bg-[#ead8c5]">
            <Image
              src="/brand.jpg"
              alt="Kids Qameez Shalwar"
              fill
              priority
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-contain"
            />
          </div>

        </div>
      </div>
    </section>
  );
}