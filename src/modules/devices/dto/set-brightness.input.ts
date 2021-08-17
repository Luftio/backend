import { InputType, Field, ID } from "@nestjs/graphql";

@InputType()
export class SetBrightnessInput {
  @Field(() => ID)
  id: string;
  @Field()
  light: string;
  @Field()
  brightness: number;
}
