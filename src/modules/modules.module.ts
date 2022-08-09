import { Module } from '@nestjs/common';
import { UsersModule } from '@users/users.module';
import { SpecialtiesModule } from './specialties/specialties.module';

@Module({
  imports: [UsersModule, SpecialtiesModule],
})
/** @Module User's Module */
export class ModulesModule {}
