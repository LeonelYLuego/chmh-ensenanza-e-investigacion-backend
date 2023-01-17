import { ApiProperty } from '@nestjs/swagger';
import { ObligatoryMobility } from '../obligatory-mobility.schema';

export class ObligatoryMobilityByStudentDto {
  @ApiProperty()
  _id: string;

  @ApiProperty()
  name: string;

  @ApiProperty()
  firstLastName: string;

  @ApiProperty()
  secondLastName: string;

  @ApiProperty()
  obligatoryMobilities: ObligatoryMobility[];
}
