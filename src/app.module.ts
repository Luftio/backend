import { Module } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { SentryModule } from "@ntegral/nestjs-sentry";
import { LogLevel } from "@sentry/types";
import { GraphQLModule } from "@nestjs/graphql";
import { SequelizeModule } from "@nestjs/sequelize";

import { AccountModule } from "./modules/account/account.module";
import { PushModule } from "./modules/push/push.module";
import { DevicesModule } from "./modules/devices/devices.module";
import { EventsModule } from "./modules/events/events.module";
import { SuggestionsModule } from "./modules/suggestions/suggestions.module";
import { FeedbackModule } from "./modules/feedback/feedback.module";
import { AchievementsModule } from "./modules/achievements/achievements.module";

@Module({
  imports: [
    ConfigModule.forRoot({ cache: true, isGlobal: true }),
    GraphQLModule.forRoot({
      autoSchemaFile: process.cwd() + "/src/schema.gql",
      sortSchema: true,
    }),
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
    SentryModule.forRoot({
      dsn:
        "https://a489692294674b6ebb7fc4e2d12d5674@o550006.ingest.sentry.io/5689314",
      debug: false,
      logLevel: LogLevel.Debug,
    }),

    AccountModule,
    AchievementsModule,
    PushModule,
    DevicesModule,
    EventsModule,
    SuggestionsModule,
    FeedbackModule,
  ],
})
export class AppModule {}
