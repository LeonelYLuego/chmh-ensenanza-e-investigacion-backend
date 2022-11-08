import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Query,
  Put,
  UseInterceptors,
  UploadedFile,
  StreamableFile,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import {
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiCreatedResponse,
  ApiForbiddenResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { API_ENDPOINTS, STORAGE_PATHS } from '@utils/constants';
import { HttpResponse } from '@utils/dtos';
import {
  ValidateIdPipe,
  ValidatePeriodPipe,
  ValidateYearPipe,
} from '@utils/pipes';
import { ValidateDatePipe } from '@utils/pipes/validate-date.pipe';
import { ValidateNumberPipe } from '@utils/pipes/validate-number.pipe';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { CreateSocialServiceDto } from './dto/create-social-service.dto';
import { FromYearToYearDto } from './dto/from-year-to-year.dto';
import { SocialServiceBySpecialtyDto } from './dto/social-service-by-specialty.dto';
import { UpdateSocialServiceDto } from './dto/update-social-service.dto';
import { ValidateSocialServiceDocumentTypePipe } from './pipes/validate-social-service-document-type.pipe';
import { SocialService } from './social-service.schema';
import { SocialServicesService } from './social-services.service';
import { SocialServiceDocumentTypes } from './types/document.types';

@ApiTags('Social Services')
@Controller(API_ENDPOINTS.SOCIAL_SERVICES.BASE_PATH)
export class SocialServicesController {
  constructor(private readonly socialServicesService: SocialServicesService) {}

  @Post()
  @ApiOperation({
    summary: '[Users] Add a Social Service in the database',
    description:
      'Creates a new `social service` in the database and returns the created `social service`',
  })
  @ApiBearerAuth()
  @ApiCreatedResponse({
    type: SocialService,
    description: 'The created `social service`',
  })
  @ApiUnauthorizedResponse({
    description: 'Not authorized to perform the query',
  })
  async create(
    @Body() createSocialServiceDto: CreateSocialServiceDto,
  ): Promise<HttpResponse<SocialService>> {
    return {
      data: await this.socialServicesService.create(createSocialServiceDto),
    };
  }

  @Get()
  @ApiOperation({
    summary: '[Users] Find all Social Services in the database',
    description:
      'Finds in the database all `social services` and returns an array of `social services`',
  })
  @ApiBearerAuth()
  @ApiQuery({ type: Number, name: 'initialPeriod' })
  @ApiQuery({ type: Number, name: 'initialYear' })
  @ApiQuery({ type: Number, name: 'finalPeriod' })
  @ApiQuery({ type: Number, name: 'finalYear' })
  @ApiOkResponse({
    type: [SocialServiceBySpecialtyDto],
    description: 'Array of `social services`',
  })
  @ApiForbiddenResponse({
    description: '`invalid period`',
  })
  @ApiUnauthorizedResponse({
    description: 'Not authorized to perform the query',
  })
  async findAll(
    @Query('initialPeriod', ValidatePeriodPipe) initialPeriod: number,
    @Query('initialYear', ValidateYearPipe) initialYear: number,
    @Query('finalPeriod', ValidatePeriodPipe) finalPeriod: number,
    @Query('finalYear', ValidateYearPipe) finalYear: number,
  ): Promise<HttpResponse<SocialServiceBySpecialtyDto[]>> {
    return {
      data: await this.socialServicesService.findAll({
        initialPeriod,
        initialYear,
        finalPeriod,
        finalYear,
      }),
    };
  }

  @Get(API_ENDPOINTS.SOCIAL_SERVICES.PERIODS)
  @ApiOperation({
    summary: '[Users] Get Social Service periods',
    description:
      'Gets from Social Services the first and last registered period years',
  })
  @ApiBearerAuth()
  @ApiOkResponse({
    type: FromYearToYearDto,
    description: 'The first and last registered period years',
  })
  @ApiUnauthorizedResponse({
    description: 'Not authorized to perform the query',
  })
  async getPeriods(): Promise<HttpResponse<FromYearToYearDto>> {
    return {
      data: await this.socialServicesService.getPeriods(),
    };
  }

  @Get(API_ENDPOINTS.SOCIAL_SERVICES.GENERATE)
  @ApiOperation({
    summary: '[Users] Generate Social Service documents',
    description:
      'Generates Social Service documents and returns them in a zip file',
  })
  @ApiBearerAuth()
  @ApiQuery({ type: Number, name: 'initialNumberOfDocuments' })
  @ApiQuery({ type: String, name: 'dateOfDocuments', example: '20/02/2022' })
  @ApiQuery({ type: Number, name: 'initialPeriod' })
  @ApiQuery({ type: Number, name: 'initialYear' })
  @ApiQuery({ type: Number, name: 'finalPeriod' })
  @ApiQuery({ type: Number, name: 'finalYear' })
  @ApiQuery({ type: String, name: 'hospital', required: false })
  @ApiQuery({ type: String, name: 'specialty', required: false })
  @ApiOkResponse({
    type: StreamableFile,
  })
  @ApiForbiddenResponse({
    description: '`not template found`',
  })
  @ApiUnauthorizedResponse({
    description: 'Not authorized to perform the query',
  })
  async generateDocuments(
    @Query('initialNumberOfDocuments', ValidateNumberPipe)
    initialNumberOfDocuments: number,
    @Query('dateOfDocuments', ValidateDatePipe) dateOfDocuments: Date,
    @Query('initialPeriod', ValidatePeriodPipe) initialPeriod: number,
    @Query('initialYear', ValidateYearPipe) initialYear: number,
    @Query('finalPeriod', ValidatePeriodPipe) finalPeriod: number,
    @Query('finalYear', ValidateYearPipe) finalYear: number,
    @Query('hospital', ValidateIdPipe) hospital: string,
    @Query('specialty', ValidateIdPipe) specialty: string,
  ): Promise<StreamableFile> {
    return await this.socialServicesService.generateDocuments(
      initialNumberOfDocuments,
      dateOfDocuments,
      initialPeriod,
      initialYear,
      finalPeriod,
      finalYear,
      hospital,
      specialty,
    );
  }

  @Get(`:${API_ENDPOINTS.SOCIAL_SERVICES.BY_ID}`)
  @ApiOperation({
    summary: '[Users] Find a Social Service in the database',
    description:
      'Finds in the database a `social service` based on the provided `_id` and returns the found `social service`',
  })
  @ApiBearerAuth()
  @ApiParam({
    name: API_ENDPOINTS.SOCIAL_SERVICES.BY_ID,
    description: '`social service` primary key',
  })
  @ApiOkResponse({
    type: SocialService,
    description: 'the found `social service`',
  })
  @ApiUnauthorizedResponse({
    description: 'Not authorized to perform the query',
  })
  @ApiForbiddenResponse({
    description: '`social service not found`',
  })
  async findOne(
    @Param(API_ENDPOINTS.SOCIAL_SERVICES.BY_ID, ValidateIdPipe) _id: string,
  ): Promise<HttpResponse<SocialService>> {
    return {
      data: await this.socialServicesService.findOne(_id),
    };
  }

  @Put(`:${API_ENDPOINTS.SOCIAL_SERVICES.BY_ID}`)
  @ApiOperation({
    summary: '[Users] Update a Social Service in the database',
    description:
      'Updates in the database a `social service` based on the provided `_id` and returns the modified `social service`',
  })
  @ApiBearerAuth()
  @ApiParam({
    name: API_ENDPOINTS.SOCIAL_SERVICES.BY_ID,
    description: '`social service` primary key',
  })
  @ApiOkResponse({
    type: SocialService,
    description: 'the modified `social service`',
  })
  @ApiForbiddenResponse({
    description: '`social service not found` `social service not modified`',
  })
  @ApiUnauthorizedResponse({
    description: 'Not authorized to perform the query',
  })
  async update(
    @Param(API_ENDPOINTS.SOCIAL_SERVICES.BY_ID, ValidateIdPipe) _id: string,
    @Body() updateSocialServiceDto: UpdateSocialServiceDto,
  ): Promise<HttpResponse<SocialService>> {
    return {
      data: await this.socialServicesService.update(
        _id,
        updateSocialServiceDto,
      ),
    };
  }

  @Delete(`:${API_ENDPOINTS.SOCIAL_SERVICES.BY_ID}`)
  @ApiOperation({
    summary: '[Users] Delete a Social Service in the database',
    description:
      'Deletes a `social service` in the database based on the provided `_id`',
  })
  @ApiParam({
    name: API_ENDPOINTS.SOCIAL_SERVICES.BY_ID,
    description: '`social service` primary key',
  })
  @ApiBearerAuth()
  @ApiOkResponse({})
  @ApiForbiddenResponse({
    description: '`social service not found` `social service not deleted`',
  })
  @ApiUnauthorizedResponse({
    description: 'Not authorized to perform the query',
  })
  async delete(
    @Param(API_ENDPOINTS.SOCIAL_SERVICES.BY_ID, ValidateIdPipe) _id: string,
  ): Promise<HttpResponse<undefined>> {
    await this.socialServicesService.delete(_id);
    return {};
  }

  @Get(API_ENDPOINTS.SOCIAL_SERVICES.DOCUMENT)
  @ApiOperation({
    summary: '[Users] Get a Social Service document',
    description: 'Finds in the database the document and returns it',
  })
  @ApiBearerAuth()
  @ApiParam({
    name: API_ENDPOINTS.SOCIAL_SERVICES.BY_ID,
    description: 'Social Service primary key',
  })
  @ApiQuery({
    name: 'type',
    description: 'Document type',
    type: String,
    enum: ['presentationOfficeDocument', 'reportDocument', 'constancyDocument'],
    required: true,
  })
  @ApiOkResponse({
    type: StreamableFile,
    description: 'the found document',
  })
  @ApiUnauthorizedResponse({
    description: 'Not authorized to perform the query',
  })
  @ApiForbiddenResponse({
    description: '`social service not found` `document not found`',
  })
  async getDocument(
    @Param(API_ENDPOINTS.SOCIAL_SERVICES.BY_ID, ValidateIdPipe) _id: string,
    @Query('type', ValidateSocialServiceDocumentTypePipe)
    type: SocialServiceDocumentTypes,
  ): Promise<StreamableFile> {
    return await this.socialServicesService.getDocument(
      _id,
      STORAGE_PATHS.SOCIAL_SERVICES,
      type,
    );
  }

  @Put(API_ENDPOINTS.SOCIAL_SERVICES.DOCUMENT)
  @ApiOperation({
    summary: '[Users] Update a Social service document',
    description:
      'Updates in the database the document and returns the `social service`',
  })
  @ApiBearerAuth()
  @ApiParam({
    name: API_ENDPOINTS.SOCIAL_SERVICES.BY_ID,
    type: String,
    description: 'Social Service primary key',
  })
  @ApiQuery({
    name: 'type',
    description: 'Document type',
    type: String,
    enum: ['presentationOfficeDocument', 'reportDocument', 'constancyDocument'],
    required: true,
  })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    description: 'Document',
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
        destination: STORAGE_PATHS.SOCIAL_SERVICES,
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
  @ApiOkResponse({
    type: SocialService,
    description: 'The updated `social service`',
  })
  @ApiForbiddenResponse({
    description:
      '`file must be a pdf` `social service not found` `social service not updated`',
  })
  @ApiUnauthorizedResponse({
    description: 'Not authorized to perform the query',
  })
  async updateDocument(
    @Param(API_ENDPOINTS.SOCIAL_SERVICES.BY_ID, ValidateIdPipe) _id: string,
    @UploadedFile() file: Express.Multer.File,
    @Query('type', ValidateSocialServiceDocumentTypePipe)
    type: 'presentationOfficeDocument' | 'reportDocument' | 'constancyDocument',
  ): Promise<HttpResponse<SocialService>> {
    return {
      data: await this.socialServicesService.updateDocument(
        _id,
        STORAGE_PATHS.SOCIAL_SERVICES,
        file,
        type,
      ),
    };
  }

  @Delete(API_ENDPOINTS.SOCIAL_SERVICES.DOCUMENT)
  @ApiOperation({
    summary: '[Users] Delete a Social Service document',
    description:
      'Deletes in the database the document and returns the `social service`',
  })
  @ApiBearerAuth()
  @ApiParam({
    name: API_ENDPOINTS.SOCIAL_SERVICES.BY_ID,
    type: String,
    description: 'Social Service primary key',
  })
  @ApiQuery({
    name: 'type',
    description: 'Document type',
    type: String,
    enum: ['presentationOfficeDocument', 'reportDocument', 'constancyDocument'],
    required: true,
  })
  @ApiOkResponse({
    type: SocialService,
    description: 'The modified `social service`',
  })
  @ApiForbiddenResponse({
    description: '`social service not found` `social service not updated`',
  })
  @ApiUnauthorizedResponse({
    description: 'Not authorized to perform the query',
  })
  async deleteDocument(
    @Param(API_ENDPOINTS.SOCIAL_SERVICES.BY_ID, ValidateIdPipe) _id: string,
    @Query('type')
    type: 'presentationOfficeDocument' | 'reportDocument' | 'constancyDocument',
  ): Promise<HttpResponse<SocialService>> {
    return {
      data: await this.socialServicesService.deleteDocument(
        _id,
        STORAGE_PATHS.SOCIAL_SERVICES,
        type,
      ),
    };
  }
}
