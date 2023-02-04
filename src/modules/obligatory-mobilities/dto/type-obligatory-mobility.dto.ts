import { IsDefined, IsEnum, IsString } from 'class-validator';
import {
  ObligatoryMobilityDocumentTypes,
  ObligatoryMobilityDocumentTypesArray,
} from '../types/obligatory-mobility-document.type';

/** Type Obligatory Mobility data transfer object */
export class TypeObligatoryMobilityDto {
  @IsString()
  @IsDefined()
  @IsEnum(ObligatoryMobilityDocumentTypesArray)
  type: ObligatoryMobilityDocumentTypes;
}
