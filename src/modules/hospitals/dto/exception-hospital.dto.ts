import { ApiProperty } from '@nestjs/swagger';
import { API_RESOURCES } from '@utils/constants/api-routes.constant';
import { ExceptionForbiddenDto } from '@utils/exceptions/exception.dto';

/** Find Hospital forbidden exceptions */
export class ExceptionFindHospitalDto extends ExceptionForbiddenDto {
  @ApiProperty({ type: String, enum: ['hospital not found'] })
  exception: string;

  @ApiProperty({ type: String, default: API_RESOURCES.HOSPITALS })
  path: string = API_RESOURCES.HOSPITALS;
}

/** Update Hospital forbidden exceptions */
export class ExceptionUpdateHospitalDto extends ExceptionForbiddenDto {
  @ApiProperty({
    type: String,
    enum: ['hospital not found', 'hospital not modified'],
  })
  exception: string;

  @ApiProperty({ type: String, default: API_RESOURCES.HOSPITALS })
  path: string = API_RESOURCES.HOSPITALS;
}

/** Delete Hospital forbidden exceptions */
export class ExceptionDeleteHospitalDto extends ExceptionForbiddenDto {
  @ApiProperty({
    type: String,
    enum: ['hospital not found', 'hospital not deleted'],
  })
  exception: string;

  @ApiProperty({ type: String, default: API_RESOURCES.HOSPITALS })
  path: string = API_RESOURCES.HOSPITALS;
}
