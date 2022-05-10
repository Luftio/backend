import {
  CanActivate,
  ExecutionContext,
  Inject,
  Injectable,
  UnauthorizedException,
} from "@nestjs/common";
import { ConfigService } from "@nestjs/config";

import * as jwt from "jsonwebtoken";

@Injectable()
export class UserJwtGuard implements CanActivate {
  constructor(@Inject(ConfigService) private configService: ConfigService) {}

  getRequest(context: ExecutionContext) {
    return context.switchToHttp().getRequest();
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const secret = this.configService.get("TB_JWT");
    const request = this.getRequest(context);
    try {
      const token = request.headers["x-authorization"].split("Bearer ")[1];
      request.user = jwt.verify(token, Buffer.from(secret, "base64"), {
        algorithms: ["HS512"],
      });
      request.user.token = token;
      return true;
    } catch (error) {
      console.log(error);
      throw new UnauthorizedException();
      return false;
    }
  }
}
