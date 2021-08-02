import { Resolver, Query, Mutation, Args } from "@nestjs/graphql";

import { PushService } from "./push.service";
import { CurrentUserJwt, GqlUserJwtQuard } from "src/guards/gql-user-jwt.guard";
import { UseGuards } from "@nestjs/common";

@Resolver()
export class PushResolver {
  constructor(private readonly pushService: PushService) {}

  @UseGuards(GqlUserJwtQuard)
  @Mutation((returns) => Boolean)
  async updateToken(@CurrentUserJwt() user: any, @Args("token") token: string) {
    const userId = user.userId;
    try {
      await this.pushService.insertToken(userId, token);
    } catch (error) {
      // Don't pass errors to client
      console.log(error);
    }
    return true;
  }
}
