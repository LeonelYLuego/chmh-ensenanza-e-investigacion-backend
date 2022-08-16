import { ApiProperty } from '@nestjs/swagger';
import {
  IsArray,
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

export class UpdateStudentDto {
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
  @IsOptional()
  @IsString()
  @MinLength(3)
  @MaxLength(32)
  name?: string;

  @ApiProperty({
    type: String,
    description: 'Studen first last name',
    minLength: 3,
    maxLength: 32,
  })
  @IsOptional()
  @IsString()
  @MinLength(3)
  @MaxLength(32)
  firstLastName?: string;

  @ApiProperty({
    type: String,
    description: 'Student second last name',
    minLength: 3,
    maxLength: 32,
  })
  @IsOptional()
  @IsString()
  @MinLength(3)
  @MaxLength(32)
  secondLastName?: string;

  @ApiProperty({ type: String, description: 'Student specialty _id' })
  @IsOptional()
  @IsMongoId()
  specialty?: string;

  @ApiProperty({
    type: Number,
    description: 'Student last year generation',
    minimum: 1990,
    maximum: 2100,
    default: 2022,
  })
  @IsOptional()
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
}
