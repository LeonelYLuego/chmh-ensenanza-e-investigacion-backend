import { IsDefined, IsEnum, IsString } from 'class-validator';
import {
  ObligatoryMobilityDocumentTypes,
  ObligatoryMobilityDocumentTypesArray,
} from '../types/obligatory-mobility-document.type';

export class TypeObligatoryMobilityDto {
  @IsString()
  @IsDefined()
  @IsEnum(ObligatoryMobilityDocumentTypesArray)
  type: ObligatoryMobilityDocumentTypes;
}
