import { UseGuards } from "@nestjs/common";
import { Resolver, Query, Args, Mutation, Int } from "@nestjs/graphql";
import { CurrentUserJwt, GqlUserJwtQuard } from "src/guards/gql-user-jwt.guard";
import { DevicesService } from "./devices.service";
import { RenameDeviceInput } from "./dto/rename-device.input";
import { SetBrightnessInput } from "./dto/set-brightness.input";
import { Brightness } from "./entities/brightness.entity";
import { Device } from "./entities/device.entity";
import { DeviceAttributes } from "./entities/device-attributes.entity";

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
  loadDataAll(
    @CurrentUserJwt() user: any,
    @Args("startTs", { nullable: true }) startTs?: string,
    @Args("endTs", { nullable: true }) endTs?: string,
    @Args("interval", { type: () => Int, defaultValue: 900000 })
    interval?: number,
  ) {
    return this.devicesService.loadDataAll(
      user.customerId,
      startTs ? new Date(startTs) : new Date(+new Date() - 24 * 3600000),
      endTs ? new Date(endTs) : new Date(),
      interval,
    );
  }

  @UseGuards(GqlUserJwtQuard)
  @Query(() => Device, { name: "device_data" })
  async loadDataOne(
    @CurrentUserJwt() user: any,
    @Args("id") id: string,
    @Args("startTs", { nullable: true }) startTs?: string,
    @Args("endTs", { nullable: true }) endTs?: string,
    @Args("interval", { type: () => Int, defaultValue: 900000 })
    interval?: number,
  ) {
    return this.devicesService.loadDataOne(
      id,
      user.customerId,
      startTs ? new Date(startTs) : new Date(+new Date() - 24 * 3600000),
      endTs ? new Date(endTs) : new Date(),
      interval,
    );
  }

  @Mutation(() => Device, { name: "renameDevice" })
  renameDevice(
    @CurrentUserJwt() user: any,
    @Args("input") input: RenameDeviceInput,
  ) {
    return this.devicesService.rename(input.id, user.customerId, input.title);
  }

  @UseGuards(GqlUserJwtQuard)
  @Query(() => Brightness, { name: "brightness" })
  getBrightness(@CurrentUserJwt() user: any, @Args("id") id: string) {
    return this.devicesService.getBrightness(id);
  }

  @UseGuards(GqlUserJwtQuard)
  @Mutation(() => Brightness, { name: "setBrightness" })
  async setBrightness(
    @CurrentUserJwt() user: any,
    @Args("input") input: SetBrightnessInput,
  ) {
    await this.devicesService.setBrightness(
      input.id,
      input.light,
      input.brightness,
    );
    return {
      id: input.id,
      light: input.light,
      brightness: input.brightness,
    };
  }

  @UseGuards(GqlUserJwtQuard)
  @Query(() => DeviceAttributes, { name: "deviceAttributes" })
  getAttributes(@CurrentUserJwt() user: any, @Args("id") id: string) {
    return this.devicesService.getAttributes(id);
  }

  @UseGuards(GqlUserJwtQuard)
  @Mutation(() => DeviceAttributes, { name: "saveDeviceAttributes" })
  setAttributes(
    @CurrentUserJwt() user: any,
    @Args("id") id: string,
    @Args("data") data: string,
  ) {
    return this.devicesService.setAttributes(id, data);
  }
}
