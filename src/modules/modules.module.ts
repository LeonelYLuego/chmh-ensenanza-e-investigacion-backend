import { Module } from "@nestjs/common";
import { HospitalsModule } from "./hospitals";
import { SocialServicesModule } from "./social-services";
import { SpecialtiesModule } from "./specialties";
import { StudentsModule } from "./students";
import { TemplatesModule } from "./templates";
import { UsersModule } from "./users";


/** @module Modules */
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
export class ModulesModule {}
