import { Ruler, ShieldCheck, Truck, HeartHandshake } from "lucide-react";

const POINTS = [
  { icon: Ruler, title: "Precise Measurements", text: "Exact age-wise tailoring measurements for a proper fit, not guesswork." },
  { icon: ShieldCheck, title: "Quality Fabric", text: "Comfortable, breathable fabric chosen for everyday wear and special occasions." },
  { icon: Truck, title: "Reliable Delivery", text: "Careful packaging and dependable delivery across Pakistan." },
  { icon: HeartHandshake, title: "Personal Tailoring Touch", text: "Made with the care of a real tailor, Zeeshan, not a mass factory line." },
];

export default function WhyChooseUs() {
  return (
    <section className="bg-white border-y border-cream-dark py-14">
      <div className="container-x">
        <h2 className="font-display text-2xl sm:text-3xl font-bold text-center">Why Choose Kids Store</h2>
        <div className="mt-10 grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {POINTS.map((p) => (
            <div key={p.title} className="text-center px-2">
              <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-maroon-50 text-maroon-600 mb-4">
                <p.icon size={22} aria-hidden="true" />
              </span>
              <h3 className="font-semibold text-sm mb-1.5">{p.title}</h3>
              <p className="text-xs text-ink-light leading-relaxed">{p.text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
