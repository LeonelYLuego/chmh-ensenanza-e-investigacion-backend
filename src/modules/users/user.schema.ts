import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiHideProperty, ApiProperty } from '@nestjs/swagger';
import { Document } from 'mongoose';

export type UserDocument = User & Document;

@Schema()
export class User {
  @ApiProperty({type: String, description: 'User primary key'})
  _id: string;

  @ApiProperty({type: String})
  @Prop({
    type: String,
    required: true,
    length: 64,
  })
  username: string;

  @ApiHideProperty()
  @Prop({
    type: String,
    required: true,
    length: 64,
    select: false,
  })
  password: string;

  @ApiProperty({type: Boolean})
  @Prop({
    type: Boolean,
    required: true,
    default: false,
  })
  administrator: boolean;

  @ApiProperty({type: Number})
  __v: number;
}

export const UserSchema = SchemaFactory.createForClass(User);