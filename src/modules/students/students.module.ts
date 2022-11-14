import { Module, forwardRef } from '@nestjs/common';
import { StudentsService } from './students.service';
import { StudentsController } from './students.controller';
import { MongooseModule, Schema } from '@nestjs/mongoose';
import {
  SocialServicesModule,
  SocialServicesService,
} from 'modules/social-services';
import { Student, StudentSchema } from './student.schema';

/** Student Module */
@Module({
  imports: [
    // MongooseModule.forFeature([
    //   {
    //     name: Student.name,
    //     schema: StudentSchema,
    //   },
    // ]),
    forwardRef(() =>
      MongooseModule.forFeatureAsync([
        {
          imports: [SocialServicesModule],
          inject: [SocialServicesService],
          name: Student.name,
          useFactory: (socialServicesService: SocialServicesService) => {
            const schema = StudentSchema;
            schema.post('findOneAndDelete', async function (document: Student) {
              await socialServicesService.deleteByHospital(document._id);
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
