import { IsNotEmpty } from "class-validator";

export class CreateEventFromMeasureDto {
  @IsNotEmpty()
  deviceId: string;

  @IsNotEmpty()
  customerId: string;

  @IsNotEmpty()
  title: string;

  @IsNotEmpty()
  justification: string;

  @IsNotEmpty()
  place: string;

  @IsNotEmpty()
  threat: number;
}
