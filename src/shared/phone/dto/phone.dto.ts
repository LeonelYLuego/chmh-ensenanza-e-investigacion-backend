import { ApiProperty } from '@nestjs/swagger';
import {
  IsBoolean,
  IsDefined,
  IsPhoneNumber,
} from 'class-validator';

export class PhoneDto {
  @ApiProperty({ type: String, description: 'Phone number' })
  @IsDefined()
  @IsPhoneNumber()
  number: string;

  @ApiProperty({ type: Boolean, description: 'Phone type: `false` = Cell Phone, `true` = Landline' })
  @IsDefined()
  @IsBoolean()
  type: Boolean;
}
