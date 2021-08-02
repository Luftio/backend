import { ObjectType, Field, ID, Int } from "@nestjs/graphql";

@ObjectType()
export class EventFromEmployee {
  @Field(() => ID)
  id: string;
  @Field()
  name: string;
  @Field()
  place: string;
  @Field()
  date: Date;
  @Field()
  is_unread: boolean;
  @Field(() => Int)
  threat: number;
  @Field(() => Int)
  temperature: number;
  @Field(() => Int)
  breath: number;
  @Field()
  how_feel: string;
}
