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

  @ApiProperty({ type: Number })
  __v: number;
}

/** Specialty schema */
export const SpecialtySchema = SchemaFactory.createForClass(Specialty);
