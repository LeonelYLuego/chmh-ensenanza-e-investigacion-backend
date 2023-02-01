import { Hospital } from '@hospitals/hospital.schema';
import { ApiProperty } from '@nestjs/swagger';
import { Student } from '@students/student.schema';
import { RotationService } from 'modules/rotation-services';

export class ObligatoryMobilityResponseDto {
  @ApiProperty({ description: 'Obligatory Mobility primary key' })
  _id?: string;

  @ApiProperty({ type: Date, description: 'Obligatory Mobility initial date' })
  initialDate: Date;

  @ApiProperty({ type: Date, description: 'Obligatory Mobility final date' })
  finalDate: Date;

  @ApiProperty({
    type: [String],
  })
  solicitudeDocument: string[];

  @ApiProperty({
    type: [String],
  })
  acceptanceDocument: string[];

  @ApiProperty({
    type: String,
    required: false,
    description: 'Obligatory Mobility presentation document name',
  })
  presentationOfficeDocument?: string;

  @ApiProperty({
    type: String,
    required: false,
    description: 'Obligatory Mobility evaluation document name',
  })
  evaluationDocument?: string;

  @ApiProperty({
    type: String,
  })
  rotationService: RotationService;

  @ApiProperty({
    type: String,
  })
  student: Student;

  @ApiProperty({
    type: String,
  })
  hospital: Hospital;

  @ApiProperty({
    type: Boolean,
    default: false,
    required: false,
  })
  canceled?: boolean;

  @ApiProperty({})
  __v?: number;
}
