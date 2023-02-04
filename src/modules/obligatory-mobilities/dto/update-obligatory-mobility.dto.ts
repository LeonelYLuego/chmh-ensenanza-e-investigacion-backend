import { PartialType } from '@nestjs/swagger';
import { CreateObligatoryMobilityDto } from './create-obligatory-mobility.dto';

/** Update Obligatory Mobility data transfer object */
export class UpdateObligatoryMobilityDto extends PartialType(
  CreateObligatoryMobilityDto,
) {}
