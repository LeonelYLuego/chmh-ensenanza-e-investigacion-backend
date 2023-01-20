import { ApiProperty } from '@nestjs/swagger';
import { IsDateString, IsDefined, IsMongoId, IsString } from 'class-validator';

export class CreateAttachmentsObligatoryMobilityDto {
  @ApiProperty({
    type: Date,
    description: 'Attachments Obligatory Mobility initial date',
  })
  @IsDefined()
  @IsDateString()
  initialDate: Date;

  @ApiProperty({
    type: Date,
    description: 'Attachments Obligatory Mobility final date',
  })
  @IsDefined()
  @IsDateString()
  finalDate: Date;

  @ApiProperty({
    type: String,
    description: 'Attachments Optional Mobility hospital',
  })
  @IsDefined()
  @IsString()
  @IsMongoId()
  hospital: string;

  @ApiProperty({
    type: String,
    description: 'Attachments Optional Mobility specialty',
  })
  @IsDefined()
  @IsString()
  @IsMongoId()
  specialty: string;
}
