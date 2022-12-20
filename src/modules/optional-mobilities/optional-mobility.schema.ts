import { Hospital } from '@hospitals/hospital.schema';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { Student } from '@students/student.schema';
import { RotationService } from 'modules/rotation-services';
import mongoose from 'mongoose';

/** Optional Mobility document */
export type OptionalMobilityDocument = OptionalMobility & Document;

/** Optional Mobility schema */
@Schema()
export class OptionalMobility {
  @ApiProperty({ description: 'Optional Mobility primary key' })
  _id?: string;

  @ApiProperty({ type: Date, description: 'Optional Mobility initial date' })
  @Prop({ type: Date })
  initialDate: Date;

  @ApiProperty({ type: Date, description: 'Optional Mobility final date' })
  @Prop({ type: Date })
  finalDate: Date;

  @ApiProperty({
    type: String,
    required: false,
    description: 'Optional Mobility solicitude document name',
  })
  @Prop({ type: String, required: false })
  solicitudeDocument?: string;

  @ApiProperty({
    type: String,
    required: false,
    description: 'Optional Mobility presentation document name',
  })
  @Prop({ type: String, required: false })
  presentationOfficeDocument?: string;

  @ApiProperty({
    type: String,
    required: false,
    description: 'Optional Mobility acceptance document name',
  })
  @Prop({ type: String, required: false })
  acceptanceDocument?: string;

  @ApiProperty({
    type: String,
    required: false,
    description: 'Optional Mobility evaluation document name',
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

/** Optional Mobility schema */
export const OptionalMobilitySchema =
  SchemaFactory.createForClass(OptionalMobility);
