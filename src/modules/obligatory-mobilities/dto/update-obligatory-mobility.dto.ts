import { PartialType } from '@nestjs/swagger';
import { CreateObligatoryMobilityDto } from './create-obligatory-mobility.dto';

export class UpdateObligatoryMobilityDto extends PartialType(
  CreateObligatoryMobilityDto,
) {}
