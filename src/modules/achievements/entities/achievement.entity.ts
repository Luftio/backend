import { ObjectType, Field, ID } from "@nestjs/graphql";

@ObjectType()
export class Achievement {
  @Field(() => ID)
  id: string;
  @Field()
  name: string;
}
