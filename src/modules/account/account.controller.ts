import { Controller, Post, Body, BadRequestException } from "@nestjs/common";
import { InjectModel } from "@nestjs/sequelize";
import { RegisterDto } from "./dto/account.dto";
import { AcceptInviteDto } from "./dto/accept-invite.dto";
import { AccountService } from "./account.service";
import { ThingsboardService } from "../thingsboard/thingsboard.service";
import { PairingCodes } from "./models/pairing-codes.model";

@Controller("account")
export class AccountController {
  constructor(
    private accountService: AccountService,
    private thingsboardService: ThingsboardService,
    @InjectModel(PairingCodes)
    private pairingCodes: typeof PairingCodes,
  ) {}

  @Post("register")
  async register(@Body() registerDto: RegisterDto) {
    const tenantId = "51b74e40-3267-11eb-bcfe-270ee9414f1a"; // Luftio

    const pairingInfo = await this.pairingCodes.findOne({
      where: { value: registerDto.pairingCode },
    });
    const customerId = pairingInfo?.id;
    if (!customerId) {
      throw new BadRequestException("pairing_code_invalid");
    }

    let userId;
    try {
      const createResponse = await this.thingsboardService.createUser(
        customerId,
        tenantId,
        registerDto.email,
        registerDto.firstName,
        registerDto.lastName,
        "user",
      );
      userId = createResponse.id.id;
    } catch (error) {
      console.log(error.response.data);
      if (error?.response?.data?.errorCode == 31) {
        throw new BadRequestException("user_exists");
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

  @Post("acceptInvite")
  async acceptInvite(@Body() acceptInviteDto: AcceptInviteDto) {
    return await this.accountService.acceptInvite(
      acceptInviteDto.token,
      acceptInviteDto.firstName,
      acceptInviteDto.lastName,
      acceptInviteDto.password,
    );
  }
}
