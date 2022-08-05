import { ApiProperty } from '@nestjs/swagger';

/** @class Current User data transfer object */
export class CurrentUserDto {
  @ApiProperty({ type: String, description: 'User primary key' })
  _id: string;

  @ApiProperty({ type: String })
  username: string;

  @ApiProperty({ type: Boolean })
  administrator: boolean;
}
