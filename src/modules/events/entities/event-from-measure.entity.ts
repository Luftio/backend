import { ObjectType, Field, ID, Int } from "@nestjs/graphql";

@ObjectType()
export class EventFromMeasure {
  @Field(() => ID)
  id: string;
  @Field()
  title: string;
  @Field()
  place: string;
  @Field()
  date: Date;
  @Field()
  is_unread: boolean;
  @Field(() => Int)
  threat: number;
  @Field()
  justification: string;
}
