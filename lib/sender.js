import axios from "axios";

const BASE_URL = "http://10.0.2.2:3000";

export async function sender({ url, data = null, method = "GET" }) {
  return await axios({
    url: `${BASE_URL}/${url}`,
    data,
    method,
  })
    .then((response) => ({ data: response.data, status: response.status }))
    .catch((error) => {
      const errorResponse = error.response;
      if (errorResponse) {
        return { data: errorResponse.data, status: errorResponse.status };
      }

      return null;
    });
}
