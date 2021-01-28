import { Controller, Post, Body, Inject } from "@nestjs/common";
import { RegisterDto } from "./account.dto";
import { ThingsboardService } from "../thingsboard/thingsboard.service";

@Controller("account")
export class AccountController {
  constructor(private thingsboardService: ThingsboardService) {}

  @Post("register")
  async register(@Body() registerDto: RegisterDto) {
    // TODO connect to database and check customerId
    // pairingCode

    const tenantId = "51b74e40-3267-11eb-bcfe-270ee9414f1a"; // Luftio
    const customerId = "cbc1b280-327a-11eb-bcfe-270ee9414f1a"; // Luftio

    let userId;
    try {
      const createResponse = await this.thingsboardService.createUser(
        customerId,
        tenantId,
        registerDto.email,
        registerDto.firstName,
        registerDto.lastName,
      );
      userId = createResponse.id.id;
    } catch (error) {
      console.log(error.response.data);
      if (error?.response?.data?.errorCode == 31) {
        // TODO handle user already exists
      }
      throw error;
    }
    const activationKey = await this.thingsboardService.activationLink(userId);
    const activated = await this.thingsboardService.activate(
      activationKey,
      registerDto.password,
    );
    return activated;
  }
}
