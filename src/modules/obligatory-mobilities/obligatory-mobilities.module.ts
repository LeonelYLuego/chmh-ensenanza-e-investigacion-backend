import { HospitalsModule } from '@hospitals/hospitals.module';
import { forwardRef } from '@nestjs/common';
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { SpecialtiesModule } from '@specialties/specialties.module';
import { TemplatesModule } from '@templates/templates.module';
import { FilesService } from '@utils/services';
import { AttachmentsObligatoryMobilitiesController } from './controllers/attachments-obligatory-mobilities.controller';
import { ObligatoryMobilitiesController } from './controllers/obligatory-mobilities.controller';
import {
  AttachmentsObligatoryMobility,
  AttachmentsObligatoryMobilitySchema,
} from './schemas/attachments-obligatory-mobility.schema';
import {
  ObligatoryMobility,
  ObligatoryMobilitySchema,
} from './schemas/obligatory-mobility.schema';
import { AttachmentsObligatoryMobilitiesService } from './services/attachments-obligatory-mobility.service';
import { ObligatoryMobilitiesService } from './services/obligatory-mobilities.service';

/** Obligatory Mobilities module */
@Module({
  imports: [
    MongooseModule.forFeatureAsync([
      {
        name: ObligatoryMobility.name,
        useFactory: () => {
          const schema = ObligatoryMobilitySchema;
          return schema;
        },
      },
      {
        name: AttachmentsObligatoryMobility.name,
        useFactory: () => {
          const schema = AttachmentsObligatoryMobilitySchema;
          return schema;
        },
      },
    ]),
    forwardRef(() => SpecialtiesModule),
    forwardRef(() => HospitalsModule),
    forwardRef(() => TemplatesModule),
  ],
  controllers: [
    AttachmentsObligatoryMobilitiesController,
    ObligatoryMobilitiesController,
  ],
  providers: [
    ObligatoryMobilitiesService,
    AttachmentsObligatoryMobilitiesService,
    FilesService,
  ],
  exports: [ObligatoryMobilitiesService],
})
export class ObligatoryMobilitiesModule {}
