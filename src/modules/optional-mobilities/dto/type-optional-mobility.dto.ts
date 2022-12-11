import { IsDefined, IsEnum, IsString } from 'class-validator';
import { OptionalMobilityDocumentTypes } from '../types/optional-mobility-document.type';

/** Type Optional Mobility data transfer object */
export class TypeOptionalMobilityDto {
  @IsString()
  @IsDefined()
  @IsEnum([
    'solicitudeDocument',
    'presentationOfficeDocument',
    'acceptanceDocument',
    'evaluationDocument',
  ])
  type: OptionalMobilityDocumentTypes;
}
