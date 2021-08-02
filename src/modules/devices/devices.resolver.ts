import { UseGuards } from "@nestjs/common";
import { Resolver, Query, Args, Mutation } from "@nestjs/graphql";
import { CurrentUserJwt, GqlUserJwtQuard } from "src/guards/gql-user-jwt.guard";
import { DevicesService } from "./devices.service";
import { RenameDeviceInput } from "./dto/rename-device.input";
import { Device } from "./entities/device.entity";

@Resolver(() => Device)
export class DevicesResolver {
  constructor(private readonly devicesService: DevicesService) {}

  @UseGuards(GqlUserJwtQuard)
  @Query(() => [Device], { name: "devices" })
  findAll(@CurrentUserJwt() user: any) {
    return this.devicesService.findAll(user.customerId);
  }

  @UseGuards(GqlUserJwtQuard)
  @Query(() => Device, { name: "device" })
  findOne(@CurrentUserJwt() user: any, @Args("id") id: string) {
    return this.devicesService.findOne(id, user.customerId);
  }

  @UseGuards(GqlUserJwtQuard)
  @Query(() => [Device], { name: "devices_data" })
  loadData(@CurrentUserJwt() user: any) {
    return this.devicesService.loadData(user.customerId);
  }

  @Mutation(() => Device, { name: "renameDevice" })
  renameDevice(
    @CurrentUserJwt() user: any,
    @Args("input") input: RenameDeviceInput,
  ) {
    return this.devicesService.rename(input.id, user.customerId, input.title);
  }
}
