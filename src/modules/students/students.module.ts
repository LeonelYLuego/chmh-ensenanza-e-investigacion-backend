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

/** Student Module */
@Module({
  imports: [
    forwardRef(() =>
      MongooseModule.forFeatureAsync([
        {
          imports: [SocialServicesModule, OptionalMobilitiesModule],
          inject: [SocialServicesService, OptionalMobilitiesService],
          name: Student.name,
          useFactory: (
            socialServicesService: SocialServicesService,
            optionalMobilitiesService: OptionalMobilitiesService,
          ) => {
            const schema = StudentSchema;
            schema.post('findOneAndDelete', async function (document: Student) {
              await socialServicesService.deleteByStudent(document._id);
              await optionalMobilitiesService.deleteByStudent(document._id);
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
