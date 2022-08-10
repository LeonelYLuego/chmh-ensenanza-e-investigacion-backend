import { Module } from '@nestjs/common';
import { UsersModule } from '@users/users.module';
import { SpecialtiesModule } from './specialties/specialties.module';
import { StudentsModule } from './students/students.module';

@Module({
  imports: [UsersModule, SpecialtiesModule, StudentsModule],
  controllers: [],
  providers: [],
})
/** @Module User's Module */
export class ModulesModule {}
