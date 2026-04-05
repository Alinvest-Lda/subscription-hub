export type MpesaPaymentPayload = {
  amount: number;
  phoneNumber: string;
  accountReference: string;
  transactionDesc: string;
};

export type MpesaPaymentResult = {
  success: boolean;
  message: string;
  transactionId?: string;
};

const normalizePhoneNumber = (phone: string) => {
  const digits = phone.replace(/\D/g, "");

  if (digits.startsWith("258") && digits.length === 12) {
    return digits;
  }

  if (digits.length === 9) {
    return `258${digits}`;
  }

  return digits;
};

export const initiateMpesaPayment = async (payload: MpesaPaymentPayload): Promise<MpesaPaymentResult> => {
  const apiUrl = import.meta.env.VITE_MPESA_API_URL;

  if (!apiUrl) {
    throw new Error("VITE_MPESA_API_URL não configurado.");
  }

  const response = await fetch(apiUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(import.meta.env.VITE_MPESA_API_KEY ? { Authorization: `Bearer ${import.meta.env.VITE_MPESA_API_KEY}` } : {}),
    },
    body: JSON.stringify({
      amount: payload.amount,
      phoneNumber: normalizePhoneNumber(payload.phoneNumber),
      accountReference: payload.accountReference,
      transactionDesc: payload.transactionDesc,
    }),
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    const message = typeof data?.message === "string"
      ? data.message
      : "Não foi possível processar o pagamento M-Pesa.";

    throw new Error(message);
  }

  return {
    success: data?.success ?? true,
    message: data?.message || "Pedido de pagamento M-Pesa enviado com sucesso.",
    transactionId: data?.transactionId || data?.requestId || data?.conversationId,
  };
};
