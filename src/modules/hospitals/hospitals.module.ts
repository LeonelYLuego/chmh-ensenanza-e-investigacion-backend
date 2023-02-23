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
import {
  IncomingStudentsModule,
  IncomingStudentsService,
} from '@incoming-students/index';

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
            IncomingStudentsModule,
          ],
          inject: [
            SocialServicesService,
            OptionalMobilitiesService,
            ObligatoryMobilitiesService,
            IncomingStudentsService,
          ],
          name: Hospital.name,
          useFactory: (
            socialServicesService: SocialServicesService,
            optionalMobilitiesService: OptionalMobilitiesService,
            obligatoryMobilitiesService: ObligatoryMobilitiesService,
            IncomingStudentsService: IncomingStudentsService,
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
                await IncomingStudentsService.deleteByHospital(document._id);
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
