import { Hospital } from '@hospitals/hospital.schema';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { Student } from '@students/student.schema';
import { RotationService } from 'modules/rotation-services';
import mongoose from 'mongoose';

export type ObligatoryMobilityDocument = ObligatoryMobility & Document;

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

  @ApiProperty({})
  __v?: number;
}

export const ObligatoryMobilitySchema =
  SchemaFactory.createForClass(ObligatoryMobility);
