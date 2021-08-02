import { Inject, Injectable } from "@nestjs/common";
import { MailingProviderType } from "./mailing.provider";
import Handlebars from "handlebars";
import * as fs from "fs";
import { join } from "path";

@Injectable()
export class MailingService {
  constructor(
    @Inject("MAILING_PROVIDER") private mailing: MailingProviderType,
  ) {}

  async sendMail(to, subject, html) {
    return await this.mailing.sendMail({
      from: '"Luftio" <info@luftio.cz>',
      to,
      subject,
      html,
    });
  }

  async sendTemplate(to, subject, template, data) {
    const source = fs.readFileSync(
      join(__dirname.replace("dist", "src"), "templates", template),
      "utf8",
    );
    const html = Handlebars.compile(source)(data);
    return await this.sendMail(to, subject, html);
  }

  async sendTest() {
    return await this.sendTemplate(
      "t.martykan@gmail.com",
      "Vítejte",
      "cs/welcome.html",
      { url: "https://dashboard.luftio.com/ " },
    );
  }
}
