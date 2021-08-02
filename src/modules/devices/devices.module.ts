import { Module } from "@nestjs/common";
import { DevicesService } from "./devices.service";
import { DevicesResolver } from "./devices.resolver";
import { ThingsboardModule } from "../thingsboard/thingsboard.module";

@Module({
  imports: [ThingsboardModule],
  providers: [DevicesResolver, DevicesService],
})
export class DevicesModule {}
