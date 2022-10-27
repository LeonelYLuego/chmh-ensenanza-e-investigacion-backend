import { ApiProperty } from '@nestjs/swagger';
import {
  IsBoolean,
  IsDefined,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';

/** Create User data transfer object */
export class CreateUserDto {
  @ApiProperty({ type: String, minLength: 3, maxLength: 64 })
  @IsDefined()
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
