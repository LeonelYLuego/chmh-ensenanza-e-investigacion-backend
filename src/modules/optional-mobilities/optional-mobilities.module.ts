import { Module } from '@nestjs/common';
import { OptionalMobilitiesService } from './optional-mobilities.service';
import { OptionalMobilitiesController } from './optional-mobilities.controller';
import { MongooseModule } from '@nestjs/mongoose';
import {
  OptionalMobility,
  OptionalMobilitySchema,
} from './optional-mobility.schema';
import { FilesService } from '@utils/services';

@Module({
  imports: [
    MongooseModule.forFeatureAsync([
      {
        name: OptionalMobility.name,
        useFactory: () => {
          const schema = OptionalMobilitySchema;
          return schema;
        },
      },
    ]),
  ],
  controllers: [OptionalMobilitiesController],
  providers: [OptionalMobilitiesService, FilesService],
})
export class OptionalMobilitiesModule {}
