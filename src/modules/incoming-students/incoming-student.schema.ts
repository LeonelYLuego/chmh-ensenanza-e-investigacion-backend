import { Hospital } from '@hospitals/hospital.schema';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { Specialty } from '@specialties/specialty.schema';
import { RotationService } from 'modules/rotation-services';
import mongoose from 'mongoose';

/** Incoming Student document */
export type IncomingStudentDocument = IncomingStudent & Document;

/** Incoming Student Schema */
@Schema()
export class IncomingStudent {
  @ApiProperty({ type: String, description: 'Incoming Student primary key' })
  _id?: string;

  @ApiProperty({ type: String, description: 'Incoming Student code' })
  @Prop({ type: String, required: false, length: 64 })
  code?: string;

  @ApiProperty({ type: String, description: 'Incoming Student name' })
  @Prop({ type: String, length: 32 })
  name: string;

  @ApiProperty({
    type: String,
    description: 'Incoming Student first last name',
  })
  @Prop({ type: String, length: 32 })
  firstLastName: string;

  @ApiProperty({
    type: String,
    description: 'Incoming Student second last name',
  })
  @Prop({ type: String, required: false, length: 32 })
  secondLastName?: string;

  @ApiProperty({
    type: [String],
    description: 'Incoming Student phones',
    default: [],
  })
  @Prop({ type: [{ type: String, length: 16 }] })
  phones: string[];

  @ApiProperty({
    type: [String],
    description: 'Incoming Student emails',
    default: [],
  })
  @Prop({ type: [{ type: String, length: 64 }] })
  emails: string[];

  @ApiProperty({ description: 'Incoming Student initial date' })
  @Prop({ type: Date })
  initialDate: Date;

  @ApiProperty({ description: 'Incoming Student final date' })
  @Prop({ type: Date })
  finalDate: Date;

  @ApiProperty({
    type: String,
    required: false,
    description: 'Incoming Student solicitude document name',
  })
  @Prop({ type: String, required: false })
  solicitudeDocument?: string;

  @ApiProperty({
    type: Boolean,
    required: false,
    default: false,
    description: 'Incoming Student solicitude vobo',
  })
  @Prop({ type: Boolean, default: false })
  solicitudeVoBo?: boolean;

  @ApiProperty({
    type: String,
    required: false,
    description: 'Incoming Student acceptance document name',
  })
  @Prop({ type: String, required: false })
  acceptanceDocument?: string;

  @ApiProperty({
    type: String,
    required: false,
    description: 'Incoming Student evaluation document name',
  })
  @Prop({ type: String, required: false })
  evaluationDocument?: string;

  @ApiProperty({
    type: String,
  })
  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Specialty',
  })
  incomingSpecialty: Specialty;

  @ApiProperty({
    type: Number,
    minimum: 1,
    maximum: 6,
  })
  @Prop({
    type: Number,
    min: 1,
    max: 6,
  })
  incomingYear: number;

  @ApiProperty({
    type: String,
  })
  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'RotationService',
  })
  rotationService: RotationService;

  @ApiProperty({
    type: String,
  })
  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Hospital',
  })
  hospital: Hospital;

  @ApiProperty({
    type: Boolean,
    default: false,
    required: false,
  })
  @Prop({
    type: Boolean,
    default: false,
    required: false,
  })
  canceled?: boolean;

  @ApiProperty({ type: Number })
  __v?: number;
}

/** Incoming Student schema */
export const IncomingStudentSchema =
  SchemaFactory.createForClass(IncomingStudent);
