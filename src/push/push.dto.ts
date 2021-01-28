import { IsNotEmpty, IsJSON } from "class-validator";

export class PushDto {
  @IsNotEmpty()
  userId: string;

  @IsNotEmpty()
  title: string;

  @IsNotEmpty()
  text: string;

  @IsJSON()
  data: string;
}

export class UpdateTokenDto {
  @IsNotEmpty()
  token: string;
}
