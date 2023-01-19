import { ArgumentMetadata, PipeTransform } from '@nestjs/common';
import { plainToClass } from 'class-transformer';
import { validateOrReject } from 'class-validator';
import { TypeObligatoryMobilityDto } from '../dto/type-obligatory-mobility.dto';

export class ValidateObligatoryMobilityDocumentTypePipe
  implements PipeTransform
{
  async transform(value: any, metadata: ArgumentMetadata) {
    const typeClass = plainToClass(TypeObligatoryMobilityDto, { type: value });
    await validateOrReject(typeClass);
    return value;
  }
}
