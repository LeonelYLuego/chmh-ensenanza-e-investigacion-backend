import { HospitalsModule } from '@hospitals/hospitals.module';
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { SpecialtiesModule } from '@specialties/specialties.module';
import { TemplatesModule } from '@templates/templates.module';
import { FilesService } from '@utils/services';
import {
  AttachmentsObligatoryMobility,
  AttachmentsObligatoryMobilitySchema,
} from './attachments-obligatory-mobility.schema';
import { ObligatoryMobilitiesController } from './obligatory-mobilities.controller';
import { ObligatoryMobilitiesService } from './obligatory-mobilities.service';
import {
  ObligatoryMobility,
  ObligatoryMobilitySchema,
} from './obligatory-mobility.schema';

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
  controllers: [ObligatoryMobilitiesController],
  providers: [ObligatoryMobilitiesService, FilesService],
})
export class ObligatoryMobilitiesModule {}
