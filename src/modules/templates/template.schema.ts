import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';

/** Template document */
export type TemplatesDocument = Templates & Document;

/** Social Service Template schema */
@Schema()
export class SocialServiceTemplates {
  @ApiProperty({
    type: String,
    description: 'Social Service Presentation Office Template',
  })
  @Prop({ type: String, required: false, length: 64 })
  presentationOfficeDocument?: string;
}

/** Optional Mobilities Templates schema */
@Schema()
export class OptionalMobilitiesTemplates {
  @ApiProperty({
    type: String,
    description: 'Optional Mobility Solicitude Template',
  })
  @Prop({ type: String, required: false, length: 64 })
  solicitudeDocument?: string;

  @ApiProperty({
    type: String,
    description: 'Optional Mobility Presentation Office Template',
  })
  @Prop({ type: String, required: false, length: 64 })
  presentationOfficeDocument?: string;
}

/** Obligatory Mobilities Templates schema */
@Schema()
export class ObligatoryMobilitiesTemplates {
  @ApiProperty({
    type: String,
    description: 'Obligatory Mobility Solicitude Template',
  })
  @Prop({ type: String, required: false, length: 64 })
  solicitudeDocument?: string;
}

/** Incoming Students Templates schema */
@Schema()
export class IncomingStudentsTemplates {
  @ApiProperty({
    type: String,
    description: 'Incoming Students Acceptance Template',
  })
  @Prop({ type: String, required: false, length: 64 })
  acceptanceDocument?: string;
}

/** Template schema */
@Schema()
export class Templates {
  @ApiProperty({ type: String, description: 'Template primary key' })
  _id?: string;

  @ApiProperty({
    type: SocialServiceTemplates,
    description: 'Social Service Templates',
  })
  @Prop({ type: SocialServiceTemplates, required: true })
  socialService: SocialServiceTemplates;

  @ApiProperty({
    type: OptionalMobilitiesTemplates,
    description: 'Optional Mobilities Templates',
  })
  @Prop({ type: OptionalMobilitiesTemplates, required: true })
  optionalMobility: OptionalMobilitiesTemplates;

  @ApiProperty({
    type: ObligatoryMobilitiesTemplates,
    description: 'Obligatory Mobilities Templates',
  })
  @Prop({ type: ObligatoryMobilitiesTemplates, required: true })
  obligatoryMobility: ObligatoryMobilitiesTemplates;

  @ApiProperty({
    type: IncomingStudentsTemplates,
    description: 'Incoming Students Templates',
  })
  @Prop({ type: IncomingStudentsTemplates, required: true })
  incomingStudent: IncomingStudentsTemplates;

  @ApiProperty({ type: Number })
  __v?: number;
}

/** Template schema */
export const TemplateSchema = SchemaFactory.createForClass(Templates);
