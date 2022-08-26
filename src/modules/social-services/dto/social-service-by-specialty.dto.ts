import { ApiProperty } from '@nestjs/swagger';
import { SocialService } from '../social-service.schema';

export class SocialServiceBySpecialtyDto {
  @ApiProperty({ type: String, description: 'Specialty _id' })
  _id: string;

  @ApiProperty({ type: String, description: 'Specialty name' })
  value: string;

  @ApiProperty({ type: [SocialService], description: 'Social Services' })
  socialServices: SocialService[];
}
