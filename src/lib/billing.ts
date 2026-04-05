const IVA_RATE = 0.16;

const moneyFormatter = new Intl.NumberFormat("pt-MZ", {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

export const parseAmountFromLabel = (value: string) => Number(value.replace(/[^\d]/g, ""));

export const calculateInvoiceTotals = (baseAmount: number) => {
  const subtotal = baseAmount;
  const ivaAmount = Number((subtotal * IVA_RATE).toFixed(2));
  const totalAmount = Number((subtotal + ivaAmount).toFixed(2));

  return {
    subtotal,
    ivaRate: IVA_RATE,
    ivaAmount,
    totalAmount,
  };
};

export const formatMt = (value: number) => `${moneyFormatter.format(value)} MT`;

export const nextOriginReference = (origin: "SUB" | "AVU") => {
  const date = new Date();
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  const dateTag = `${y}${m}${d}`;

  const storageKey = `acjl-seq-${origin}-${dateTag}`;
  const previous = Number(window.localStorage.getItem(storageKey) || "0");
  const next = previous + 1;
  window.localStorage.setItem(storageKey, String(next));

  return `${origin}-${dateTag}-${String(next).padStart(5, "0")}`;
};
