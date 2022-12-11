import { ApiProperty } from '@nestjs/swagger';
import { OptionalMobility } from 'modules/optional-mobilities';

/** Optional Mobility by Specialty data transfer object */
export class OptionalMobilityBySpecialtyDto {
  @ApiProperty()
  _id: string;

  @ApiProperty()
  value: string;

  @ApiProperty()
  optionalMobilities: OptionalMobility[];
}
