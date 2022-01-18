import { UseGuards } from "@nestjs/common";
import { Resolver, Query, Mutation, Args, ID, Int } from "@nestjs/graphql";
import { CurrentUserJwt, GqlUserJwtQuard } from "src/guards/gql-user-jwt.guard";
import { EventFromEmployee } from "./entities/event-from-employee.entity";
import { EventFromMeasure } from "./entities/event-from-measure.entity";
import { EventsService } from "./events.service";

@Resolver()
export class EventsResolver {
  constructor(private readonly eventsService: EventsService) {}

  @UseGuards(GqlUserJwtQuard)
  @Query(() => [EventFromEmployee], { name: "events_from_employee" })
  findAllFromEmployee(@CurrentUserJwt() user: any) {
    console.log(user.customerId);
    return this.eventsService.findAllFromEmployee(user.customerId);
  }

  @UseGuards(GqlUserJwtQuard)
  @Query(() => EventFromEmployee, { name: "event_from_employee" })
  findOneFromEmployee(
    @CurrentUserJwt() user: any,
    @Args("id", { type: () => ID }) id: string,
  ) {
    return this.eventsService.findOneFromEmployee(id, user.customerId);
  }

  @UseGuards(GqlUserJwtQuard)
  @Query(() => [EventFromMeasure], { name: "events_from_measure" })
  findAllFromMeasure(@CurrentUserJwt() user: any) {
    return this.eventsService.findAllFromMeasure(user.customerId);
  }

  @UseGuards(GqlUserJwtQuard)
  @Query(() => EventFromMeasure, { name: "event_from_measure" })
  findOneFromMeasure(
    @CurrentUserJwt() user: any,
    @Args("id", { type: () => ID }) id: string,
  ) {
    return this.eventsService.findOneFromMeasure(id, user.customerId);
  }

  @UseGuards(GqlUserJwtQuard)
  @Query(() => Int, { name: "events_unread_count" })
  unreadCount(@CurrentUserJwt() user: any) {
    return (
      this.eventsService.getUnreadCountFromEmployees() +
      this.eventsService.getUnreadCountFromMesaure()
    );
  }

  @UseGuards(GqlUserJwtQuard)
  @Query(() => Int, { name: "events_from_employees_unread_count" })
  unreadCountFromEmployees(@CurrentUserJwt() user: any) {
    return this.eventsService.getUnreadCountFromEmployees();
  }

  @UseGuards(GqlUserJwtQuard)
  @Query(() => Int, { name: "events_from_measure_unread_count" })
  unreadCountFromMesaure(@CurrentUserJwt() user: any) {
    return this.eventsService.getUnreadCountFromMesaure();
  }
}
