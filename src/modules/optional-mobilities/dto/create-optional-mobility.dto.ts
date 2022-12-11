import { ApiProperty } from '@nestjs/swagger';
import { IsDateString, IsDefined, IsMongoId, IsString } from 'class-validator';

/** Create Optional Mobility data transfer object */
export class CreateOptionalMobilityDto {
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

  @ApiProperty({ description: 'Optional Mobility student' })
  @IsDefined()
  @IsString()
  @IsMongoId()
  student: string;

  @ApiProperty({ description: 'Optional Mobility hospital' })
  @IsDefined()
  @IsString()
  @IsMongoId()
  hospital: string;
}
