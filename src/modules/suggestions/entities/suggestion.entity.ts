import { ObjectType, Field, ID, Int } from "@nestjs/graphql";

@ObjectType()
export class Suggestion {
  @Field(() => ID)
  id: string;
  @Field()
  title: string;
  @Field()
  description: string;
  @Field()
  how_solve: string;
  @Field()
  why_important: string;
  @Field(() => Int)
  importance: number;
  @Field()
  date: Date;
  @Field()
  is_unread: boolean;
}
