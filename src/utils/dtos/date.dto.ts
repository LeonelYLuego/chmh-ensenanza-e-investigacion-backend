import { IsDateString, IsDefined } from 'class-validator';

/** Date data transfer object */
export class DateDto {
  @IsDefined()
  @IsDateString()
  date: Date;
}
