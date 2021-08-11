import { UseGuards } from "@nestjs/common";
import { Resolver, Query, Args, Mutation } from "@nestjs/graphql";
import { CurrentUserJwt, GqlUserJwtQuard } from "src/guards/gql-user-jwt.guard";
import { AchievementsService } from "./achievements.service";
import { Achievement } from "./entities/achievement.entity";

@Resolver(() => Achievement)
export class AchievementsResolver {
  constructor(private readonly achievementsService: AchievementsService) {}

  @UseGuards(GqlUserJwtQuard)
  @Query(() => [Achievement], { name: "achievements" })
  findMy(@CurrentUserJwt() user: any) {
    return this.achievementsService.findMy(user.userId);
  }
}
