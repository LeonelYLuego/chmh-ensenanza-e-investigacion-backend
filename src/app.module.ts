import {
  Module,
  NestModule,
  MiddlewareConsumer,
  RequestMethod,
} from '@nestjs/common';
import { AuthMiddleware } from '@auth/auth.middleware';
import { AuthModule } from '@auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { API_ENDPOINTS } from '@utils/constants/api-routes.constant';
import { ModulesModule } from 'modules/modules.module';

/** main application module */
@Module({
  imports: [
    MongooseModule.forRoot(
      'mongodb://localhost/CHMH-Ensenanza-e-Investigacion',
    ),
    AuthModule,
    ConfigModule,
    ModulesModule,
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
