import { ArgumentMetadata, PipeTransform } from '@nestjs/common';
import { DateDto } from '@utils/dtos/date.dto';
import { plainToClass } from 'class-transformer';
import { validateOrReject } from 'class-validator';

/**
 * Validates if a slash date is correct
 * @throws Argument must be a year
 */
export class ValidateDatePipe implements PipeTransform {
  async transform(value: unknown, metadata: ArgumentMetadata) {
    const dateClass = plainToClass(DateDto, {
      date: value,
    });
    await validateOrReject(dateClass);
    return new Date(value as string);
  }
}
