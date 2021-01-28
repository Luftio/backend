import { Controller, Post, UseGuards, Body, Request } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { ApiHeader } from "@nestjs/swagger";

import { Expo } from "expo-server-sdk";

import { TbServerGuard } from "src/guards/tb-server.guard";
import { UserJwtGuard } from "src/guards/user-jwt.guard";
import { PushDto, UpdateTokenDto } from "./push.dto";
import { PushService } from "./push.service";

@Controller("push")
export class PushController {
  private expo: Expo;

  constructor(
    private configService: ConfigService,
    private pushService: PushService,
  ) {
    this.expo = new Expo();
  }

  @Post()
  @UseGuards(TbServerGuard)
  async push(@Body() pushDto: PushDto) {
    const pushTokens = await this.pushService.getTokens(pushDto.userId);

    const messages = pushTokens
      .filter((pushToken) => Expo.isExpoPushToken(pushToken))
      .map((pushToken) => ({
        to: pushToken.token,
        title: pushDto.title,
        body: pushDto.text,
        data: JSON.parse(pushDto.data),
      }));
    if (messages.length == 0) return;
    const chunks = this.expo.chunkPushNotifications(messages);
    for (const chunk of chunks) {
      const response = await this.expo.sendPushNotificationsAsync(chunk);
      for (const ticket of response) {
        if (
          ticket.status == "error" &&
          ticket.details.error == "DeviceNotRegistered"
        ) {
          const token =
            "ExponentPushToken[" +
            ticket.message.match(/ExponentPushToken\[(.*)\]/)[1] +
            "]";
          this.pushService.deleteToken(pushDto.userId, token);
        }
      }
    }
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
