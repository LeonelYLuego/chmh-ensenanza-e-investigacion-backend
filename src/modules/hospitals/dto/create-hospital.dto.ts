import { ApiProperty } from '@nestjs/swagger';
import {
  IsArray,
  IsBoolean,
  IsDefined,
  IsEmail,
  IsOptional,
  IsString,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';
import { AddressDto } from './address.dto';
import { ReceiverDto } from './receiver.dto';

/** Create Hospital data transfer object */
export class CreateHospitalDto {
  @ApiProperty({
    type: String,
    description: 'Hospital name',
    minLength: 3,
    maxLength: 64,
  })
  @IsDefined()
  @IsString()
  @MinLength(3)
  @MaxLength(64)
  name: string;

  @ApiProperty({
    type: String,
    description: 'Hospital acronym',
    required: false,
    minLength: 2,
    maxLength: 4,
  })
  @IsOptional()
  @IsString()
  @MinLength(2)
  @MaxLength(4)
  acronym?: string;

  @ApiProperty({
    type: ReceiverDto,
    description: 'First receiver',
    required: false,
  })
  @IsOptional()
  firstReceiver?: ReceiverDto;

  @ApiProperty({
    type: ReceiverDto,
    description: 'Second receiver, with attention to',
    required: false,
  })
  @IsOptional()
  secondReceiver?: ReceiverDto;

  @ApiProperty({
    type: ReceiverDto,
    description: 'Third receiver, with attention to',
    required: false,
  })
  @IsOptional()
  thirdReceiver?: ReceiverDto;

  @ApiProperty({
    type: AddressDto,
    description: 'Hospital address',
    required: false,
  })
  @IsOptional()
  address?: AddressDto;

  @ApiProperty({
    type: [String],
    description: 'Hospital phones',
    required: false,
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  @Matches(/^(\+[0-9]{2})*\ {0,1}[0-9]{3}\ {0,1}[0-9]{3}\ {0,1}[0-9]{4}$/, {
    each: true,
  })
  @MinLength(3, { each: true })
  @MaxLength(64, { each: true })
  phones: string[];

  @ApiProperty({
    type: [String],
    description: 'Hospital emails',
    required: false,
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  @IsEmail(undefined, { each: true })
  @MinLength(3, { each: true })
  @MaxLength(64, { each: true })
  emails: string[];

  @ApiProperty({
    type: Boolean,
    description:
      'Hospital social service: `true` = is social service hospital, `false` = is not a social service hospital',
    required: false,
    default: false,
  })
  @IsOptional()
  @IsBoolean()
  socialService: boolean;
}
