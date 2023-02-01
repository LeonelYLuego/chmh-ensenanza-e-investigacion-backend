import { ApiProperty } from '@nestjs/swagger';
import { ObligatoryMobilityResponseDto } from './obligatory-mobility-response.dto';

export class ObligatoryMobilityByHospitalDto {
  @ApiProperty()
  _id: string;

  @ApiProperty()
  name: string;

  @ApiProperty()
  obligatoryMobilities: ObligatoryMobilityResponseDto[];
}
