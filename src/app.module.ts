import { AuthMiddleware } from '@auth/auth.middleware';
import { AuthModule } from '@auth/auth.module';
import { HospitalsModule } from '@hospitals/hospitals.module';
import { IncomingStudentsModule } from '@incoming-students/incoming-students.module';
import { RequestMethod } from '@nestjs/common';
import { MiddlewareConsumer } from '@nestjs/common';
import { NestModule } from '@nestjs/common';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { ServeStaticModule } from '@nestjs/serve-static';
import { ObligatoryMobilitiesModule } from '@obligatory-mobilities/obligatory-mobilities.module';
import { OptionalMobilitiesModule } from '@optional-mobilities/optional-mobilities.module';
import { RotationServicesModule } from '@rotation-services/rotation-services.module';
import { SocialServicesModule } from '@social-services/social-services.module';
import { SpecialtiesModule } from '@specialties/specialties.module';
import { StudentsModule } from '@students/students.module';
import { TemplatesModule } from '@templates/templates.module';
import { UsersModule } from '@users/users.module';
import { API_ENDPOINTS } from '@utils/constants';

/** main application module */
@Module({
  imports: [
    MongooseModule.forRoot(
      'mongodb://127.0.0.1/CHMH-Ensenanza-e-Investigacion',
    ),
    ConfigModule,
    AuthModule,
    UsersModule,
    SocialServicesModule,
    ObligatoryMobilitiesModule,
    OptionalMobilitiesModule,
    IncomingStudentsModule,
    HospitalsModule,
    SpecialtiesModule,
    RotationServicesModule,
    StudentsModule,
    TemplatesModule,
    ServeStaticModule.forRoot({
      rootPath:
        './client',
    }),
  ],
})
export class AppModule implements NestModule {
  // Middle configuration
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(AuthMiddleware)
      //Exclude loading and front pages
      .exclude({
        path:
          'api' +
          API_ENDPOINTS.AUTHENTICATION.BASE_PATH +
          '/' +
          API_ENDPOINTS.AUTHENTICATION.LOG_IN,
        method: RequestMethod.POST,
      })
      .forRoutes({ path: '*', method: RequestMethod.ALL });
  }
}
