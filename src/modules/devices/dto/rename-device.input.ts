import { InputType, Field, ID } from "@nestjs/graphql";

@InputType()
export class RenameDeviceInput {
  @Field(() => ID)
  id: string;
  @Field()
  title: string;
}
