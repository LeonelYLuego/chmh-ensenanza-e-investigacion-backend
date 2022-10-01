import {
  Controller,
  UseInterceptors,
  Param,
  Query,
  Get,
  Put,
  UploadedFile,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import {
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiParam,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';
import { STORAGE_PATHS } from '@utils/constants/storage.constant';
import { ValidateTypeSocialServicePipe } from 'modules/social-services/pipes/validate-type-social-service.pipe';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { TemplatesService } from './templates.service';

@ApiTags('Templates')
@Controller('templates')
export class TemplatesController {
  constructor(private readonly templatesService: TemplatesService) {}

  @Put(':document')
  @ApiBearerAuth()
  @ApiParam({ name: 'document', type: String, enum: ['socialService'] })
  @ApiQuery({
    name: 'type',
    type: String,
    enum: ['presentationOfficeDocument'],
  })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: STORAGE_PATHS.TEMPLATES,
        filename: (req, file, cb) => {
          const randomName = Array(32)
            .fill(null)
            .map(() => Math.round(Math.random() * 16).toString(16))
            .join('');
          cb(null, `${randomName}${extname(file.originalname)}`);
        },
      }),
    }),
  )
  async updateDocument(
    @Param('document') document: string,
    @UploadedFile() file: Express.Multer.File,
    @Query('type', ValidateTypeSocialServicePipe) type: string,
  ) {
    await this.templatesService.updateTemplates(document, type, file);
  }

  // @Get(':document')
  // @ApiBearerAuth()
  // @ApiParam({ name: 'document', type: String, enum: ['socialService'] })
  // @ApiQuery({
  //   name: 'type',
  //   type: String,
  //   enum: ['presentationOfficeDocument'],
  // })
  // async getDocument(
  //   @Param('document') document: string,
  //   @Query('type') type: string,
  // ) {
  //   console.log('Validate param and query');
  //   await this.templatesService.getDocument(document, type);
  // }
}
