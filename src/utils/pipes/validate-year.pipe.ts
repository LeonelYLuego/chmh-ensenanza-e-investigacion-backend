import { ArgumentMetadata, PipeTransform } from '@nestjs/common';
import { YearDto } from '@utils/dtos/year.dto';
import { plainToClass } from 'class-transformer';
import { isNumber, validateOrReject } from 'class-validator';

/**
 * Validates if a year is correct
 * @throws Argument must be a year
 */
export class ValidateYearPipe implements PipeTransform {
  async transform(value: unknown, metadata: ArgumentMetadata) {
    const yearClass = plainToClass(YearDto, {
      year: isNumber(value) ? value : +value,
    });
    await validateOrReject(yearClass);
    return value;
  }
}
