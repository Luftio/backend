import { Module } from "@nestjs/common";
import { SequelizeModule } from "@nestjs/sequelize";
import { ThingsboardModule } from "../thingsboard/thingsboard.module";
import { PushToken } from "./models/push-token.model";
import { PushController } from "./push.controller";
import { PushResolver } from "./push.resolver";
import { PushService } from "./push.service";

@Module({
  imports: [SequelizeModule.forFeature([PushToken]), ThingsboardModule],
  controllers: [PushController],
  providers: [PushService, PushResolver],
})
export class PushModule {}
