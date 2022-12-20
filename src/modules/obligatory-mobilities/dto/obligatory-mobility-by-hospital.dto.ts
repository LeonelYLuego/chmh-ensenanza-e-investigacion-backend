import { ApiProperty } from '@nestjs/swagger';
import { ObligatoryMobility } from '../obligatory-mobility.schema';

class ObligatoryMobilityBySpecialtyDto {
  @ApiProperty()
  _id: string;

  @ApiProperty()
  value: string;

  @ApiProperty()
  obligatoryMobilities: ObligatoryMobility[];
}

export class ObligatoryMobilityByHospitalDto {
  @ApiProperty()
  _id: string;

  @ApiProperty()
  name: string;

  @ApiProperty()
  specialties: ObligatoryMobilityBySpecialtyDto[];
}
