import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsArray, IsMongoId, IsOptional, IsString, MaxLength, MinLength, ValidateNested } from "class-validator";
import { PhoneDto } from "shared/phone/dto/phone.dto";
import { Phone } from "shared/phone/phone";

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
        type: [PhoneDto],
        description: 'Student phones',
        required: false,
      })
      @IsOptional()
      @IsArray()
      @ValidateNested()
      @Type(() => PhoneDto)
      phones: Phone[];
    
      @ApiProperty({
        type: [String],
        description: 'Student emails',
        required: false,
      })
      @IsOptional()
      @IsArray()
      @IsString({ each: true })
      @MinLength(3, { each: true })
      @MaxLength(64, { each: true })
      emails: string[];
}
