import { ArgumentMetadata, PipeTransform } from '@nestjs/common';
import { plainToClass } from 'class-transformer';
import { validateOrReject } from 'class-validator';
import { TypeIncomingStudentDto } from '../dto/type-incoming-student.dto';

export class ValidateIncomingStudentDocumentTypePipe implements PipeTransform {
  async transform(value: any, metadata: ArgumentMetadata) {
    const typeClass = plainToClass(TypeIncomingStudentDto, { type: value });
    await validateOrReject(typeClass);
    return value;
  }
}
