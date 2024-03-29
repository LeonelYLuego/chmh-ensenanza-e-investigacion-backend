import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';

/** Specialty document */
export type SpecialtyDocument = Specialty & Document;

/** Specialty */
@Schema()
export class Specialty {
  @ApiProperty({ type: String, description: 'Specialty primary key' })
  _id: string;

  @ApiProperty({ type: String })
  @Prop({
    type: String,
    length: 64,
  })
  value: string;

  @ApiProperty({
    type: Number,
    minimum: 1,
    maximum: 6,
    required: false,
  })
  @Prop({
    type: Number,
    min: 1,
    max: 6,
    required: false,
  })
  duration: number;

  @ApiProperty({
    type: String,
    minLength: 3,
    maxLength: 128,
    required: false,
  })
  @Prop({
    type: String,
    length: 128,
    required: false,
  })
  headOfDepartment: string;

  @ApiProperty({
    type: String,
    minLength: 3,
    maxLength: 128,
    required: false,
  })
  @Prop({
    type: String,
    length: 128,
    required: false,
  })
  headOfDepartmentPosition: string;

  @ApiProperty({
    type: String,
    minLength: 3,
    maxLength: 128,
    required: false,
  })
  @Prop({
    type: String,
    length: 128,
    required: false,
  })
  tenuredPostgraduateProfessor: string;

  @ApiProperty({
    type: String,
    minLength: 3,
    maxLength: 128,
    required: false,
  })
  @Prop({
    type: String,
    length: 128,
    required: false,
  })
  headOfService: string;

  @ApiProperty({
    type: Boolean,
    default: false,
  })
  @Prop({
    type: Boolean,
    default: false,
  })
  incoming: boolean;

  @ApiProperty({ type: Number })
  __v: number;
}

/** Specialty schema */
export const SpecialtySchema = SchemaFactory.createForClass(Specialty);
