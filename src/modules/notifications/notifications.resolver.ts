import {
  Resolver,
  Query,
  Mutation,
  Args,
  ID,
  Int,
  createUnionType,
} from "@nestjs/graphql";
import { UseGuards } from "@nestjs/common";
import { CurrentUserJwt, GqlUserJwtQuard } from "src/guards/gql-user-jwt.guard";
import { EventFromMeasure } from "../events/entities/event-from-measure.entity";
import { GenericNotification } from "./entities/generic-notification.entity";
import { EventsService } from "../events/events.service";

export const ResultUnion = createUnionType({
  name: "NotificationsUnion",
  types: () => [EventFromMeasure, GenericNotification],
});

@Resolver()
export class NotificationsResolver {
  constructor(private eventsService: EventsService) {}
  @UseGuards(GqlUserJwtQuard)
  @Query(() => [ResultUnion], { name: "notifications" })
  async notifications(
    @CurrentUserJwt() user: any,
  ): Promise<Array<typeof ResultUnion>> {
    const allNotifications: Array<typeof ResultUnion> = [
      ...(await this.eventsService.findAllFromMeasure(user.customerId)),
      Object.assign(new GenericNotification(), {
        id: "1",
        title: "Vítejte v Luftio!",
        text:
          "Děkujeme za Vaši podporu a přejeme Vám mnoho zdravých dnů s naším senzorem",
        date: new Date("2021-08-16T10:00"),
      }),
    ];
    allNotifications.sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
    );
    return allNotifications;
  }
}
