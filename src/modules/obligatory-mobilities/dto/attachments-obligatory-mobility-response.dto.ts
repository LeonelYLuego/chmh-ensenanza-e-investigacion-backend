import { Hospital } from '@hospitals/hospital.schema';
import { ApiProperty } from '@nestjs/swagger';
import { Specialty } from '@specialties/specialty.schema';
import { ObligatoryMobility } from '../obligatory-mobility.schema';

export class AttachmentsObligatoryMobilityResponseDto {
  @ApiProperty({
    type: String,
    description: 'Attachments Obligatory Mobility primary key',
  })
  _id: string;

  @ApiProperty({
    type: Date,
    description: 'Attachments Obligatory Mobility initial date',
  })
  initialDate: Date;

  @ApiProperty({
    type: Date,
    description: 'Attachments Obligatory Mobility final date',
  })
  finalDate: Date;

  @ApiProperty({
    type: String,
  })
  hospital: Hospital;

  @ApiProperty({
    type: String,
  })
  specialty: Specialty;

  @ApiProperty({
    type: String,
    required: false,
    description: 'Attachments Obligatory Mobility solicitude document name',
  })
  solicitudeDocument?: string;

  @ApiProperty({
    type: String,
    required: false,
    description: 'Attachments Obligatory Mobility acceptance document name',
  })
  acceptanceDocument?: string;

  @ApiProperty({
    type: [ObligatoryMobility],
  })
  obligatoryMobilities: ObligatoryMobility[];
}
