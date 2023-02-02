import { Module, forwardRef } from '@nestjs/common';
import { OptionalMobilitiesService } from './optional-mobilities.service';
import { OptionalMobilitiesController } from './optional-mobilities.controller';
import { MongooseModule } from '@nestjs/mongoose';
import {
  OptionalMobility,
  OptionalMobilitySchema,
} from './optional-mobility.schema';
import { FilesService } from '@utils/services';
import { HospitalsModule } from '@hospitals/hospitals.module';
import { TemplatesModule } from '@templates/templates.module';
import { SpecialtiesModule } from '@specialties/specialties.module';
import { RotationServicesModule } from 'modules/rotation-services';

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
