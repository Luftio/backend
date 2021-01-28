import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/sequelize";
import { PushToken } from "./push-token.model";

@Injectable()
export class PushService {
  constructor(
    @InjectModel(PushToken)
    private pushToken: typeof PushToken,
  ) {}

  getTokens(userId: string) {
    return this.pushToken.findAll({ where: { userId } });
  }
  insertToken(userId: string, token: string) {
    return this.pushToken.create({ userId, token });
  }
  deleteToken(userId: string, token: string) {
    return this.pushToken
      .findOne({ where: { userId, token } })
      .then((token) => token.destroy());
  }
}
