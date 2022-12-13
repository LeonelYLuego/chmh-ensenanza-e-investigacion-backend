import { Module, forwardRef } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { SpecialtiesModule } from '@specialties/specialties.module';
import {
  RotationService,
  RotationServiceSchema,
} from './rotation-service.schema';
import { RotationServicesController } from './rotation-services.controller';
import { RotationServicesService } from './rotation-services.service';

/** Rotation Service module */
@Module({
  imports: [
    forwardRef(() =>
      MongooseModule.forFeature([
        { name: RotationService.name, schema: RotationServiceSchema },
      ]),
    ),
    forwardRef(() => SpecialtiesModule),
  ],
  controllers: [RotationServicesController],
  providers: [RotationServicesService],
  exports: [RotationServicesService],
})
export class RotationServicesModule {}
