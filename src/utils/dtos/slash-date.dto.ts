import { IsDefined, Matches } from 'class-validator';

/** Slash Date data transfer object */
export class SlashDateDto {
  @IsDefined()
  @Matches(/^(0?[1-9]|[12][0-9]|3[01])[\/\-](0?[1-9]|1[012])[\/\-]\d{4}$/)
  date: Date;
}
