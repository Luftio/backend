import { Module } from "@nestjs/common";
import { ThingsboardProvider } from "./thingsboard.provider";
import { ThingsboardService } from "./thingsboard.service";

@Module({
  imports: [],
  providers: [ThingsboardProvider, ThingsboardService],
  exports: [ThingsboardService],
})
export class ThingsboardModule {}
