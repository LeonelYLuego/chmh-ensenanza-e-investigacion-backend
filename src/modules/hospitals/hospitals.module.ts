import { Module, forwardRef, Inject } from '@nestjs/common';
import { HospitalsService } from './hospitals.service';
import { HospitalsController } from './hospitals.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Hospital, HospitalSchema } from './hospital.schema';
import {
  SocialServicesModule,
  SocialServicesService,
} from 'modules/social-services';
import {
  OptionalMobilitiesModule,
  OptionalMobilitiesService,
} from 'modules/optional-mobilities';
import { ObligatoryMobilitiesModule } from 'modules/obligatory-mobilities/obligatory-mobilities.module';
import { ObligatoryMobilitiesService } from 'modules/obligatory-mobilities/services/obligatory-mobilities.service';

/** Hospital module */
@Module({
  imports: [
    forwardRef(() =>
      MongooseModule.forFeatureAsync([
        {
          imports: [
            SocialServicesModule,
            OptionalMobilitiesModule,
            ObligatoryMobilitiesModule,
          ],
          inject: [
            SocialServicesService,
            OptionalMobilitiesService,
            ObligatoryMobilitiesService,
          ],
          name: Hospital.name,
          useFactory: (
            socialServicesService: SocialServicesService,
            optionalMobilitiesService: OptionalMobilitiesService,
            obligatoryMobilitiesService: ObligatoryMobilitiesService,
          ) => {
            const schema = HospitalSchema;
            schema.post(
              'findOneAndDelete',
              async function (document: Hospital) {
                // Deletes the associated objects like a cascada way
                await socialServicesService.deleteByHospital(document._id);
                await optionalMobilitiesService.deleteByHospital(document._id);
                await obligatoryMobilitiesService.deleteByHospital(
                  document._id,
                );
              },
            );
            return schema;
          },
        },
      ]),
    ),
  ],
  controllers: [HospitalsController],
  providers: [HospitalsService],
  exports: [HospitalsService],
})
export class HospitalsModule {}
