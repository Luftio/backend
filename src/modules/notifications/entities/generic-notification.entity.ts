import { ObjectType, Field, ID } from "@nestjs/graphql";

@ObjectType()
export class GenericNotification {
  @Field(() => ID)
  id: string;
  @Field()
  title: string;
  @Field()
  text: string;
  @Field()
  date: Date;
}
