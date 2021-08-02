import { ObjectType, Field, ID } from "@nestjs/graphql";
import { DeviceData } from "./device-data.entity";

@ObjectType()
export class Device {
  @Field(() => ID)
  id: string;
  @Field()
  label: string;
  @Field()
  title: string;
  @Field()
  color: string;
  @Field(() => [DeviceData], { nullable: true })
  data?: DeviceData[];
}
