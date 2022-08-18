import { PartialType } from '@nestjs/swagger';
import { CreateSocialServiceDto } from './create-social-service.dto';

export class UpdateSocialServiceDto extends PartialType(CreateSocialServiceDto) {}
