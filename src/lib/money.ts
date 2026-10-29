const formatter = new Intl.NumberFormat("en-NG", {
  style: "currency",
  currency: "NGN",
  maximumFractionDigits: 0,
});

export function naira(kobo: number) {
  return formatter.format(kobo / 100);
}

export const RENTAL_DAYS = 30;
export const MIN_TOPUP_NAIRA = 500;
