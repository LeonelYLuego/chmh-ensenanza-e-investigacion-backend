import { Module } from '@nestjs/common';
import { UsersModule } from '@users/users.module';
import { SpecialtiesModule } from './specialties/specialties.module';
import { StudentsModule } from './students/students.module';
import { HospitalsModule } from './hospitals/hospitals.module';
import { SocialServicesModule } from './social-services/social-services.module';
import { TemplatesModule } from './templates/templates.module';

@Module({
  imports: [
    HospitalsModule,
    SocialServicesModule,
    SpecialtiesModule,
    StudentsModule,
    UsersModule,
    TemplatesModule,
  ],
  controllers: [],
  providers: [],
})
/** @Module User's Module */
export class ModulesModule {}
