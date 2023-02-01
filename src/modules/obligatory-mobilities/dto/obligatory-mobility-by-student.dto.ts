import { ApiProperty } from '@nestjs/swagger';
import { ObligatoryMobilityResponseDto } from './obligatory-mobility-response.dto';

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
  obligatoryMobilities: ObligatoryMobilityResponseDto[];
}
