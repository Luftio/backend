import { Module } from "@nestjs/common";
import { EventsService } from "./events.service";
import { EventsResolver } from "./events.resolver";
import { EventsFromMeasure } from "./models/events-from-measure.model";
import { SequelizeModule } from "@nestjs/sequelize";
import { EventsFromEmployees } from "./models/events-from-employees.model";

@Module({
  imports: [
    SequelizeModule.forFeature([EventsFromMeasure, EventsFromEmployees]),
  ],
  providers: [EventsResolver, EventsService],
})
export class EventsModule {}
