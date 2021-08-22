import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/sequelize";
import { EventFromEmployee } from "./entities/event-from-employee.entity";
import { EventFromMeasure } from "./entities/event-from-measure.entity";
import { EventsFromEmployees } from "./models/events-from-employees.model";
import { EventsFromMeasure } from "./models/events-from-measure.model";

@Injectable()
export class EventsService {
  constructor(
    @InjectModel(EventsFromMeasure)
    private eventsFromMeasure: typeof EventsFromMeasure,
    @InjectModel(EventsFromEmployees)
    private eventsFromEmployees: typeof EventsFromEmployees,
  ) {}

  async findAllFromEmployee(customerId: string): Promise<EventFromEmployee[]> {
    const query = await this.eventsFromEmployees.findAll({
      where: { customer_id: customerId },
    });
    return query.map((event) => {
      return {
        ...event.get({ plain: true }),
        is_unread: false,
      };
    });
  }

  async findOneFromEmployee(
    id: string,
    customerId: string,
  ): Promise<EventFromEmployee> {
    const event = await this.eventsFromEmployees.findOne({
      where: { id, customer_id: customerId },
    });
    if (event) {
      return {
        ...event.get({ plain: true }),
        is_unread: false,
      };
    }
    return null;
  }

  async findAllFromMeasure(customerId: string): Promise<EventFromMeasure[]> {
    const query = await this.eventsFromMeasure.findAll({
      where: { customer_id: customerId },
    });
    return query.map((event) => {
      return {
        ...event.get({ plain: true }),
        is_unread: false,
      };
    });
  }

  async findOneFromMeasure(
    id: string,
    customerId: string,
  ): Promise<EventFromMeasure> {
    const event = await this.eventsFromMeasure.findOne({
      where: { id, customer_id: customerId },
    });
    if (event) {
      return {
        ...event.get({ plain: true }),
        is_unread: false,
      };
    }
    return null;
  }

  getUnreadCountFromMesaure(): number {
    return 0;
  }

  getUnreadCountFromEmployees(): number {
    return 0;
  }

  createEventFromMeasure(event: Partial<EventsFromMeasure>) {
    return this.eventsFromMeasure.create(event);
  }
}
