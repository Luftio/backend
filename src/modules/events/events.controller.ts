import { Controller, Post, UseGuards, Body } from "@nestjs/common";

import { TbServerGuard } from "src/guards/tb-server.guard";
import { CreateEventFromMeasureDto } from "./dto/event-from-measure.dto";
import { EventsService } from "./events.service";

@Controller("events")
export class EventsController {
  constructor(private eventsService: EventsService) {}

  @Post("createFromMeasure")
  @UseGuards(TbServerGuard)
  async createFromMeasure(@Body() dto: CreateEventFromMeasureDto) {
    await this.eventsService.createEventFromMeasure({
      icon_name: dto.icon_name,
      customer_id: dto.customerId,
      title: dto.title,
      place: dto.place,
      justification: dto.justification,
      threat: dto.threat,
      date: new Date(),
    });
  }
}
