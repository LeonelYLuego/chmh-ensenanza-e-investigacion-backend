import { Module } from '@nestjs/common';
import { OptionalMobilitiesService } from './optional-mobilities.service';
import { OptionalMobilitiesController } from './optional-mobilities.controller';
import { MongooseModule } from '@nestjs/mongoose';
import {
  OptionalMobility,
  OptionalMobilitySchema,
} from './optional-mobility.schema';

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
  providers: [OptionalMobilitiesService],
})
export class OptionalMobilitiesModule {}
