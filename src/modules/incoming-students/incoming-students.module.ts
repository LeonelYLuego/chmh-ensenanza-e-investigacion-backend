import { HospitalsModule } from '@hospitals/hospitals.module';
import { Module } from '@nestjs/common';
import { forwardRef } from '@nestjs/common/utils';
import { MongooseModule } from '@nestjs/mongoose';
import { SpecialtiesModule } from '@specialties/specialties.module';
import { TemplatesModule } from '@templates/templates.module';
import { FilesService } from '@utils/services';
import { RotationServicesModule } from 'modules/rotation-services';
import {
  IncomingStudent,
  IncomingStudentSchema,
} from './incoming-student.schema';
import { IncomingStudentsController } from './incoming-students.controller';
import { IncomingStudentsService } from './incoming-students.service';

/** Incoming Student module */
@Module({
  imports: [
    forwardRef(() =>
      MongooseModule.forFeatureAsync([
        {
          name: IncomingStudent.name,
          useFactory: () => {
            const schema = IncomingStudentSchema;
            return schema;
          },
        },
      ]),
    ),
    forwardRef(() => RotationServicesModule),
    forwardRef(() => HospitalsModule),
    forwardRef(() => SpecialtiesModule),
    forwardRef(() => TemplatesModule),
  ],
  controllers: [IncomingStudentsController],
  providers: [FilesService, IncomingStudentsService],
  exports: [IncomingStudentsService],
})
export class IncomingStudentsModule {}
