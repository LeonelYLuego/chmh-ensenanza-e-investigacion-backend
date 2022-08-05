import { ApiProperty } from '@nestjs/swagger';
import { IsDefined, IsString, MaxLength, MinLength } from 'class-validator';

/** Log In data transfer object */
export class LogInDto {
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
}
