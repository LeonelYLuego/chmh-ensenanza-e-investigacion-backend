import { ArgumentMetadata, PipeTransform } from '@nestjs/common';
import { LastYearGenerationDto } from '@utils/dtos/lastYearGeneration.dto';
import { plainToClass } from 'class-transformer';
import { isNumber, validateOrReject } from 'class-validator';

/**
 * Validates if a year is correct
 * @throws Argument must be a year
 */
export class ValidateYearPipe implements PipeTransform {
  async transform(value: unknown, metadata: ArgumentMetadata) {
    const yearClass = plainToClass(LastYearGenerationDto, {
      lastYearGeneration: isNumber(value) ? value : +value,
    });
    await validateOrReject(yearClass);
    return value;
  }

  private isNumeric(str: string | number) {
    if (typeof str != 'string') return false;
    return !isNaN(str as unknown as number) && !isNaN(parseFloat(str));
  }
}
