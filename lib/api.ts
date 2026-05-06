import axios, { AxiosError, InternalAxiosRequestConfig } from "axios";

const BASE_URL =
  process.env.NEXT_PUBLIC_API_URL ||
  "https://invdocs-api-production.up.railway.app/api";

// 🔥 Create instance
export const api = axios.create({
  baseURL: BASE_URL,
  timeout: 60000,
});

api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("token");

      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }

    return config;
  },
  (error) => Promise.reject(error)
);

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
        } else if (data.error) {
          message = data.error;
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

      // 🔍 FULL ERROR (buat debug)
      console.error("FULL ERROR OBJECT:", error);

      // 🔐 Auto logout kalau 401
      if (status === 401) {
        localStorage.removeItem("token");
        window.location.href = "/login";
      }

      // 🔥 Return error yang sudah clean
      return Promise.reject({
        status,
        message,
        data,
      });
    }

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

  return api.post(url, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};

// =======================
// 📥 DOWNLOAD FILE
// =======================
export const downloadFile = async (url: string, filename = "file") => {
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

export default api;