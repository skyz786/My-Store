// WhatsApp deep-link helpers. Number is configured via env, never hardcoded in UI.
export function getWhatsAppNumber() {
  // Digits only, country code included, no leading + (as WhatsApp's wa.me expects)
  return (process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "").replace(/[^0-9]/g, "");
}

export function buildWhatsAppLink(message: string) {
  const number = getWhatsAppNumber();
  const encoded = encodeURIComponent(message);
  return number ? `https://wa.me/${number}?text=${encoded}` : `https://wa.me/?text=${encoded}`;
}

export function productWhatsAppMessage(params: {
  productName: string;
  age?: number;
  price: number;
}) {
  const { productName, age, price } = params;
  const agePart = age ? `, Age ${age} Years` : "";
  return `Assalam o Alaikum, I am interested in ${productName}${agePart}, Price Rs. ${price.toLocaleString(
    "en-PK"
  )}.`;
}

export function orderWhatsAppMessage(orderNumber: string) {
  return `Assalam o Alaikum, I have a question about my order ${orderNumber}.`;
}
