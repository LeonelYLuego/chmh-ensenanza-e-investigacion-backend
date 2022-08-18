import { Module } from '@nestjs/common';
import { UsersModule } from '@users/users.module';
import { SpecialtiesModule } from './specialties/specialties.module';
import { StudentsModule } from './students/students.module';
import { HospitalsModule } from './hospitals/hospitals.module';

@Module({
  imports: [UsersModule, SpecialtiesModule, StudentsModule, HospitalsModule],
  controllers: [],
  providers: [],
})
/** @Module User's Module */
export class ModulesModule {}
