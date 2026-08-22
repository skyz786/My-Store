export function formatPKR(amount: number) {
  return `Rs. ${amount.toLocaleString("en-PK")}`;
}

export function generateOrderNumber() {
  const date = new Date();
  const y = date.getFullYear().toString().slice(-2);
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  const rand = Math.floor(1000 + Math.random() * 9000);
  return `KS-${y}${m}${d}-${rand}`;
}

export function generateSku(name: string) {
  const base = name
    .toUpperCase()
    .replace(/[^A-Z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "")
    .slice(0, 20);
  return `${base}-${Math.floor(1000 + Math.random() * 9000)}`;
}
