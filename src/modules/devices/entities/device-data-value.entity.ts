import { ObjectType, Field } from "@nestjs/graphql";

@ObjectType()
export class DeviceDataValue {
  @Field({ nullable: false })
  ts: Date;
  @Field({ nullable: false })
  value: number;
}
