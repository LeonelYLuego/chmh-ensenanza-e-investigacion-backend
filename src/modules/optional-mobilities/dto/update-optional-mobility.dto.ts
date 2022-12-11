import { PartialType } from '@nestjs/swagger';
import { CreateOptionalMobilityDto } from './create-optional-mobility.dto';

/** Update Optional Mobility data transfer object */
export class UpdateOptionalMobilityDto extends PartialType(
  CreateOptionalMobilityDto,
) {}
