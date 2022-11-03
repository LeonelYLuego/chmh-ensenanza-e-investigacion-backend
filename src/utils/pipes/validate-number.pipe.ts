import { ArgumentMetadata, PipeTransform } from '@nestjs/common';

/**
 * Validates if a number is correct
 * @throws Argument must be a year
 */
export class ValidateNumberPipe implements PipeTransform {
  async transform(value: unknown, metadata: ArgumentMetadata) {
    if (!/^[1-9]\d*$/.test(value as string)) {
      throw new Error('Must be a number');
    }
    return +value;
  }
}
