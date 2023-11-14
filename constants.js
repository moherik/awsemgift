export const FIELD_TYPE = {
  TEXT_INPUT_ID: "textInputID",
  SELECT_OPTION: "selectOption",
};

export const BASE_URL = "http://10.0.2.2:3000";

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
