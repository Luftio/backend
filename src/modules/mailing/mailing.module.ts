import { Module } from "@nestjs/common";
import { MailingProvider } from "./mailing.provider";
import { MailingService } from "./mailing.service";

@Module({
  providers: [MailingProvider, MailingService],
  exports: [MailingService],
})
export class MailingModule {}
