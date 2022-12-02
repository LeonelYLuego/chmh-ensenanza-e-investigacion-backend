import { ArgumentMetadata, PipeTransform } from '@nestjs/common';
import { plainToClass } from 'class-transformer';
import { validateOrReject } from 'class-validator';
import { TypeOptionalMobilityDto } from '../dto/type-optional-mobility.dto';

export class ValidateOptionalMobilityDocumentTypePipe implements PipeTransform {
  async transform(value: any, metadata: ArgumentMetadata) {
    const typeClass = plainToClass(TypeOptionalMobilityDto, { type: value });
    await validateOrReject(typeClass);
    return value;
  }
}
