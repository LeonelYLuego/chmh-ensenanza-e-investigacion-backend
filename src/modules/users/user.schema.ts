import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type UserDocument = User & Document;

@Schema()
export class User {
  _id: string;

  @Prop({
    type: String,
    required: true,
    length: 64,
  })
  username: string;

  @Prop({
    type: String,
    required: true,
    length: 64,
  })
  password: string;

  @Prop({
    type: Boolean,
    required: true,
    default: false,
  })
  administrator: boolean;
}

export const UserSchema = SchemaFactory.createForClass(User);
