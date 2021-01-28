import { Module } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";

import { ThingsboardService } from "./thingsboard/thingsboard.service";
import { ThingsboardProvider } from "./thingsboard/thingsboard.provider";
import { AccountController } from "./account/account.controller";
import { PushController } from "./push/push.controller";
import { PushService } from "./push/push.service";
import { SequelizeModule } from "@nestjs/sequelize";
import { PushToken } from "./push/push-token.model";

@Module({
  imports: [
    ConfigModule.forRoot({ cache: true }),
    SequelizeModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        dialect: "postgres",
        host: configService.get("DB_HOST"),
        port: configService.get("DB_PORT"),
        username: configService.get("DB_USER"),
        password: configService.get("DB_PASSWORD"),
        database: configService.get("DB_NAME"),
        autoLoadModels: true,
        synchronize: true,
      }),
      inject: [ConfigService],
    }),
    SequelizeModule.forFeature([PushToken]),
  ],
  controllers: [AccountController, PushController],
  providers: [ThingsboardProvider, ThingsboardService, PushService],
})
export class AppModule {}
