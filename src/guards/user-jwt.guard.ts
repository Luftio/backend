import {
  CanActivate,
  ExecutionContext,
  Inject,
  Injectable,
} from "@nestjs/common";
import { ConfigService } from "@nestjs/config";

import * as jwt from "jsonwebtoken";

@Injectable()
export class UserJwtGuard implements CanActivate {
  constructor(@Inject(ConfigService) private configService: ConfigService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const secret = this.configService.get("TB_JWT");
    const request = context.switchToHttp().getRequest();
    try {
      const token = request.headers["x-authorization"].split("Bearer ")[1];
      request.user = jwt.verify(token, Buffer.from(secret, "base64"), {
        algorithms: ["HS512"],
      });
      return true;
    } catch (error) {
      console.log(error);
      return false;
    }
  }
}
