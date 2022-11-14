import { Module, forwardRef } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { StudentsModule } from '@students/students.module';
import { StudentsService } from '@students/students.service';
import { RotationServicesModule, RotationServicesService } from 'modules/rotation-services';
import { SpecialtiesController } from './specialties.controller';
import { SpecialtiesService } from './specialties.service';
import { Specialty, SpecialtySchema } from './specialty.schema';

/** Specialty module */
@Module({
  imports: [
    forwardRef(() =>
      MongooseModule.forFeature([
        {
          name: Specialty.name,
          schema: SpecialtySchema,
        },
      ]),
    ),
    forwardRef(() =>
    MongooseModule.forFeatureAsync([
      {
        imports: [StudentsModule, RotationServicesModule],
        inject: [StudentsService, RotationServicesService],
        name: Specialty.name,
        useFactory: (
          studentsService: StudentsService,
          rotationServicesService: RotationServicesService,
        ) => {
          const schema = SpecialtySchema;
          schema.post('findOneAndDelete', async function (document: Specialty) {
            await studentsService.deleteBySpecialty(document._id);
            await rotationServicesService.deleteBySpecialty(document._id);
          });
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
