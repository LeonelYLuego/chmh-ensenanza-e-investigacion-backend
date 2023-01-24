import { IsDefined, IsEnum, IsString } from 'class-validator';
import {
  AttachmentsObligatoryMobilityDocumentTypes,
  AttachmentsObligatoryMobilityDocumentTypesArray,
} from '../types/attachments-obligatory-mobility-document.type';

export class TypeAttachmentsObligatoryMobilityDto {
  @IsString()
  @IsDefined()
  @IsEnum(AttachmentsObligatoryMobilityDocumentTypesArray)
  type: AttachmentsObligatoryMobilityDocumentTypes;
}
