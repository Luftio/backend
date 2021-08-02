import { Resolver, Query, Mutation, Args, ID, Int } from "@nestjs/graphql";
import { SuggestionsService } from "./suggestions.service";
import { Suggestion } from "./entities/suggestion.entity";
import { CurrentUserJwt, GqlUserJwtQuard } from "src/guards/gql-user-jwt.guard";
import { UseGuards } from "@nestjs/common";

@Resolver(() => Suggestion)
export class SuggestionsResolver {
  constructor(private readonly suggestionsService: SuggestionsService) {}

  @UseGuards(GqlUserJwtQuard)
  @Query(() => [Suggestion], { name: "suggestions" })
  findAll(@CurrentUserJwt() user: any) {
    return this.suggestionsService.findAll(user.customerId);
  }

  @UseGuards(GqlUserJwtQuard)
  @Query(() => Suggestion, { name: "suggestion" })
  findOne(
    @CurrentUserJwt() user: any,
    @Args("id", { type: () => ID }) id: string,
  ) {
    return this.suggestionsService.findOne(id, user.customerId);
  }

  @UseGuards(GqlUserJwtQuard)
  @Query(() => Int, { name: "suggestions_unread_count" })
  getUnreadCount(@CurrentUserJwt() user: any) {
    return this.suggestionsService.getUnreadCount();
  }
}
