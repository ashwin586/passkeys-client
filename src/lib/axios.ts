import Axios from "axios";

const axios = Axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_DEV_URL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

axios.interceptors.request.use(
  (config) => {
    const accessToken = localStorage.getItem("access-token");
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// axios.interceptors.response.use(
//   (response) => response,
//   async (error) => {
//     const originalRequest = error.config;

//     if (
//       error.response?.status === 401 &&
//       !originalRequest._retry &&
// !originalRequest.url.includes("/refresh-token")
//     ) {
//       originalRequest._retry = true;
//       try {
//         const response = await Axios.get("/refresh-token", {
//           baseURL: process.env.NEXT_PUBLIC_API_BASE_DEV_URL,
//           withCredentials: true,
//         });
//         const newAccessToken = response.data.token;

//         localStorage.setItem("access-token", newAccessToken);
//         originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
//         console.log("original request", originalRequest);
//         return axios(originalRequest);
//       } catch (err) {
//         console.log(err);
//         localStorage.removeItem("access-token");
//         return Promise.reject(err);
//       }
//     }
//     return Promise.reject(error);
//   }
// );

export default axios;
