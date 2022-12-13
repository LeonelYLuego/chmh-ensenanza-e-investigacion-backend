import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { Specialty } from '@specialties/specialty.schema';
import mongoose from 'mongoose';

/** Rotation Service document */
export type RotationServiceDocument = RotationService & Document;

/** Rotation Service schema */
@Schema()
export class RotationService {
  @ApiProperty({ type: String, description: 'Rotation Service primary key' })
  _id?: string;

  @ApiProperty({ type: String, description: 'Rotation Service specialty' })
  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Specialty',
    required: true,
  })
  specialty: Specialty;

  @ApiProperty({ type: String })
  @Prop({
    type: String,
    length: 64,
  })
  value: string;

  @ApiProperty({ type: Number })
  __v?: number;
}

/** Rotation Service schema */
export const RotationServiceSchema =
  SchemaFactory.createForClass(RotationService);
