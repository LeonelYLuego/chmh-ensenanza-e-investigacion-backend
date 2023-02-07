import { ApiProperty } from '@nestjs/swagger';
import { AttachmentsObligatoryMobility } from '../schemas/attachments-obligatory-mobility.schema';

/** Attachments Obligatory Mobility by Hospital data transfer object */
export class AttachmentsObligatoryMobilityByHospitalDto {
  @ApiProperty()
  _id: string;

  @ApiProperty()
  name: string;

  @ApiProperty({ type: [AttachmentsObligatoryMobility] })
  attachmentsObligatoryMobilities: AttachmentsObligatoryMobility[];
}
