import { ApiProperty } from '@nestjs/swagger';
import { AttachmentsObligatoryMobility } from '../schemas/attachments-obligatory-mobility.schema';

export class AttachmentsObligatoryMobilityByHospitalDto {
  @ApiProperty()
  _id: string;

  @ApiProperty()
  name: string;

  @ApiProperty()
  attachmentsObligatoryMobilities: AttachmentsObligatoryMobility[];
}
