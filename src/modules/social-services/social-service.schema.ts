import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { Hospital } from 'modules/hospitals/hospital.schema';
import { Student } from 'modules/students/student.schema';
import mongoose from 'mongoose';

export type SocialServiceDocument = SocialService & Document;

@Schema()
export class SocialService {
  @ApiProperty({ type: String, description: 'Social Service primary key' })
  _id: string;

  @ApiProperty({
    type: Number,
    enum: [0, 1, 2],
    description:
      'Social Service period: `0` = March - June, `1` = July - October, `2` = November - February',
  })
  @Prop({ type: Number, min: 0, max: 2 })
  period: 0 | 1 | 2;

  @ApiProperty({
    type: Number,
    minimum: 1990,
    maximum: 2100,
    description: 'Social Service period year',
  })
  @Prop({ type: Number, min: 1990, max: 2100 })
  year: Number;

  @ApiProperty({
    type: String,
    required: false,
    description: 'Social Service presentation card document name',
  })
  @Prop({ type: String, required: false })
  presentationOfficeDocument?: string;

  @ApiProperty({
    type: String,
    required: false,
    description: 'Social Service report document name',
  })
  @Prop({ type: String, required: false })
  reportDocument?: string;

  @ApiProperty({
    type: String,
    required: false,
    description: 'Social Service report constancy name',
  })
  @Prop({ type: String, required: false })
  constancyDocument?: string;

  @ApiProperty({
    type: String,
    description: 'Social Service student _id',
  })
  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Student',
  })
  student: Student;

  @ApiProperty({
    type: String,
    description: 'Social Service hospital _id',
  })
  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Hospital',
  })
  hospital: Hospital;

  @ApiProperty({ type: Number })
  __v: number;
}

export const SocialServiceSchema = SchemaFactory.createForClass(SocialService);