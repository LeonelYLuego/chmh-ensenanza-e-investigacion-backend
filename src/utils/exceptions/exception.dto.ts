import { ApiProperty } from '@nestjs/swagger';

/** @class Global exception forrbiden data transfer object */
export class ExceptionForbbidenDto {
  @ApiProperty({ type: Number, default: 403 })
  statusCode: Number;

  @ApiProperty({ type: Date })
  timestamp: Date;
}
