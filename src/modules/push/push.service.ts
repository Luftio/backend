import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/sequelize";
import { PushToken } from "./models/push-token.model";

import { Expo } from "expo-server-sdk";

@Injectable()
export class PushService {
  private expo: Expo;

  constructor(
    @InjectModel(PushToken)
    private pushToken: typeof PushToken,
  ) {
    this.expo = new Expo();
  }

  getTokens(userId: string) {
    return this.pushToken
      .findAll({ where: { userId } })
      .then((data) => data.map((it) => it.token));
  }
  insertToken(userId: string, token: string) {
    return this.pushToken.create({ userId, token });
  }
  deleteToken(token: string) {
    return this.pushToken
      .findOne({ where: { token } })
      .then((token) => token.destroy());
  }
  deleteUserId(userId: string) {
    return this.pushToken
      .findOne({ where: { userId } })
      .then((token) => token.destroy());
  }

  async push(pushTokens: string[], title: string, body: string, data: string) {
    const messages = pushTokens
      .filter((pushToken) => Expo.isExpoPushToken(pushToken))
      .map((pushToken) => ({
        to: pushToken,
        title,
        body,
        data: JSON.parse(data),
      }));
    if (messages.length == 0) return;
    console.log(messages);
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
          this.deleteToken(token);
        }
      }
    }
  }
}
