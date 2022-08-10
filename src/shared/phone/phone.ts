import { ApiProperty } from '@nestjs/swagger';

export class Phone {
  @ApiProperty({ type: String, description: 'Phone number' })
  number: string;

  @ApiProperty({
    type: Boolean,
    description: 'Phone type: `false` = Cell Phone, `true` = Landline',
  })
  type: Boolean;
}
