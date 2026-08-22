export default function PolicyLayout({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="container-x py-14">
      <div className="max-w-2xl mx-auto">
        <h1 className="font-display text-3xl font-bold mb-6">{title}</h1>
        <div className="prose prose-sm max-w-none text-sm text-ink-light leading-relaxed space-y-4">{children}</div>
      </div>
    </div>
  );
}
