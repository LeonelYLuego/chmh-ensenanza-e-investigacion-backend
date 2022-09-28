import { ArgumentMetadata, PipeTransform } from '@nestjs/common';
import { plainToClass } from 'class-transformer';
import { validateOrReject } from 'class-validator';
import { TypeSocialServiceDto } from '../dto/type-social-service.dto';

export class ValidateTypeSocialServicePipe implements PipeTransform {
  async transform(value: any, metadata: ArgumentMetadata) {
    const typeClass = plainToClass(TypeSocialServiceDto, { type: value });
    await validateOrReject(typeClass);
    return value;
  }
}
