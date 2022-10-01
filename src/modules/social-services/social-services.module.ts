import { Module } from '@nestjs/common';
import { SocialServicesService } from './social-services.service';
import { SocialServicesController } from './social-services.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { SocialService, SocialServiceSchema } from './social-service.schema';
import { StudentsModule } from 'modules/students/students.module';
import { HospitalsModule } from 'modules/hospitals/hospitals.module';
import { MulterModule } from '@nestjs/platform-express';
import { FilesService } from '@utils/services/files.service';
import { TemplatesModule } from 'modules/templates/templates.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: SocialService.name, schema: SocialServiceSchema },
    ]),
    MulterModule,
    StudentsModule,
    HospitalsModule,
    TemplatesModule,
  ],
  controllers: [SocialServicesController],
  providers: [SocialServicesService, FilesService],
})
export class SocialServicesModule {}
