import { ApiProperty } from '@nestjs/swagger';
import {
  IsArray,
  IsDateString,
  IsDefined,
  IsEmail,
  IsMongoId,
  IsNumber,
  IsOptional,
  IsString,
  Matches,
  Max,
  MaxLength,
  Min,
  MinLength,
} from 'class-validator';

export class CreateIncomingStudentDto {
  @ApiProperty({
    type: String,
    description: 'Student code',
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
    description: 'Student name',
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
    description: 'Student first last name',
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
    description: 'Student second last name',
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
    type: Number,
    description: 'Student last year generation',
    minimum: 1990,
    maximum: 2100,
    default: 2022,
  })
  @IsDefined()
  @IsNumber()
  @Min(1990)
  @Max(2100)
  lastYearGeneration: number;

  @ApiProperty({
    type: [String],
    description: 'Student phones',
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
    description: 'Student emails',
    required: false,
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  @IsEmail(undefined, { each: true })
  @MinLength(3, { each: true })
  @MaxLength(64, { each: true })
  emails: string[];

  @ApiProperty({ type: Date, description: 'Optional Mobility initial date' })
  @IsDefined()
  @IsDateString()
  initialDate: Date;

  @ApiProperty({ type: Date, description: 'Optional Mobility final date' })
  @IsDefined()
  @IsDateString()
  finalDate: Date;

  @ApiProperty({ description: 'Optional Mobility rotation service' })
  @IsDefined()
  @IsString()
  @IsMongoId()
  rotationService: string;

  @ApiProperty({ description: 'Optional Mobility hospital' })
  @IsDefined()
  @IsString()
  @IsMongoId()
  hospital: string;
}
