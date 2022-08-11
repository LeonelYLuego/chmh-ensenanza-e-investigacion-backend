import { Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';

@Schema()
export class Phone {
  @ApiProperty({ type: String, description: 'Phone number' })
  number: string;

  @ApiProperty({
    type: Boolean,
    description: 'Phone type: `false` = Cell Phone, `true` = Landline',
  })
  type: Boolean;
}

export const PhoneSchema = SchemaFactory.createForClass(Phone);