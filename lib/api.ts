import axios, { AxiosError } from "axios";

const BASE_URL =
  process.env.NEXT_PUBLIC_API_URL ||
  "https://invdocs-api-production.up.railway.app/api";

export const api = axios.create({
  baseURL: BASE_URL,
  timeout: 15000,
});

api.interceptors.request.use(
  (config) => {
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

      if (status === 401) {
        localStorage.removeItem("token");
        window.location.href = "/login";
      }

      // optional: tampilkan error message dari backend
      console.error("API ERROR:", error.response?.data || error.message);
    }

    return Promise.reject(error);
  }
);

export default api;

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

export const downloadFile = async (url: string) => {
  const res = await api.get(url, {
    responseType: "blob",
  });

  const blob = new Blob([res.data]);
  const link = document.createElement("a");

  link.href = window.URL.createObjectURL(blob);
  link.download = "file";

  document.body.appendChild(link);
  link.click();
  link.remove();
};