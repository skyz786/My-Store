export const metadata = { title: "About Us" };

export default function AboutPage() {
  return (
    <div className="container-x py-14">
      <div className="max-w-2xl mx-auto">
        <h1 className="font-display text-3xl font-bold mb-6">About Kids Store</h1>
        <div className="text-sm text-ink-light leading-relaxed space-y-4">
          <p>
            Kids Store is a Pakistani children&apos;s clothing brand founded by tailor Zeeshan, dedicated to
            crafting traditional Qameez Shalwar for boys aged 5 to 14 years.
          </p>
          <p>
            Every outfit is made with careful attention to fit and comfort, blending traditional Pakistani
            style with a clean, modern finish. Zeeshan personally oversees the measurements and tailoring
            for every age group, so parents can order with confidence.
          </p>
          <p>
            Our goal is simple: elegant, well-fitted traditional wear for your little gentlemen, delivered
            reliably across Pakistan.
          </p>
        </div>
      </div>
    </div>
  );
}
