import { ObjectType, Field } from "@nestjs/graphql";
import { DeviceDataValue } from "./device-data-value.entity";

@ObjectType()
export class DeviceData {
  @Field()
  color: string;
  @Field()
  value: number;
  @Field()
  minValue: number;
  @Field()
  maxValue: number;
  @Field()
  change: number;
  @Field()
  type: string;
  @Field(() => [DeviceDataValue])
  values: DeviceDataValue[];
}
