import { ObjectType, Field, ID } from "@nestjs/graphql";

@ObjectType()
export class Brightness {
  @Field(() => ID)
  id: string;
  @Field()
  light: string;
  @Field()
  brightness: number;
}
