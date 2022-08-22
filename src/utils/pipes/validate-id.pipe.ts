import { ArgumentMetadata, PipeTransform } from '@nestjs/common';
import { IdDto } from '@utils/dtos/id.dto';
import { plainToClass } from 'class-transformer';
import { validateOrReject } from 'class-validator';

/**
 * Validates if the _id is a Mongoose _id
 * @throws Argument _id must be a Mongoose _id
 */
export class ValidateIdPipe implements PipeTransform {
  async transform(value: unknown, metadata: ArgumentMetadata) {
    if (metadata.type == 'query' && value == null) return null;
    const idClass = plainToClass(IdDto, { _id: value });
    await validateOrReject(idClass);
    return value;
  }
}
