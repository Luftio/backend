import { Injectable, Inject } from "@nestjs/common";
import { AxiosInstance } from "axios";

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
  ) {
    return this.tbProvider
      .post("api/user?sendActivationMail=false", {
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
    return this.tbProvider
      .get("api/user/" + userId + "/activationLink")
      .then((response) => response.data.split("?activateToken=")[1]);
  }

  async activate(activateToken: string, password: string) {
    return this.tbProvider
      .post("api/noauth/activate?sendActivationMail=false", {
        activateToken,
        password,
      })
      .then((response) => response.data);
  }

  async getCustomerUsers(customerId: string) {
    return this.tbProvider
      .get(`api/customer/${customerId}/users?pageSize=10&page=0`)
      .then((response) => response.data);
  }
}
