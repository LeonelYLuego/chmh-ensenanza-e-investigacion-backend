import { Module, forwardRef } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { SpecialtiesModule } from '@specialties/specialties.module';
import { ObligatoryMobilitiesModule } from 'modules/obligatory-mobilities/obligatory-mobilities.module';
import { ObligatoryMobilitiesService } from 'modules/obligatory-mobilities/services/obligatory-mobilities.service';
import {
  OptionalMobilitiesModule,
  OptionalMobilitiesService,
} from 'modules/optional-mobilities';
import {
  RotationService,
  RotationServiceSchema,
} from './rotation-service.schema';
import { RotationServicesController } from './rotation-services.controller';
import { RotationServicesService } from './rotation-services.service';

/** Rotation Service module */
@Module({
  imports: [
    forwardRef(() =>
      MongooseModule.forFeatureAsync([
        {
          imports: [OptionalMobilitiesModule, ObligatoryMobilitiesModule],
          inject: [OptionalMobilitiesService, ObligatoryMobilitiesService],
          name: RotationService.name,
          useFactory: (
            optionalMobilitiesService: OptionalMobilitiesService,
            obligatoryMobilitiesService: ObligatoryMobilitiesService,
          ) => {
            const schema = RotationServiceSchema;
            schema.post(
              'findOneAndDelete',
              async function (document: RotationService) {
                await optionalMobilitiesService.deleteByRotationService(
                  document._id,
                );
                await obligatoryMobilitiesService.deleteByRotationService(
                  document._id,
                );
              },
            );
            return schema;
          },
        },
      ]),
    ),
    forwardRef(() => SpecialtiesModule),
  ],
  controllers: [RotationServicesController],
  providers: [RotationServicesService],
  exports: [RotationServicesService],
})
export class RotationServicesModule {}
