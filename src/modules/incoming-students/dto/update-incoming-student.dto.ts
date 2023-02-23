import { PartialType } from '@nestjs/swagger';
import { CreateIncomingStudentDto } from './create-incoming-student.dto';

/** Update Incoming Student data transfer object */
export class UpdateIncomingStudentDto extends PartialType(
  CreateIncomingStudentDto,
) {}
