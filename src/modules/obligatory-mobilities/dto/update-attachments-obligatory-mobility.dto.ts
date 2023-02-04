import { PartialType } from '@nestjs/swagger';
import { CreateAttachmentsObligatoryMobilityDto } from './create-attachments-obligatory-mobility.dto';

/** Update Attachments Obligatory Mobility data transfer object */
export class UpdateAttachmentsObligatoryMobilityDto extends PartialType(
  CreateAttachmentsObligatoryMobilityDto,
) {}
