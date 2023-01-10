import { IsDefined, IsEnum, IsString } from 'class-validator';
import {
  IncomingStudentDocumentTypes,
  IncomingStudentDocumentTypesArray,
} from '../types/incoming-student-document.type';

export class TypeIncomingStudentDto {
  @IsString()
  @IsDefined()
  @IsEnum(IncomingStudentDocumentTypesArray)
  type: IncomingStudentDocumentTypes;
}
