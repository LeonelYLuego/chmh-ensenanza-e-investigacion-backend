import { Module } from '@nestjs/common';
import { UsersModule } from '@users/users.module';

@Module({
  imports: [UsersModule],
})
/** @Module User's Module */
export class ModulesModule {}
