import { ArgumentMetadata, PipeTransform } from '@nestjs/common';
import { plainToClass } from 'class-transformer';
import { validateOrReject } from 'class-validator';
import { TypeSocialServiceDto } from '../dto/type-social-service.dto';

/** Validate Social Service Document Type pipe */
export class ValidateSocialServiceDocumentTypePipe implements PipeTransform {
  async transform(value: any, metadata: ArgumentMetadata) {
    const typeClass = plainToClass(TypeSocialServiceDto, { type: value });
    await validateOrReject(typeClass);
    return value;
  }
}
