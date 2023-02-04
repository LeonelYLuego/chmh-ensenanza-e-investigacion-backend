import { Hospital } from '@hospitals/hospital.schema';
import { ApiProperty } from '@nestjs/swagger';
import { Specialty } from '@specialties/specialty.schema';
import { ObligatoryMobility } from '../schemas/obligatory-mobility.schema';

/** Attachments Obligatory Mobility response data transfer object */
export class AttachmentsObligatoryMobilityResponseDto {
  @ApiProperty({
    type: String,
  })
  _id: string;

  @ApiProperty({
    type: Date,
  })
  initialDate: Date;

  @ApiProperty({
    type: Date,
  })
  finalDate: Date;

  @ApiProperty({
    type: String,
  })
  hospital: Hospital | string;

  @ApiProperty({
    type: String,
  })
  specialty: Specialty | string;

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
