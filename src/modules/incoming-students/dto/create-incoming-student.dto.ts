import { ApiProperty } from '@nestjs/swagger';
import {
  IsArray,
  IsDateString,
  IsDefined,
  IsEmail,
  IsMongoId,
  IsOptional,
  IsString,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';

export class CreateIncomingStudentDto {
  @ApiProperty({
    type: String,
    description: 'Incoming Student code',
    minLength: 3,
    maxLength: 64,
    required: false,
  })
  @IsOptional()
  @IsString()
  @MinLength(3)
  @MaxLength(64)
  code?: string;

  @ApiProperty({
    type: String,
    description: 'Incoming Student name',
    minLength: 3,
    maxLength: 32,
  })
  @IsDefined()
  @IsString()
  @MinLength(3)
  @MaxLength(32)
  name: string;

  @ApiProperty({
    type: String,
    description: 'Incoming Student first last name',
    minLength: 3,
    maxLength: 32,
  })
  @IsDefined()
  @IsString()
  @MinLength(3)
  @MaxLength(32)
  firstLastName: string;

  @ApiProperty({
    type: String,
    description: 'Incoming Student second last name',
    minLength: 3,
    maxLength: 32,
    required: false,
  })
  @IsOptional()
  @IsString()
  @MinLength(3)
  @MaxLength(32)
  secondLastName?: string;

  @ApiProperty({
    type: [String],
    description: 'Incoming Student phones',
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
    description: 'Incoming Student emails',
    required: false,
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  @IsEmail(undefined, { each: true })
  @MinLength(3, { each: true })
  @MaxLength(64, { each: true })
  emails: string[];

  @ApiProperty({ type: Date, description: 'Incoming Student initial date' })
  @IsDefined()
  @IsDateString()
  initialDate: Date;

  @ApiProperty({ type: Date, description: 'Incoming Student final date' })
  @IsDefined()
  @IsDateString()
  finalDate: Date;

  @ApiProperty({ description: 'Incoming Student rotation service' })
  @IsDefined()
  @IsString()
  @IsMongoId()
  rotationService: string;

  @ApiProperty({ description: 'Incoming Student hospital' })
  @IsDefined()
  @IsString()
  @IsMongoId()
  hospital: string;
}
