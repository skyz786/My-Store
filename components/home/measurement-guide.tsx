export default function MeasurementGuide() {
  return (
    <section className="container-x py-14">
      <div className="rounded-2xl bg-cream-dark/60 border border-cream-dark p-6 sm:p-10 grid lg:grid-cols-2 gap-8 items-center">
        <div>
          <h2 className="font-display text-2xl sm:text-3xl font-bold">Know the Right Size</h2>
          <p className="mt-3 text-sm text-ink-light leading-relaxed">
            Every product page shows a clear &ldquo;Size &amp; Measurements&rdquo; table for each age, in inches —
            Qameez length, chest, shoulder, sleeve and neck, plus Shalwar length and waist. Simply select
            your child&apos;s age to see exact measurements before you order.
          </p>
        </div>
        <div className="rounded-xl bg-white border border-cream-dark p-5 text-sm">
          <p className="font-semibold text-maroon-600 mb-3">Example — Age 8 Years</p>
          <div className="grid grid-cols-2 gap-y-2 text-ink-light">
            <span>Qameez Length</span><span className="text-ink font-medium">30&quot;</span>
            <span>Chest</span><span className="text-ink font-medium">32&quot;</span>
            <span>Shoulder</span><span className="text-ink font-medium">13&quot;</span>
            <span>Sleeve</span><span className="text-ink font-medium">20&quot;</span>
            <span>Shalwar Length</span><span className="text-ink font-medium">29&quot;</span>
            <span>Waist</span><span className="text-ink font-medium">24&quot;</span>
          </div>
        </div>
      </div>
    </section>
  );
}
