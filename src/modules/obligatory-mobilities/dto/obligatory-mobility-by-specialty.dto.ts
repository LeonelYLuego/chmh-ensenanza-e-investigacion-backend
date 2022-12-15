import { ApiProperty } from '@nestjs/swagger';
import { ObligatoryMobility } from '../obligatory-mobility.schema';

export class ObligatoryMobilityBySpecialtyDto {
  @ApiProperty()
  _id: string;

  @ApiProperty()
  value: string;

  @ApiProperty()
  obligatoryMobilities: ObligatoryMobility[];
}
