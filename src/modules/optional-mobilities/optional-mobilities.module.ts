import { HospitalsModule } from '@hospitals/hospitals.module';
import { forwardRef } from '@nestjs/common';
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { RotationServicesModule } from '@rotation-services/rotation-services.module';
import { SpecialtiesModule } from '@specialties/specialties.module';
import { TemplatesModule } from '@templates/templates.module';
import { FilesService } from '@utils/services';
import { OptionalMobilitiesController } from './optional-mobilities.controller';
import { OptionalMobilitiesService } from './optional-mobilities.service';
import {
  OptionalMobility,
  OptionalMobilitySchema,
} from './optional-mobility.schema';

/** Optional Mobilities module */
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
    forwardRef(() => RotationServicesModule),
    forwardRef(() => HospitalsModule),
    forwardRef(() => TemplatesModule),
    forwardRef(() => SpecialtiesModule),
  ],
  controllers: [OptionalMobilitiesController],
  providers: [OptionalMobilitiesService, FilesService],
  exports: [OptionalMobilitiesService],
})
export class OptionalMobilitiesModule {}
