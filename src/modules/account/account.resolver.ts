import { UseGuards } from "@nestjs/common";
import { Resolver, Query, Args, Mutation } from "@nestjs/graphql";
import { CurrentUserJwt, GqlUserJwtQuard } from "src/guards/gql-user-jwt.guard";
import { AccountService } from "./account.service";
import { Account } from "./entities/account.entity";

@Resolver(() => Account)
export class AccountResolver {
  constructor(private readonly accountService: AccountService) {}

  @UseGuards(GqlUserJwtQuard)
  @Query(() => Account, { name: "account" })
  findMy(@CurrentUserJwt() user: any) {
    return this.accountService.findMy(user.userId);
  }
}
