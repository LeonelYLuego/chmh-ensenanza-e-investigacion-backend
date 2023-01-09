import { HospitalsModule } from '@hospitals/hospitals.module';
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { SpecialtiesModule } from '@specialties/specialties.module';
import { SpecialtiesService } from '@specialties/specialties.service';
import { FilesService } from '@utils/services';
import { RotationServicesModule } from 'modules/rotation-services';
import {
  IncomingStudent,
  IncomingStudentSchema,
} from './incoming-student.schema';
import { IncomingStudentsController } from './incoming-students.controller';
import { IncomingStudentsService } from './incoming-students.service';

@Module({
  imports: [
    MongooseModule.forFeatureAsync([
      {
        name: IncomingStudent.name,
        useFactory: () => {
          const schema = IncomingStudentSchema;
          return schema;
        },
      },
    ]),
    RotationServicesModule,
    HospitalsModule,
    SpecialtiesModule,
  ],
  controllers: [IncomingStudentsController],
  providers: [FilesService, IncomingStudentsService],
})
export class IncomingStudentsModule {}
