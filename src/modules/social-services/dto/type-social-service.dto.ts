import { IsDefined, IsEnum, IsString } from 'class-validator';
import { SocialServiceDocumentTypes } from '../types/document.types';

/** Type Social Service data transfer object */
export class TypeSocialServiceDto {
  @IsString()
  @IsDefined()
  @IsEnum(['presentationOfficeDocument', 'reportDocument', 'constancyDocument'])
  type: SocialServiceDocumentTypes;
}
