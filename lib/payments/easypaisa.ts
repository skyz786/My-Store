// Easypaisa payment service abstraction.
//
// IMPORTANT: This is a clean, ready-to-wire integration point, NOT a working
// gateway. Easypaisa merchant credentials are not available yet. Nothing in
// this file (or anywhere else in the app) ever marks a payment as PAID
// without a real, verified response from Easypaisa. Until credentials are
// added to the environment, `isEasypaisaConfigured()` returns false and the
// checkout UI disables the Easypaisa option, falling back to COD.

export function isEasypaisaConfigured() {
  return Boolean(
    process.env.EASYPAISA_MERCHANT_ID &&
      process.env.EASYPAISA_API_KEY &&
      process.env.EASYPAISA_SECRET
  );
}

export type InitiatePaymentInput = {
  orderNumber: string;
  amount: number; // PKR
  customerPhone: string;
};

export type InitiatePaymentResult = {
  success: boolean;
  redirectUrl?: string;
  transactionId?: string;
  error?: string;
};

// Starts an Easypaisa transaction. Replace the body of this function with a
// real call to Easypaisa's merchant API once EASYPAISA_MERCHANT_ID,
// EASYPAISA_API_KEY and EASYPAISA_SECRET are set in the environment.
export async function initiateEasypaisaPayment(
  input: InitiatePaymentInput
): Promise<InitiatePaymentResult> {
  if (!isEasypaisaConfigured()) {
    return {
      success: false,
      error:
        "Easypaisa is not configured yet. Add EASYPAISA_MERCHANT_ID, EASYPAISA_API_KEY and EASYPAISA_SECRET to enable online payments.",
    };
  }

  console.info("Easypaisa payment requested (not yet wired to a real gateway):", input.orderNumber, input.amount);

  // TODO: call the real Easypaisa merchant API here and return its
  // redirect URL / transaction id. Never fabricate a success response.
  return {
    success: false,
    error: "Easypaisa integration is configured but not yet implemented.",
  };
}

// Verifies a callback/webhook from Easypaisa before ever marking an order
// as PAID. Must be implemented against Easypaisa's real signature/verification
// scheme before this payment method can be trusted in production.
export async function verifyEasypaisaCallback(
  payload: unknown
): Promise<{ verified: boolean; transactionId?: string }> {
  if (!isEasypaisaConfigured()) {
    return { verified: false };
  }
  console.info("Easypaisa callback received (verification not yet implemented):", payload);
  // TODO: verify signature/hash against EASYPAISA_SECRET per Easypaisa docs.
  return { verified: false };
}
