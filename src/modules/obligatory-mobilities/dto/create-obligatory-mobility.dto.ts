import { ApiProperty } from '@nestjs/swagger';
import { IsDateString, IsDefined, IsMongoId, IsString } from 'class-validator';

export class CreateObligatoryMobilityDto {
  @ApiProperty({ type: Date, description: 'Obligatory Mobility initial date' })
  @IsDefined()
  @IsDateString()
  initialDate: Date;

  @ApiProperty({ type: Date, description: 'Obligatory Mobility final date' })
  @IsDefined()
  @IsDateString()
  finalDate: Date;

  @ApiProperty({
    type: String,
    description: 'Optional Mobility rotation service',
  })
  @IsDefined()
  @IsString()
  @IsMongoId()
  rotationService: string;

  @ApiProperty({
    type: String,
    description: 'Optional Mobility student',
  })
  @IsDefined()
  @IsString()
  @IsMongoId()
  student: string;

  @ApiProperty({
    type: String,
    description: 'Optional Mobility hospital',
  })
  @IsDefined()
  @IsString()
  @IsMongoId()
  hospital: string;
}
