const STEPS = [
  { n: "1", title: "Browse & Select", text: "Choose a Qameez Shalwar and select your child's age." },
  { n: "2", title: "Check Measurements", text: "Review the exact size chart for that age before ordering." },
  { n: "3", title: "Add to Cart", text: "Add the item, review your cart and proceed to checkout." },
  { n: "4", title: "Place Order", text: "Pay via Cash on Delivery or contact us on WhatsApp." },
];

export default function HowToOrder() {
  return (
    <section className="bg-white border-y border-cream-dark py-14">
      <div className="container-x">
        <h2 className="font-display text-2xl sm:text-3xl font-bold text-center">How to Order</h2>
        <div className="mt-10 grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {STEPS.map((s) => (
            <div key={s.n} className="text-center px-2">
              <span className="mx-auto flex h-10 w-10 items-center justify-center rounded-full bg-maroon-500 text-white font-semibold mb-4">
                {s.n}
              </span>
              <h3 className="font-semibold text-sm mb-1.5">{s.title}</h3>
              <p className="text-xs text-ink-light leading-relaxed">{s.text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
