import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { AuthMiddleware } from './auth/auth.middleware';
import { API_ENDPOINTS } from 'utils/constants/api-routes.constant';
import { ModulesModule } from './modules/modules.module';
import { FilesService } from '@utils/services/files.service';

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
/** @Module main application module */
export class AppModule implements NestModule {
  // Middle configuration
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(AuthMiddleware)
      .exclude({
        path:
          API_ENDPOINTS.AUTHENTICATION.BASE_PATH +
          '/' +
          API_ENDPOINTS.AUTHENTICATION.LOG_IN,
        method: RequestMethod.POST,
      })
      .forRoutes({ path: '*', method: RequestMethod.ALL });
  }
}
