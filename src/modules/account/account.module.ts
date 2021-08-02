import { Module } from "@nestjs/common";
import { SequelizeModule } from "@nestjs/sequelize";
import { MailingModule } from "../mailing/mailing.module";
import { ThingsboardModule } from "../thingsboard/thingsboard.module";
import { AccountController } from "./account.controller";
import { AccountResolver } from "./account.resolver";
import { AccountService } from "./account.service";
import { PairingCodes } from "./models/pairing-codes.model";

@Module({
  imports: [
    ThingsboardModule,
    MailingModule,
    SequelizeModule.forFeature([PairingCodes]),
  ],
  controllers: [AccountController],
  providers: [AccountResolver, AccountService],
})
export class AccountModule {}
