import { ArgumentMetadata, PipeTransform } from '@nestjs/common';
import { PeriodDto } from '@utils/dtos/period.dto';
import { plainToClass } from 'class-transformer';
import { isNumber, validateOrReject } from 'class-validator';

export class ValidatePeriodPipe implements PipeTransform {
  async transform(value: unknown, metadata: ArgumentMetadata) {
    const periodClass = plainToClass(PeriodDto, {
      period: isNumber(value) ? value : +value,
    });
    await validateOrReject(periodClass);
    return value;
  }
}
