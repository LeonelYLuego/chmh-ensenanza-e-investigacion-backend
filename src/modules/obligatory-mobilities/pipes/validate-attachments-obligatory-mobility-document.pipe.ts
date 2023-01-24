import { ArgumentMetadata, PipeTransform } from '@nestjs/common';
import { plainToClass } from 'class-transformer';
import { validateOrReject } from 'class-validator';
import { TypeAttachmentsObligatoryMobilityDto } from '../dto/type-attachments-obligatory-mobility.dto';

export class ValidateAttachmentsObligatoryMobilityDocumentTypePipe
  implements PipeTransform
{
  async transform(value: any, metadata: ArgumentMetadata) {
    const typeClass = plainToClass(TypeAttachmentsObligatoryMobilityDto, {
      type: value,
    });
    await validateOrReject(typeClass);
    return value;
  }
}
