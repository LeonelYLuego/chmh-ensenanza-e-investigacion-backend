import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { Specialty } from 'modules/specialties/specialty.schema';
import mongoose, { Document } from 'mongoose';
import { Phone, PhoneSchema } from 'shared/phone/phone';

export type StudentDocument = Student & Document;

@Schema()
export class Student {
  @ApiProperty({ type: String, description: 'Student primary key' })
  _id: string;

  @ApiProperty({ type: String, description: 'Student code' })
  @Prop({ type: String, required: false, length: 64 })
  code?: string;

  @ApiProperty({ type: String, description: 'Student name' })
  @Prop({ type: String, required: true, length: 32 })
  name: string;

  @ApiProperty({ type: String, description: 'Studen first last name' })
  @Prop({ type: String, required: true, length: 32 })
  firstLastName: string;

  @ApiProperty({ type: String, description: 'Student second last name' })
  @Prop({ type: String, required: true, length: 32 })
  secondLastName: string;

  @ApiProperty({ type: String, description: 'Student specialty _id' })
  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Specialty',
    required: true,
  })
  specialty: Specialty;

  @ApiProperty({ type: [Phone], description: 'Student phones', default: [] })
  @Prop({ type: [PhoneSchema] })
  phones: Phone[];

  @ApiProperty({ type: [String], description: 'Student emails', default: [] })
  @Prop({ type: [{ type: String, length: 64 }] })
  emails: string[];

  @ApiProperty({ type: Number })
  __v: number;
}

export const StudentSchema = SchemaFactory.createForClass(Student);
