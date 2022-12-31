import { PartialType } from '@nestjs/swagger';
import { CreateIncomingStudentDto } from './create-incoming-student.dto';

export class UpdateIncomingStudentDto extends PartialType(
  CreateIncomingStudentDto,
) {}
