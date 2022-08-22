import { Module } from '@nestjs/common';
import { UsersModule } from '@users/users.module';
import { SpecialtiesModule } from './specialties/specialties.module';
import { StudentsModule } from './students/students.module';
import { HospitalsModule } from './hospitals/hospitals.module';
import { FilesModule } from './files/files.module';
import { SocialServicesModule } from './social-services/social-services.module';

@Module({
  imports: [
    HospitalsModule,
    SocialServicesModule,
    SpecialtiesModule,
    StudentsModule,
    UsersModule,
    FilesModule,
  ],
  controllers: [],
  providers: [],
})
/** @Module User's Module */
export class ModulesModule {}
