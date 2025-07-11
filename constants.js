export const FIELD_TYPE = {
  TEXT_INPUT_ID: "textInputID",
  SELECT_OPTION: "selectOption",
};

export const BASE_URL = "https://app.awsemgift.com";

export const ORDER_STATUS = {
  PENDING: -1,
  PLACED: 0,
  PROCESS: 1,
  ACCEPTED: 2,
  FAILED: 3,
};

export function giftStatus(theme) {
  return {
    "-1": {
      color: theme.colors.secondary,
      label: "Pending",
      info: "Menunggu Pembayaran",
    },
    0: {
      color: theme.colors.tertiary,
      label: "Dibuat",
      info: "Hadiah sudah dibuat, bagikan link ke penerima untuk menerima hadiah",
    },
    1: {
      color: theme.colors.tertiary,
      label: "Proses",
      info: "Hadiah sudah diambil dan akan dikirimkan ke penerima",
    },
    2: {
      color: theme.colors.primary,
      label: "Diterima",
      info: "Hadiah sudah diterima oleh penerima",
    },
    3: {
      color: theme.colors.error,
      label: "Gagal",
      info: "Hadiah gagal dikirimkan ke penerima",
    },
  };
}
