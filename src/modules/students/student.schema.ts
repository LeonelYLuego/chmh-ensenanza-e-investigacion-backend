import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { Specialty } from 'modules/specialties/specialty.schema';
import mongoose, { Document } from 'mongoose';

/** Student Document */
export type StudentDocument = Student & Document;

/** Student Class */
@Schema()
export class Student {
  @ApiProperty({ type: String, description: 'Student primary key' })
  _id: string;

  @ApiProperty({ type: String })
  @Prop({ type: String, required: false, length: 64 })
  code?: string;

  @ApiProperty({ type: String })
  @Prop({ type: String, required: true, length: 32 })
  name: string;

  @ApiProperty({ type: String })
  @Prop({ type: String, required: true, length: 32 })
  firstLastName: string;

  @ApiProperty({
    type: String,
    description: 'Student second last name',
    required: false,
  })
  @Prop({ type: String, length: 32 })
  secondLastName: string;

  @ApiProperty({ type: String })
  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Specialty',
    required: true,
  })
  specialty: Specialty;

  @ApiProperty({
    type: Number,
    minimum: 1990,
    maximum: 2100,
  })
  @Prop({
    type: Number,
    required: true,
    min: 1990,
    max: 2100,
  })
  lastYearGeneration: number;

  @ApiProperty({ type: [String], default: [] })
  @Prop({ type: [{ type: String, length: 16 }] })
  phones: string[];

  @ApiProperty({ type: [String], default: [] })
  @Prop({ type: [{ type: String, length: 64 }] })
  emails: string[];

  @ApiProperty({ type: Number })
  __v: number;
}

/** Student Schema */
export const StudentSchema = SchemaFactory.createForClass(Student);
