import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';

/** Hospital document */
export type HospitalDocument = Hospital & Document;

@Schema()
export class Receiver {
  @ApiProperty({type: String, description: 'Receiver position'})
  @Prop({type: String, required: true, length: 64})
  position: string;

  @ApiProperty({type: String, description: 'Receiver name'})
  @Prop({type: String, required: true, length: 128})
  name: string;
}

/** Address schema */
@Schema()
export class Address {
  @ApiProperty({ type: String, description: 'Address country', required: true })
  @Prop({ type: String, required: true, length: 64 })
  country: string;

  @ApiProperty({ type: String, description: 'Address state', required: true })
  @Prop({ type: String, required: true, length: 64 })
  state: string;

  @ApiProperty({ type: String, description: 'Address city', required: true })
  @Prop({ type: String, required: true, length: 64 })
  city: string;

  @ApiProperty({ type: String, description: 'Address street', required: true })
  @Prop({ type: String, required: true, length: 64 })
  street: string;
}

/** Hospital */
@Schema()
export class Hospital {
  @ApiProperty({ type: String, description: 'Hospital primary key' })
  _id: string;

  @ApiProperty({ type: String, description: 'Hospital name' })
  @Prop({ type: String, required: true, length: 64 })
  name: string;

  @ApiProperty({
    type: String,
    description: 'Hospital acronym',
    required: false,
  })
  @Prop({ type: String, required: false, length: 4 })
  acronym?: string;

  @ApiProperty({
    type: Receiver,
    description: 'First receiver',
    required: false,
  })
  @Prop({type: Receiver, required: false})
  firstReceiver?: Receiver;

  @ApiProperty({
    type: Receiver,
    description: 'Second receiver, with attention to',
    required: false,
  })
  @Prop({type: Receiver, required: false})
  secondReceiver?: Receiver;

  @ApiProperty({
    type: Address,
    description: 'Hospital address',
    required: false,
  })
  @Prop({ type: Address, required: false })
  address?: Address;

  @ApiProperty({ type: [String], description: 'Hospital phones', default: [] })
  @Prop({ type: [{ type: String, length: 16 }], default: [] })
  phones: string[];

  @ApiProperty({ type: [String], description: 'Hospital emails', default: [] })
  @Prop({ type: [{ type: String, length: 64 }], default: [] })
  emails: string[];

  @ApiProperty({
    type: Boolean,
    description:
      'Hospital social service: `true` = is social service hospital, `false` = is not a social service hospital',
    required: true,
    default: false,
  })
  @Prop({ type: Boolean, default: false, required: true })
  socialService: boolean;

  @ApiProperty({ type: Number })
  __v: number;
}

/** Hospital schema */
export const HospitalSchema = SchemaFactory.createForClass(Hospital);
