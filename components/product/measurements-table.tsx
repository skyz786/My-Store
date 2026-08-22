import type { MeasurementDTO } from "@/lib/types";

export default function MeasurementsTable({ age, measurement }: { age: number; measurement: MeasurementDTO }) {
  return (
    <div className="rounded-xl border border-cream-dark bg-cream-dark/40 p-5">
      <p className="text-sm font-semibold text-maroon-600 mb-4">Age {age} Years — Size &amp; Measurements (inches)</p>
      <div className="grid sm:grid-cols-2 gap-6">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-ink-light mb-2">Qameez</p>
          <dl className="space-y-1.5 text-sm">
            <Row label="Length" value={measurement.qameezLength} />
            <Row label="Chest" value={measurement.chest} />
            <Row label="Shoulder" value={measurement.shoulder} />
            <Row label="Sleeve" value={measurement.sleeveLength} />
            <Row label="Neck" value={measurement.neck} />
          </dl>
        </div>
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-ink-light mb-2">Shalwar</p>
          <dl className="space-y-1.5 text-sm">
            <Row label="Length" value={measurement.shalwarLength} />
            <Row label="Waist" value={measurement.waist} />
          </dl>
        </div>
      </div>
      {measurement.notes && <p className="mt-4 text-xs text-ink-light">{measurement.notes}</p>}
    </div>
  );
}

function Row({ label, value }: { label: string; value: number }) {
  return (
    <div className="flex justify-between border-b border-cream-dark/70 pb-1.5">
      <dt className="text-ink-light">{label}</dt>
      <dd className="font-medium text-ink">{value}&quot;</dd>
    </div>
  );
}
