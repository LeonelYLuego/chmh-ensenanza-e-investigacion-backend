import {
  Module,
  NestModule,
  MiddlewareConsumer,
  RequestMethod,
  forwardRef
} from '@nestjs/common';
import { AuthMiddleware } from '@auth/auth.middleware';
import { AuthModule } from '@auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { API_ENDPOINTS } from '@utils/constants/api-routes.constant';
import { SocialServicesModule } from 'modules/social-services';
import { HospitalsModule } from '@hospitals/hospitals.module';
import { SpecialtiesModule } from '@specialties/specialties.module';
import { StudentsModule } from '@students/students.module';
import { UsersModule } from '@users/users.module';
import { TemplatesModule } from '@templates/templates.module';
import { RotationServicesModule } from 'modules/rotation-services/rotation-services.module';

/** main application module */
@Module({
  imports: [
    MongooseModule.forRoot(
      'mongodb://localhost/CHMH-Ensenanza-e-Investigacion',
    ),
    AuthModule,
    ConfigModule,
    UsersModule,
    SocialServicesModule,
    HospitalsModule,
    SpecialtiesModule,
    StudentsModule,
    TemplatesModule,
    RotationServicesModule,
  ],
})
export class AppModule implements NestModule {
  // Middle configuration
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(AuthMiddleware)
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
