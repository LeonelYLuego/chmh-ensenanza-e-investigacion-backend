import { ArgumentMetadata, PipeTransform } from '@nestjs/common';
import { IdDto } from '@utils/dtos/id.dto';
import { LastYearGenerationDto } from '@utils/dtos/lastYearGeneration.dto';
import { plainToClass } from 'class-transformer';
import { isNumber, validateOrReject } from 'class-validator';

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
