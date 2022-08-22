import { ApiProperty } from '@nestjs/swagger';
import { API_RESOURCES } from '@utils/constants/api-routes.constant';
import { ExceptionForbiddenDto } from '@utils/exceptions/exception.dto';

/** Create Specialty forbidden exceptions */
export class ExceptionCreateSpecialtyDto extends ExceptionForbiddenDto {
  @ApiProperty({
    type: String,
    enum: ['specialty already exists'],
  })
  exception: string;

  @ApiProperty({ type: String, default: API_RESOURCES.SPECIALTIES })
  path: string = API_RESOURCES.SPECIALTIES;
}

/** Update Specialty forbidden exceptions */
export class ExceptionUpdateSpecialtyDto extends ExceptionForbiddenDto {
  @ApiProperty({
    type: String,
    enum: [
      'specialty already exists',
      'specialty not modified',
      'specialty not found',
    ],
  })
  exception: string;

  @ApiProperty({ type: String, default: API_RESOURCES.SPECIALTIES })
  path: string = API_RESOURCES.SPECIALTIES;
}

/** Delete Specialty forbidden exceptions */
export class ExceptionDeleteSpecialtyDto extends ExceptionForbiddenDto {
  @ApiProperty({
    type: String,
    enum: ['specialty not found', 'specialty not deleted'],
  })
  exception: string;

  @ApiProperty({ type: String, default: API_RESOURCES.SPECIALTIES })
  path: string = API_RESOURCES.SPECIALTIES;
}
