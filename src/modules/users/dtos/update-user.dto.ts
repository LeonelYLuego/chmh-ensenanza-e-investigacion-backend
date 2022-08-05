import { ApiProperty } from '@nestjs/swagger';
import {
  IsBoolean,
  IsDefined,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';

/** @class Update User data transfer object */
export class UpdateUserDto {
  @ApiProperty({ type: String, minLength: 3, maxLength: 64, required: false })
  @IsOptional()
  @IsString()
  @MaxLength(64)
  @MinLength(3)
  username: string;

  @ApiProperty({ type: String, minLength: 3, maxLength: 64 })
  @IsDefined()
  @IsString()
  @MaxLength(64)
  @MinLength(3)
  password: string;

  @ApiProperty({ type: Boolean, required: false, default: false })
  @IsOptional()
  @IsBoolean()
  administrator?: boolean;
}
