import { format } from "date-fns";

export function currency(value) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumSignificantDigits: 3,
  }).format(value);
}

export function dateFormat(dateStr, dateFormat) {
  return format(new Date(dateStr), dateFormat);
}
