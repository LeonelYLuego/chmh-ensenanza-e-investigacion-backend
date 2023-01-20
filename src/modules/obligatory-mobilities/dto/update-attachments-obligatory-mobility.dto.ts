import { PartialType } from '@nestjs/swagger';
import { CreateAttachmentsObligatoryMobilityDto } from './create-attachments-obligatory-mobility.dto';

export class UpdateAttachmentsObligatoryMobilityDto extends PartialType(
  CreateAttachmentsObligatoryMobilityDto,
) {}
