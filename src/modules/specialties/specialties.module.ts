import {
  IncomingStudentsModule,
  IncomingStudentsService,
} from '@incoming-students/index';
import { Module, forwardRef } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { StudentsModule } from '@students/students.module';
import { StudentsService } from '@students/students.service';
import {
  RotationServicesModule,
  RotationServicesService,
} from 'modules/rotation-services';
import { SpecialtiesController } from './specialties.controller';
import { SpecialtiesService } from './specialties.service';
import { Specialty, SpecialtySchema } from './specialty.schema';

/** Specialty module */
@Module({
  imports: [
    forwardRef(() =>
      MongooseModule.forFeatureAsync([
        {
          imports: [
            StudentsModule,
            RotationServicesModule,
            IncomingStudentsModule,
          ],
          inject: [
            StudentsService,
            RotationServicesService,
            IncomingStudentsService,
          ],
          name: Specialty.name,
          useFactory: (
            studentsService: StudentsService,
            rotationServicesService: RotationServicesService,
            incomingStudent: IncomingStudentsService,
          ) => {
            const schema = SpecialtySchema;
            schema.post(
              'findOneAndDelete',
              async function (document: Specialty) {
                // Deletes the associated objects like a cascada way
                await studentsService.deleteBySpecialty(document._id);
                await rotationServicesService.deleteBySpecialty(document._id);
                await incomingStudent.deleteByIncomingSpecialty(document._id);
              },
            );
            return schema;
          },
        },
      ]),
    ),
  ],
  controllers: [SpecialtiesController],
  providers: [SpecialtiesService],
  exports: [SpecialtiesService],
})
export class SpecialtiesModule {}
