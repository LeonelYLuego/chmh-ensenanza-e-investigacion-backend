import { IsDefined, IsEnum, IsString } from 'class-validator';

export class TypeSocialServiceDto {
  @IsString()
  @IsDefined()
  @IsEnum(['presentationOfficeDocument', 'reportDocument', 'constancyDocument'])
  type: 'presentationOfficeDocument' | 'reportDocument' | 'constancyDocument';
}
