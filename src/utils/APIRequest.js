const isBrowser = () => typeof window !== "undefined";
import { getApiUrl } from "../config/ConfigAPIURL";

const APIRequest = {
  request: function (method, url, body) {
    const sanitizedUrl = getApiUrl(url);

    let config = {
      method: method,
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        authToken: localStorage.getItem("token") || "",
      },
      credentials: "include",
    };

    if (isBrowser()) {
      if (localStorage.getItem("lng")) {
        const lng = JSON.parse(localStorage.getItem("lng"));
        if (lng && lng.code) {
          config.headers["Accept-Language"] = lng.code;
        }
      }

      if (localStorage.getItem("token")) {
        config.headers.authToken = localStorage.getItem("token");
      }
    }

    if (body) {
      config.body = body;
    }

    return fetch(sanitizedUrl, config)
      .then((response) => {
        return response.json();
      })
      .then(this.returnResponse)
      .catch((error) => {
        return { returncode: 0, errors: [{ errormsg: "Timeout Error." }] };
      });
  },

  returnResponse: async function (response) {
    if (response.status !== undefined && response.status !== null) {
      return { returncode: 0, errors: [{ errormsg: response.error }] };
    } else if (response.returncode !== 2) {
      return Promise.resolve(response);
    } else if (response.returncode === 2) {
      window.location.href = "#/login";
    }
  },
};

export default APIRequest;
