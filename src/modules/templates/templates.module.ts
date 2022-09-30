import { Module } from '@nestjs/common';
import { TemplatesService } from './templates.service';
import { TemplatesController } from './templates.controller';
import { Templates, TemplateSchema } from './template.schema';
import { MongooseModule } from '@nestjs/mongoose';
import { FilesService } from '@utils/services/files.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Templates.name, schema: TemplateSchema },
    ]),
  ],
  controllers: [TemplatesController],
  providers: [TemplatesService, FilesService],
})
export class TemplatesModule {}
