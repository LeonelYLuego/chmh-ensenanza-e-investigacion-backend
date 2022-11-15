import { PartialType } from '@nestjs/swagger';
import { CreateOptionalMobilityDto } from './create-optional-mobility.dto';

export class UpdateOptionalMobilityDto extends PartialType(CreateOptionalMobilityDto) {}
