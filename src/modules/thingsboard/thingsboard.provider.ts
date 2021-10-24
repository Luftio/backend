import { ConfigService } from "@nestjs/config";
import axios, { AxiosInstance } from "axios";

export const ThingsboardProvider = {
  provide: "THINGSBOARD_PROVIDER",
  useFactory: async (configService: ConfigService) => {
    const baseURL = configService.get("TB_BASE_URL");

    const username = configService.get("TB_USER");
    const password = configService.get("TB_PASSWORD");

    const instance = axios.create({
      baseURL,
      timeout: 10000,
    });
    async function getToken() {
      console.log("Refreshing token");
      const response = await axios.post(baseURL + "api/auth/login", {
        username,
        password,
      });
      instance.defaults.headers.common["X-Authorization"] =
        "Bearer " + response.data.token;
    }
    await getToken();
    instance.interceptors.response.use(
      (response) => response,
      (error) => {
        const status = error.response ? error.response.status : null;
        if (status === 401 && error.config.headers["X-Auth-Type"] !== "user") {
          const originalRequest = error.config;
          return getToken().then(() => instance(originalRequest));
        }
        return Promise.reject(error);
      },
    );
    return instance;
  },
  inject: [ConfigService],
};
