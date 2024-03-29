import {
  Controller,
  UseInterceptors,
  Param,
  Query,
  Put,
  UploadedFile,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import {
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiForbiddenResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { API_ENDPOINTS } from '@utils/constants';
import { STORAGE_PATHS } from '@utils/constants/storage.constant';
import { HttpResponse } from '@utils/dtos';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { TemplatesService } from './templates.service';

@ApiTags('Templates')
@Controller(API_ENDPOINTS.TEMPLATES.BASE_PATH)
export class TemplatesController {
  constructor(private readonly templatesService: TemplatesService) {}

  @Put(`:${API_ENDPOINTS.TEMPLATES.BY_DOCUMENT}`)
  @ApiOperation({
    summary: '[Users] Update Document Template',
    description: 'Updates a Document `Template` in the database',
  })
  @ApiBearerAuth()
  @ApiParam({
    name: 'document',
    type: String,
    enum: [
      'socialService',
      'optionalMobility',
      'obligatoryMobility',
      'incomingStudent',
    ],
  })
  @ApiQuery({
    name: 'type',
    description: 'document type',
    type: String,
    enum: [
      'presentationOfficeDocument',
      'solicitudeDocument',
      'acceptanceDocument',
    ],
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
  @ApiOkResponse({})
  @ApiForbiddenResponse({
    description: '`file must be a docx`',
  })
  @ApiUnauthorizedResponse({
    description: 'Not authorized to perform the query',
  })
  async updateDocument(
    @Param('document')
    document:
      | 'socialService'
      | 'optionalMobility'
      | 'obligatoryMobility'
      | 'incomingStudent',
    @UploadedFile() file: Express.Multer.File,
    @Query('type')
    type:
      | 'solicitudeDocument'
      | 'presentationOfficeDocument'
      | 'acceptanceDocument',
  ): Promise<HttpResponse<undefined>> {
    await this.templatesService.updateTemplates(document, type, file);
    return {};
  }
}
