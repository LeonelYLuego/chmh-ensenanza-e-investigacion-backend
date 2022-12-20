import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { SpecialtiesModule } from '@specialties/specialties.module';
import { FilesService } from '@utils/services';
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
    ]),
    SpecialtiesModule,
  ],
  controllers: [ObligatoryMobilitiesController],
  providers: [ObligatoryMobilitiesService, FilesService],
})
export class ObligatoryMobilitiesModule {}
