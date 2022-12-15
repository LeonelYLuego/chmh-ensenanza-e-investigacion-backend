import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { FilesService } from '@utils/services';
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
  ],
  controllers: [],
  providers: [ObligatoryMobilitiesService, FilesService],
})
export class ObligatoryMobilitiesModule {}
