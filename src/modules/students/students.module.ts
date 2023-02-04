import { Module, forwardRef } from '@nestjs/common';
import { StudentsService } from './students.service';
import { StudentsController } from './students.controller';
import { MongooseModule, Schema } from '@nestjs/mongoose';
import {
  SocialServicesModule,
  SocialServicesService,
} from 'modules/social-services';
import { Student, StudentSchema } from './student.schema';
import {
  OptionalMobilitiesModule,
  OptionalMobilitiesService,
} from 'modules/optional-mobilities';
import { ObligatoryMobilitiesModule } from 'modules/obligatory-mobilities/obligatory-mobilities.module';
import { ObligatoryMobilitiesService } from 'modules/obligatory-mobilities/services/obligatory-mobilities.service';

/** Student Module */
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
          name: Student.name,
          useFactory: (
            socialServicesService: SocialServicesService,
            optionalMobilitiesService: OptionalMobilitiesService,
            obligatoryMobilitiesService: ObligatoryMobilitiesService,
          ) => {
            const schema = StudentSchema;
            schema.post('findOneAndDelete', async function (document: Student) {
              // Deletes the associated objects like a cascada way
              await socialServicesService.deleteByStudent(document._id);
              await optionalMobilitiesService.deleteByStudent(document._id);
              await obligatoryMobilitiesService.deleteByStudent(document._id);
            });
            return schema;
          },
        },
      ]),
    ),
  ],
  controllers: [StudentsController],
  providers: [StudentsService],
  exports: [StudentsService],
})
export class StudentsModule {}
