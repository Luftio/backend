import { Injectable, Inject } from "@nestjs/common";
import axios, { AxiosInstance } from "axios";

@Injectable()
export class ThingsboardService {
  constructor(
    @Inject("THINGSBOARD_PROVIDER") private tbProvider: AxiosInstance,
  ) {}

  createUser(
    customerId: string,
    tenantId: string,
    email: string,
    firstName: string,
    lastName: string,
    role: string,
    sendActivationMail: boolean,
  ) {
    return this.tbProvider
      .post("api/user?sendActivationMail=" + sendActivationMail, {
        additionalInfo: {
          description: JSON.stringify({ role }),
          defaultDashboardId: null,
          defaultDashboardFullscreen: false,
        },
        authority: "CUSTOMER_USER",
        customerId: {
          entityType: "CUSTOMER",
          id: customerId,
        },
        tenantId: {
          entityType: "TENANT",
          id: tenantId,
        },
        email,
        firstName,
        lastName,
      })
      .then((response) => response.data);
  }

  async activationLink(userId: string) {
    const response = await this.tbProvider.get(
      "api/user/" + userId + "/activationLink",
    );
    return response.data.split("?activateToken=")[1];
  }

  async activate(activateToken: string, password: string) {
    const response = await this.tbProvider.post(
      "api/noauth/activate?sendActivationMail=false",
      {
        activateToken,
        password,
      },
    );
    return response.data;
  }

  async getCustomerUsers(customerId: string) {
    const response = await this.tbProvider.get(
      `api/customer/${customerId}/users?pageSize=100&page=0`,
    );
    return response.data;
  }

  async getDevices() {
    const response = await this.tbProvider.get(
      "api/tenant/devices?page=0&pageSize=1000&sortProperty=name&sortOrder=desc",
    );
    return response.data;
  }

  async getDevice(deviceId: string) {
    const response = await this.tbProvider.get(
      `https://app.luftio.com/api/device/info/${deviceId}`,
    );
    return response.data;
  }

  async getReadings(deviceId: string) {
    const response = await this.tbProvider.get(
      "api/plugins/telemetry/DEVICE/" + deviceId + "/values/timeseries",
    );
    const data = response.data;
    return {
      co2: Math.round(data.co2[0].value),
      temperature: Math.round(data.temp[0].value * 10) / 10,
      pressure: Math.round(data.pres[0].value / 100),
      humidity: Math.round(data.hum[0].value * 10) / 10,
    };
  }

  async getReadingsTimeseries(
    deviceId: string,
    keys: string,
    startTs: number,
    endTs: number,
    interval: number,
    agg = "AVG",
  ) {
    if (endTs - startTs < 24 * 3600 * 1000) {
      agg = "NONE";
    }
    const limit = "5000";
    const start = +new Date();
    const response = await this.tbProvider.get(
      `api/plugins/telemetry/DEVICE/${deviceId}/values/timeseries?keys=${keys}&startTs=${startTs}&endTs=${endTs}&interval=${interval}&agg=${agg}&limit=${limit}`,
    );
    const duration = start - +new Date();
    console.log(
      `Request api/plugins/telemetry/DEVICE/${deviceId}/values/timeseries?keys=${keys}&startTs=${startTs}&endTs=${endTs}&interval=${interval}&agg=${agg}&limit=${limit} completed in ${duration} ms`,
    );
    return response.data;
  }

  async saveDevice(deviceObject: unknown) {
    const response = await this.tbProvider.post("api/device", deviceObject);
    return response.data;
  }

  async getUser(userId: string) {
    const response = await this.tbProvider.get(`api/user/${userId}`);
    return response.data;
  }

  async getAttributes(deviceId) {
    const response = await this.tbProvider.get(
      "api/plugins/telemetry/DEVICE/" + deviceId + "/values/attributes",
    );
    return response.data;
  }

  async setAttributes(deviceId, attributes) {
    const response = await this.tbProvider.post(
      "api/plugins/telemetry/DEVICE/" + deviceId + "/attributes/SHARED_SCOPE",
      { ...attributes },
    );
    return response.data;
  }

  async changePassword(token, currentPassword, newPassword) {
    const response = await axios.post(
      this.tbProvider.defaults.baseURL + "api/auth/changePassword",
      { currentPassword, newPassword },
      { headers: { "X-Authorization": "Bearer " + token } },
    );
    return response.data;
  }

  async saveUser(userObject: unknown) {
    const response = await this.tbProvider.post(
      `api/user?sendActivationMail=false`,
      userObject,
    );
    return response.data;
  }

  async deleteUser(userId) {
    const response = await this.tbProvider.delete("api/user/" + userId);
    return response.data;
  }
}
