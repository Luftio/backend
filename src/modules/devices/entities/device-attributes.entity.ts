import { ObjectType, Field, ID } from "@nestjs/graphql";

@ObjectType()
export class DeviceAttributes {
  @Field(() => ID)
  id: string;
  @Field()
  attributes: string;
}
