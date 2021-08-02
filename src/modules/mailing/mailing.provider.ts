import { ConfigService } from "@nestjs/config";
import { createTransport, Transporter } from "nodemailer";

export const MailingProvider = {
  provide: "MAILING_PROVIDER",
  useFactory: async (configService: ConfigService) => {
    return createTransport({
      host: configService.get("SMTP_HOST"),
      port: 465,
      secure: true,
      auth: {
        user: configService.get("SMTP_USER"),
        pass: configService.get("SMTP_PASS"),
      },
    });
  },
  inject: [ConfigService],
};

export type MailingProviderType = Transporter;
