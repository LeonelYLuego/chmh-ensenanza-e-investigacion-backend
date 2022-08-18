import { Module } from '@nestjs/common';
import { SocialServicesService } from './social-services.service';
import { SocialServicesController } from './social-services.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { SocialService, SocialServiceSchema } from './social-service.schema';
import { StudentsModule } from 'modules/students/students.module';
import { HospitalsModule } from 'modules/hospitals/hospitals.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: SocialService.name, schema: SocialServiceSchema },
    ]),
    StudentsModule,
    HospitalsModule,
  ],
  controllers: [SocialServicesController],
  providers: [SocialServicesService],
})
export class SocialServicesModule {}
