import { Controller, Post, UseGuards, Body, Request } from "@nestjs/common";
import { ApiHeader } from "@nestjs/swagger";

import { TbServerGuard } from "src/guards/tb-server.guard";
import { UserJwtGuard } from "src/guards/user-jwt.guard";
import { PushDto, PushCustomerDto, UpdateTokenDto } from "./dto/push.dto";
import { PushService } from "./push.service";
import { ThingsboardService } from "../thingsboard/thingsboard.service";

@Controller("push")
export class PushController {
  constructor(
    private pushService: PushService,
    private thingsboardService: ThingsboardService,
  ) {}

  @Post()
  @UseGuards(TbServerGuard)
  async push(@Body() pushDto: PushDto) {
    const pushTokens = await this.pushService.getTokens(pushDto.userId);
    await this.pushService.push(
      pushTokens,
      pushDto.title,
      pushDto.text,
      pushDto.data,
    );
  }

  @Post("toCustomer")
  @UseGuards(TbServerGuard)
  async pushCustomer(@Body() pushDto: PushCustomerDto) {
    const users = await this.thingsboardService.getCustomerUsers(
      pushDto.customerId,
    );
    let pushTokens = [];
    for (const user of users.data) {
      const userTokens = await this.pushService.getTokens(user.id.id);
      pushTokens = [...pushTokens, ...userTokens];
    }
    await this.pushService.push(
      pushTokens,
      pushDto.title,
      pushDto.text,
      pushDto.data,
    );
  }

  @Post("updateToken")
  @ApiHeader({ name: "X-Authorization" })
  @UseGuards(UserJwtGuard)
  async updateToken(@Request() req, @Body() updateTokenDto: UpdateTokenDto) {
    const userId = req.user.userId;
    try {
      await this.pushService.insertToken(userId, updateTokenDto.token);
    } catch (error) {
      // Don't pass errors to client
      console.log(error);
    }
  }
}
