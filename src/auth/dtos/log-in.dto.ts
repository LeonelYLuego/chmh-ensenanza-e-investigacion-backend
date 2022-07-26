import { ApiProperty } from '@nestjs/swagger';
import { IsDefined, IsString, MaxLength, MinLength } from 'class-validator';

export class LogInDto {
  @ApiProperty({ type: String })
  @IsDefined()
  @IsString()
  @MaxLength(64)
  @MinLength(3)
  username: string;

  @ApiProperty({ type: String })
  @IsDefined()
  @IsString()
  @MaxLength(64)
  @MinLength(3)
  password: string;
}
