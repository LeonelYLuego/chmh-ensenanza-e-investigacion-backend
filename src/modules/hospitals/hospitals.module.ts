import { Module, forwardRef, Inject } from '@nestjs/common';
import { HospitalsService } from './hospitals.service';
import { HospitalsController } from './hospitals.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Hospital, HospitalSchema } from './hospital.schema';
import {
  SocialServicesModule,
  SocialServicesService,
} from 'modules/social-services';
import { Model } from 'mongoose';
import {
  OptionalMobilitiesModule,
  OptionalMobilitiesService,
} from 'modules/optional-mobilities';

/** Hospital module */
@Module({
  imports: [
    forwardRef(() =>
      MongooseModule.forFeatureAsync([
        {
          imports: [SocialServicesModule, OptionalMobilitiesModule],
          inject: [SocialServicesService, OptionalMobilitiesService],
          name: Hospital.name,
          useFactory: (
            socialServicesService: SocialServicesService,
            optionalMobilitiesService: OptionalMobilitiesService,
          ) => {
            const schema = HospitalSchema;
            schema.post(
              'findOneAndDelete',
              async function (document: Hospital) {
                await socialServicesService.deleteByHospital(document._id);
                await optionalMobilitiesService.deleteByHospital(document._id);
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
