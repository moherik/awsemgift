import axios, { HttpStatusCode } from "axios";

const BASE_URL = "http://10.0.2.2:3000";

export async function sender({
  url,
  data = null,
  token = null,
  method = "GET",
}) {
  const headers = {};

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  return await axios({
    url: `${BASE_URL}/${url}`,
    data,
    method,
    headers,
  })
    .then((response) => {
      const data = response.data;
      const status = response.status;

      if (!data) {
        throw new Error("Tidak dapat terhubung ke server");
      }

      return {
        data: data.data,
        message: data.message,
        status: status,
      };
    })
    .catch((error) => {
      console.log(error);

      const errorResponse = error.response;
      if (errorResponse) {
        return { data: errorResponse.data, status: errorResponse.status };
      }

      return {
        data: error?.message,
        status: HttpStatusCode.InternalServerError,
      };
    });
}
