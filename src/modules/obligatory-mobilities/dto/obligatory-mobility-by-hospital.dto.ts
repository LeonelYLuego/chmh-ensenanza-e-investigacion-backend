import { ApiProperty } from '@nestjs/swagger';
import { ObligatoryMobility } from '../obligatory-mobility.schema';

export class ObligatoryMobilityByHospitalDto {
  @ApiProperty()
  _id: string;

  @ApiProperty()
  name: string;

  @ApiProperty()
  obligatoryMobilities: ObligatoryMobility[];
}
