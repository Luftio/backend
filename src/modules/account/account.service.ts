import { Injectable } from "@nestjs/common";
import { MailingService } from "../mailing/mailing.service";
import { ThingsboardService } from "../thingsboard/thingsboard.service";
import { Account } from "./entities/account.entity";

@Injectable()
export class AccountService {
  constructor(
    private thingsboardService: ThingsboardService,
    private mailingService: MailingService,
  ) {}

  async findMy(userId: string): Promise<Account> {
    const response = await this.thingsboardService.getUser(userId);
    return {
      id: response.id.id,
      first_name: response.firstName,
      last_name: response.lastName,
      email: response.email,
    };
  }
}
