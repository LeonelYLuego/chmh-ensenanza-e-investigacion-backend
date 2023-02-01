import { HospitalsModule } from '@hospitals/hospitals.module';
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { SpecialtiesModule } from '@specialties/specialties.module';
import { TemplatesModule } from '@templates/templates.module';
import { FilesService } from '@utils/services';
import {
  AttachmentsObligatoryMobility,
  AttachmentsObligatoryMobilitySchema,
} from './schemas/attachments-obligatory-mobility.schema';
import { AttachmentsObligatoryMobilitiesService } from './services/attachments-obligatory-movility.service';
import { ObligatoryMobilitiesController } from './controllers/obligatory-mobilities.controller';
import {
  ObligatoryMobility,
  ObligatoryMobilitySchema,
} from './schemas/obligatory-mobility.schema';
import { ObligatoryMobilitiesService } from './services/obligatory-mobilities.service';
import { AttachmentsObligatoryMobilitiesController } from './controllers/attachments-obligatory-mobilities.controller';

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
    SpecialtiesModule,
    HospitalsModule,
    TemplatesModule,
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
})
export class ObligatoryMobilitiesModule {}
