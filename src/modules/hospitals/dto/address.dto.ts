import { ApiProperty } from '@nestjs/swagger';
import { IsDefined, IsString, MaxLength, MinLength } from 'class-validator';

/** Adress data transfer object */
export class AddressDto {
  @ApiProperty({
    type: String,
    description: 'Address country',
    required: true,
    minLength: 3,
    maxLength: 64,
  })
  @IsDefined()
  @IsString()
  @MinLength(3)
  @MaxLength(64)
  country: string;

  @ApiProperty({
    type: String,
    description: 'Address state',
    required: true,
    minLength: 3,
    maxLength: 64,
  })
  @IsDefined()
  @IsString()
  @MinLength(3)
  @MaxLength(64)
  state: string;

  @ApiProperty({
    type: String,
    description: 'Address city',
    required: true,
    minLength: 3,
    maxLength: 64,
  })
  @IsDefined()
  @IsString()
  @MinLength(3)
  @MaxLength(64)
  city: string;

  @ApiProperty({
    type: String,
    description: 'Address street',
    required: true,
    minLength: 3,
    maxLength: 64,
  })
  @IsDefined()
  @IsString()
  @MinLength(3)
  @MaxLength(64)
  street: string;
}
