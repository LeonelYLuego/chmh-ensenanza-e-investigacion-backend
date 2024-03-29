import { Hospital } from '@hospitals/hospital.schema';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { Student } from '@students/student.schema';
import { RotationService } from 'modules/rotation-services';
import mongoose from 'mongoose';

/** Obligatory Mobility document */
export type ObligatoryMobilityDocument = ObligatoryMobility & Document;

/** Obligatory Mobility schema */
@Schema()
export class ObligatoryMobility {
  @ApiProperty({ description: 'Obligatory Mobility primary key' })
  _id?: string;

  @ApiProperty({ type: Date, description: 'Obligatory Mobility initial date' })
  @Prop({ type: Date })
  initialDate: Date;

  @ApiProperty({ type: Date, description: 'Obligatory Mobility final date' })
  @Prop({ type: Date })
  finalDate: Date;

  @ApiProperty({
    type: String,
    required: false,
    description: 'Obligatory Mobility presentation document name',
  })
  @Prop({ type: String, required: false })
  presentationOfficeDocument?: string;

  @ApiProperty({
    type: String,
    required: false,
    description: 'Obligatory Mobility evaluation document name',
  })
  @Prop({ type: String, required: false })
  evaluationDocument?: string;

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
    ref: 'Student',
  })
  student: Student;

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

  @ApiProperty({})
  __v?: number;
}

/** Obligatory Mobility schema */
export const ObligatoryMobilitySchema =
  SchemaFactory.createForClass(ObligatoryMobility);
