import { Hospital } from '@hospitals/hospital.schema';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { Specialty } from '@specialties/specialty.schema';
import mongoose from 'mongoose';

/** Attachments Obligatory Mobility document */
export type AttachmentsObligatoryMobilityDocument =
  AttachmentsObligatoryMobility & Document;

/** Attachments Obligatory Mobility schema */
@Schema()
export class AttachmentsObligatoryMobility {
  @ApiProperty({ description: 'Attachments Obligatory Mobility primary key' })
  _id?: string;

  @ApiProperty({
    type: Date,
    description: 'Attachments Obligatory Mobility initial date',
  })
  @Prop({ type: Date })
  initialDate: Date;

  @ApiProperty({
    type: Date,
    description: 'Attachments Obligatory Mobility final date',
  })
  @Prop({ type: Date })
  finalDate: Date;

  @ApiProperty({
    type: String,
  })
  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Hospital',
  })
  hospital: Hospital;

  @ApiProperty({
    type: String,
  })
  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Specialty',
  })
  specialty: Specialty;

  @ApiProperty({
    type: String,
    required: false,
    description: 'Attachments Obligatory Mobility solicitude document name',
  })
  @Prop({ type: String, required: false })
  solicitudeDocument?: string;

  @ApiProperty({
    type: String,
    required: false,
    description: 'Attachments Obligatory Mobility acceptance document name',
  })
  @Prop({ type: String, required: false })
  acceptanceDocument?: string;

  @ApiProperty({})
  __v?: number;
}

/** Attachments Obligatory Mobility schema */
export const AttachmentsObligatoryMobilitySchema = SchemaFactory.createForClass(
  AttachmentsObligatoryMobility,
);
