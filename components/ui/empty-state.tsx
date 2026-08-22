import Link from "next/link";
import type { LucideIcon } from "lucide-react";

export default function EmptyState({
  icon: Icon,
  title,
  message,
  actionHref,
  actionLabel,
}: {
  icon: LucideIcon;
  title: string;
  message: string;
  actionHref?: string;
  actionLabel?: string;
}) {
  return (
    <div className="flex flex-col items-center text-center py-16 px-4">
      <span className="flex h-14 w-14 items-center justify-center rounded-full bg-cream-dark text-ink-light mb-4">
        <Icon size={26} aria-hidden="true" />
      </span>
      <h3 className="font-semibold text-lg">{title}</h3>
      <p className="text-sm text-ink-light mt-1.5 max-w-sm">{message}</p>
      {actionHref && actionLabel && (
        <Link
          href={actionHref}
          className="mt-6 rounded-lg bg-maroon-500 text-white text-sm font-medium px-6 py-2.5 hover:bg-maroon-600"
        >
          {actionLabel}
        </Link>
      )}
    </div>
  );
}
