import { Module, forwardRef } from '@nestjs/common';
import { SocialServicesService } from './social-services.service';
import { SocialServicesController } from './social-services.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { SocialService, SocialServiceSchema } from './social-service.schema';
import { StudentsModule } from 'modules/students/students.module';
import { HospitalsModule } from 'modules/hospitals/hospitals.module';
import { MulterModule } from '@nestjs/platform-express';
import { FilesService } from '@utils/services/files.service';
import { TemplatesModule } from 'modules/templates/templates.module';
import { SpecialtiesModule } from 'modules/specialties/specialties.module';
import { SocialServicesQueries } from './services/queries.service';

@Module({
  imports: [
    forwardRef(() =>
      MongooseModule.forFeatureAsync([
        {
          name: SocialService.name,
          useFactory: () => {
            const schema = SocialServiceSchema;
            return schema;
          },
        },
      ]),
    ),
    MulterModule,
    forwardRef(() => HospitalsModule),
    forwardRef(() => StudentsModule),
    forwardRef(() => SpecialtiesModule),
    forwardRef(() => TemplatesModule),
  ],
  controllers: [SocialServicesController],
  providers: [SocialServicesService, FilesService, SocialServicesQueries],
  exports: [SocialServicesService],
})
export class SocialServicesModule {}
