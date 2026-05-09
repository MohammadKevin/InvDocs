import axios, {
  AxiosError,
  InternalAxiosRequestConfig,
} from "axios";

const BASE_URL =
  process.env.NEXT_PUBLIC_API_URL ||
  "https://invdocs-api-production.up.railway.app/api";

// =======================
// 🔥 AXIOS INSTANCE
// =======================
export const api = axios.create({
  baseURL: BASE_URL,
  timeout: 60000,
});

// =======================
// 📤 REQUEST INTERCEPTOR
// =======================
api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    if (typeof window !== "undefined") {
      const token =
        localStorage.getItem("access_token") ||
        localStorage.getItem("token");

      console.log("JWT TOKEN:", token);

      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// =======================
// 📥 RESPONSE INTERCEPTOR
// =======================
api.interceptors.response.use(
  (response) => response,

  (error: AxiosError<any>) => {
    if (typeof window !== "undefined") {
      const status = error.response?.status;

      const data = error.response?.data;

      let message = "Terjadi kesalahan";

      if (data) {
        if (typeof data.message === "string") {
          message = data.message;
        } else if (Array.isArray(data.message)) {
          message = data.message.join(", ");
        } else if ((data as any).error) {
          message = (data as any).error;
        }
      } else if (error.message) {
        message = error.message;
      }

      console.error("API ERROR DETAIL:", {
        status,
        message,
        data,
        url: error.config?.url,
        method: error.config?.method,
      });

      console.error("FULL ERROR OBJECT:", error);

      // =======================
      // 🔐 AUTO LOGOUT
      // =======================
      if (status === 401) {
        localStorage.removeItem("access_token");
        localStorage.removeItem("token");

        alert("Session expired, silakan login ulang");

        window.location.href = "/login";
      }
    }

    // 🔥 RETURN ERROR ASLI AXIOS
    return Promise.reject(error);
  }
);

// =======================
// 📤 UPLOAD FILE
// =======================
export const uploadFile = async (
  url: string,
  file: File,
  extraData?: Record<string, any>
) => {
  const formData = new FormData();

  formData.append("file", file);

  if (extraData) {
    Object.keys(extraData).forEach((key) => {
      formData.append(key, extraData[key]);
    });
  }

  return api.post(url, formData);
};

// =======================
// 📥 DOWNLOAD FILE
// =======================
export const downloadFile = async (
  url: string,
  filename = "file"
) => {
  const res = await api.get(url, {
    responseType: "blob",
  });

  const blob = new Blob([res.data]);

  const link = document.createElement("a");

  link.href = window.URL.createObjectURL(blob);

  link.download = filename;

  document.body.appendChild(link);

  link.click();

  link.remove();
};

api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    if (typeof window !== "undefined") {
      const token =
        localStorage.getItem("access_token") ||
        localStorage.getItem("token");

      console.log("TOKEN:", token);

      console.log("REQUEST URL:", config.url);

      console.log(
        "AUTH HEADER BEFORE:",
        config.headers.Authorization
      );

      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }

      console.log(
        "AUTH HEADER AFTER:",
        config.headers.Authorization
      );
    }

    return config;
  },
  (error) => Promise.reject(error)
);

export default api;