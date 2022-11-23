import { ArgumentMetadata, PipeTransform } from '@nestjs/common';
import { SlashDateDto } from '@utils/dtos/slash-date.dto';
import { plainToClass } from 'class-transformer';
import { validateOrReject } from 'class-validator';

/**
 * Validates if a slash date is correct
 * @throws Argument must be a year
 */
export class ValidateSlashDatePipe implements PipeTransform {
  async transform(value: unknown, metadata: ArgumentMetadata) {
    const dateClass = plainToClass(SlashDateDto, {
      date: value,
    });
    await validateOrReject(dateClass);
    var dateParts = (value as string).split('/');
    return new Date(+dateParts[2], +dateParts[1] - 1, +dateParts[0]);
  }
}
