import { ObjectType, Field, ID, Int } from "@nestjs/graphql";

@ObjectType()
export class Feedback {
  @Field(() => ID)
  id: string;
  @Field()
  name: string;
  @Field()
  total_score: number;
  @Field()
  date: Date;
  @Field()
  is_unread: boolean;
  @Field(() => Int)
  temperature: number;
  @Field(() => Int)
  breath: number;
  @Field()
  how_feel: string;
}
