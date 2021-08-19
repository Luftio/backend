import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from "@nestjs/common";
import * as jwt from "jsonwebtoken";
import { Z_STREAM_ERROR } from "zlib";

import { MailingService } from "../mailing/mailing.service";
import { ThingsboardService } from "../thingsboard/thingsboard.service";
import { Account } from "./entities/account.entity";

@Injectable()
export class AccountService {
  constructor(
    private thingsboardService: ThingsboardService,
    private mailingService: MailingService,
  ) {}

  private processDescription(
    response: any,
  ): Pick<Account, "role" | "pending_invitation"> {
    try {
      const data = JSON.parse(response.additionalInfo.description);
      if (data) {
        return {
          role: data.role,
          pending_invitation:
            response.first_name == "" && response.last_name == "",
        };
      }
    } catch (error) {
      // Invalid
    }
    return {
      role: "user",
      pending_invitation: false,
    };
  }

  async findMy(userId: string): Promise<Account> {
    const response = await this.thingsboardService.getUser(userId);
    return {
      id: response.id.id,
      first_name: response.firstName,
      last_name: response.lastName,
      email: response.email,
      ...this.processDescription(response),
    };
  }

  async findAll(customerId: string): Promise<Account[]> {
    const response = await this.thingsboardService.getCustomerUsers(customerId);
    return response.data.map((it) => ({
      id: it.id.id,
      first_name: it.firstName,
      last_name: it.lastName,
      email: it.email,
      ...this.processDescription(it),
    }));
  }

  async changePassword(token, currentPassword, newPassword) {
    try {
      await this.thingsboardService.changePassword(
        token,
        currentPassword,
        newPassword,
      );
      return true;
    } catch (error) {
      console.log(error.response.status);
      if (error.response.status == 401) {
        throw "invalid_password";
      } else if (error.response.status == 400) {
        console.log(error.response.data);
        throw "invalid_password";
      }
      return false;
    }
  }

  async changeAccountDetails(userId, firstName, lastName, email) {
    const user = await this.thingsboardService.getUser(userId);
    user.firstName = firstName;
    user.lastName = lastName;
    user.email = email;
    await this.thingsboardService.saveUser(user);
    return true;
  }

  async inviteUser(customerId, email, role) {
    const tenantId = "51b74e40-3267-11eb-bcfe-270ee9414f1a"; // Luftio

    let userId;
    try {
      const createResponse = await this.thingsboardService.createUser(
        customerId,
        tenantId,
        email,
        "",
        "",
        role,
      );
      userId = createResponse.id.id;
    } catch (error) {
      console.log(error.response.data);
      if (error?.response?.data?.errorCode == 31) {
        throw new BadRequestException("user_exists");
      }
      throw error;
    }
    const activationKey = await this.thingsboardService.activationLink(userId);
    console.log(activationKey);
    await this.mailingService.sendTemplateWelcome(email, activationKey);
  }

  async acceptInvite(
    token: string,
    firstName: string,
    lastName: string,
    password: string,
  ) {
    const response = await this.thingsboardService.activate(token, password);
    const decoded = jwt.decode(response.token);
    const user = await this.thingsboardService.getUser(decoded.userId);
    user.firstName = firstName;
    user.lastName = lastName;
    await this.thingsboardService.saveUser(user);
    return response;
  }

  async deleteUser(customerId: string, userId: string) {
    const user = await this.thingsboardService.getUser(userId);
    if (user.customerId.id != customerId) throw new UnauthorizedException();
    await this.thingsboardService.deleteUser(userId);
  }

  async changeRole(customerId: string, userId: string, role: string) {
    const user = await this.thingsboardService.getUser(userId);
    if (user.customerId.id != customerId) throw new UnauthorizedException();
    let existingDescription = {};
    try {
      existingDescription = JSON.parse(user.additionalInfo.description);
    } catch (error) {
      // Ignored
    }
    user.additionalInfo.description = JSON.stringify({
      ...existingDescription,
      role,
    });
    await this.thingsboardService.saveUser(user);
  }
}
