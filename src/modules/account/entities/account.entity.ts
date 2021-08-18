import { ObjectType, Field, ID } from "@nestjs/graphql";

@ObjectType()
export class Account {
  @Field(() => ID)
  id: string;
  @Field()
  first_name: string;
  @Field()
  last_name: string;
  @Field()
  email: string;
  @Field()
  role: string;
  @Field()
  pending_invitation: boolean;
}
