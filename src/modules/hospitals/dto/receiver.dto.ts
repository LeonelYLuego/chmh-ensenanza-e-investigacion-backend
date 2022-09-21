import { ApiProperty } from '@nestjs/swagger';
import { IsDefined, IsString, MaxLength, MinLength } from 'class-validator';

export class ReceiverDto {
  @ApiProperty({
    type: String,
    description: 'Director position',
    required: true,
    minLength: 3,
    maxLength: 64,
  })
  @IsDefined()
  @IsString()
  @MinLength(3)
  @MaxLength(64)
  position: string;

  @ApiProperty({
    type: String,
    description: 'Director name',
    required: true,
    minLength: 3,
    maxLength: 64,
  })
  @IsDefined()
  @IsString()
  @MinLength(3)
  @MaxLength(64)
  name: string;
}
