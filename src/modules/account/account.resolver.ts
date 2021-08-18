import { UnauthorizedException, UseGuards } from "@nestjs/common";
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

  @UseGuards(GqlUserJwtQuard)
  @Query(() => [Account], { name: "accounts" })
  findAll(@CurrentUserJwt() user: any) {
    return this.accountService.findAll(user.customerId);
  }

  @UseGuards(GqlUserJwtQuard)
  @Mutation(() => Boolean, { name: "changePassword" })
  changePassword(
    @CurrentUserJwt() user: any,
    @Args("currentPassword") currentPassword: string,
    @Args("newPassword") newPassword: string,
  ) {
    return this.accountService.changePassword(
      user.token,
      currentPassword,
      newPassword,
    );
  }

  @UseGuards(GqlUserJwtQuard)
  @Mutation(() => Boolean, { name: "changeAccountDetails" })
  changeAccountDetails(
    @CurrentUserJwt() user: any,
    @Args("firstName") firstName: string,
    @Args("lastName") lastName: string,
    @Args("email") email: string,
  ) {
    return this.accountService.changeAccountDetails(
      user.userId,
      firstName,
      lastName,
      email,
    );
  }

  @UseGuards(GqlUserJwtQuard)
  @Mutation(() => Boolean, { name: "inviteUser" })
  async inviteUser(
    @CurrentUserJwt() user: any,
    @Args("email") email: string,
    @Args("role") role: "user" | "manager",
  ) {
    const me = await this.accountService.findMy(user.userId);
    if (me.role != "manager") throw new UnauthorizedException("not_manager");
    await this.accountService.inviteUser(user.customerId, email, role);
    return true;
  }

  @UseGuards(GqlUserJwtQuard)
  @Mutation(() => Boolean, { name: "deleteUser" })
  async deleteUser(
    @CurrentUserJwt() user: any,
    @Args("userId") userId: string,
  ) {
    const me = await this.accountService.findMy(user.userId);
    if (me.role != "manager") throw new UnauthorizedException("not_manager");
    await this.accountService.deleteUser(user.customerId, userId);
    return true;
  }

  @UseGuards(GqlUserJwtQuard)
  @Mutation(() => Boolean, { name: "changeRole" })
  async changeRole(
    @CurrentUserJwt() user: any,
    @Args("userId") userId: string,
    @Args("role") role: string,
  ) {
    const me = await this.accountService.findMy(user.userId);
    if (me.role != "manager") throw new UnauthorizedException("not_manager");
    await this.accountService.changeRole(user.customerId, userId, role);
    return true;
  }
}
