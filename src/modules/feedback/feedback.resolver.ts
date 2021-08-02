import { Resolver, Query, Mutation, Args, ID, Int } from "@nestjs/graphql";
import { FeedbackService } from "./feedback.service";
import { Feedback } from "./entities/feedback.entity";
import { UseGuards } from "@nestjs/common";
import { CurrentUserJwt, GqlUserJwtQuard } from "src/guards/gql-user-jwt.guard";

@Resolver(() => Feedback)
export class FeedbackResolver {
  constructor(private readonly feedbackService: FeedbackService) {}

  @UseGuards(GqlUserJwtQuard)
  @Query(() => [Feedback], { name: "feedbacks" })
  findAll(@CurrentUserJwt() user: any) {
    return this.feedbackService.findAll(user.customerId);
  }

  @UseGuards(GqlUserJwtQuard)
  @Query(() => Feedback, { name: "feedback" })
  findOne(
    @CurrentUserJwt() user: any,
    @Args("id", { type: () => ID }) id: string,
  ) {
    return this.feedbackService.findOne(id, user.customerId);
  }

  @UseGuards(GqlUserJwtQuard)
  @Query(() => Int, { name: "feedback_unread_count" })
  getUnreadCount(@CurrentUserJwt() user: any) {
    return this.feedbackService.getUnreadCount();
  }
}
