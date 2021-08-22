import { Module } from "@nestjs/common";
import { EventsModule } from "../events/events.module";
import { NotificationsResolver } from "./notifications.resolver";

@Module({
  imports: [EventsModule],
  providers: [NotificationsResolver],
})
export class NotificationsModule {}
