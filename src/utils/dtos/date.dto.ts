import { IsDateString, IsDefined } from 'class-validator';

export class DateDto {
  @IsDefined()
  @IsDateString()
  date: Date;
}
