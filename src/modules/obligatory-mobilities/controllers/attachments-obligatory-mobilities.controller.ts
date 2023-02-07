import {
  Controller,
  Body,
  Query,
  Param,
  Post,
  Get,
  Put,
  Delete,
  StreamableFile,
  UploadedFile,
  UseInterceptors,
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
import { ValidateIdPipe } from '@utils/pipes';
import { ValidateDatePipe } from '@utils/pipes/validate-date.pipe';
import { ValidateNumberPipe } from '@utils/pipes/validate-number.pipe';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { AttachmentsObligatoryMobility } from '../schemas/attachments-obligatory-mobility.schema';
import { AttachmentsObligatoryMobilityByHospitalDto } from '../dto/attachments-obligatory-mobility-by-hospital.dto';
import { AttachmentsObligatoryMobilityResponseDto } from '../dto/attachments-obligatory-mobility-response.dto';
import { CreateAttachmentsObligatoryMobilityDto } from '../dto/create-attachments-obligatory-mobility.dto';
import { UpdateAttachmentsObligatoryMobilityDto } from '../dto/update-attachments-obligatory-mobility.dto';
import { ValidateAttachmentsObligatoryMobilityDocumentTypePipe } from '../pipes/validate-attachments-obligatory-mobility-document.pipe';
import {
  AttachmentsObligatoryMobilityDocumentTypes,
  AttachmentsObligatoryMobilityDocumentTypesArray,
} from '../types/attachments-obligatory-mobility-document.type';
import { AttachmentsObligatoryMobilitiesService } from '../services/attachments-obligatory-mobility.service';

@ApiTags('Attachments Obligatory Mobilities')
@Controller(
  API_ENDPOINTS.OBLIGATORY_MOBILITIES.BASE_PATH +
    API_ENDPOINTS.OBLIGATORY_MOBILITIES.ATTACHMENTS,
)
export class AttachmentsObligatoryMobilitiesController {
  constructor(
    private readonly attachmentsObligatoryMobilitiesService: AttachmentsObligatoryMobilitiesService,
  ) {}

  @Post()
  @ApiBearerAuth()
  @ApiOperation({
    summary: '[Users] Add an Attachments Obligatory Mobility in the database',
    description:
      'Creates a new `attachments obligatory mobility` in the database and returns the created `created obligatory mobility`',
  })
  @ApiBody({
    type: CreateAttachmentsObligatoryMobilityDto,
    description: '`attachments obligatory mobility` data',
  })
  @ApiCreatedResponse({
    type: AttachmentsObligatoryMobility,
    description: 'The created `attachments obligatory mobility`',
  })
  @ApiUnauthorizedResponse({
    description: 'Not authorized to perform the query',
  })
  async createAttachments(
    @Body()
    createAttachmentsObligatoryMobilityDto: CreateAttachmentsObligatoryMobilityDto,
  ): Promise<HttpResponse<AttachmentsObligatoryMobility>> {
    return {
      data: await this.attachmentsObligatoryMobilitiesService.create(
        createAttachmentsObligatoryMobilityDto,
      ),
    };
  }

  @Get()
  @ApiBearerAuth()
  @ApiOperation({
    summary:
      '[Users] Find all Attachments Obligatory Mobilities by Hospital in the database',
    description:
      'Finds in the database all `attachments obligatory mobilities`, groups them by `hospital` and returns an array of `attachments obligatory mobilities` by `hospital`',
  })
  @ApiQuery({ name: 'specialty', type: String })
  @ApiQuery({ name: 'initialDate', type: Date })
  @ApiQuery({ name: 'finalDate', type: Date })
  @ApiOkResponse({
    type: [AttachmentsObligatoryMobilityByHospitalDto],
    description: 'Array of `attachments obligatory mobilities` by `hospital`',
  })
  @ApiUnauthorizedResponse({
    description: 'Not authorized to perform the query',
  })
  async findAllAttachments(
    @Query('specialty', ValidateIdPipe) specialty: string,
    @Query('initialDate', ValidateDatePipe) initialDate: Date,
    @Query('finalDate', ValidateDatePipe) finalDate: Date,
  ): Promise<HttpResponse<AttachmentsObligatoryMobilityByHospitalDto[]>> {
    return {
      data: await this.attachmentsObligatoryMobilitiesService.findAll(
        initialDate,
        finalDate,
        specialty,
      ),
    };
  }

  @Get(`:${API_ENDPOINTS.OBLIGATORY_MOBILITIES.BY_ID}`)
  @ApiBearerAuth()
  @ApiOperation({
    summary: '[Users] Find an Attachments Obligatory Mobility in the database',
    description:
      'Finds in the database an `attachments obligatory mobility` based on the provided `_id` and returns the found `attachments obligatory mobility`',
  })
  @ApiParam({
    name: API_ENDPOINTS.OPTIONAL_MOBILITIES.BY_ID,
    description: '`attachments obligatory mobility` primary key',
  })
  @ApiOkResponse({
    type: AttachmentsObligatoryMobilityResponseDto,
    description: 'The found `attachments obligatory mobility`',
  })
  @ApiForbiddenResponse({
    description: '`attachments obligatory mobility not found`',
  })
  @ApiUnauthorizedResponse({
    description: 'Not authorized to perform the query',
  })
  async findAttachments(
    @Param(API_ENDPOINTS.OBLIGATORY_MOBILITIES.BY_ID, ValidateIdPipe)
    _id: string,
  ): Promise<HttpResponse<AttachmentsObligatoryMobilityResponseDto>> {
    return {
      data: await this.attachmentsObligatoryMobilitiesService.findOne(_id),
    };
  }

  @Put(`:${API_ENDPOINTS.OBLIGATORY_MOBILITIES.BY_ID}`)
  @ApiBearerAuth()
  @ApiOperation({
    summary:
      '[Users] Update an Attachments Obligatory Mobility in the database',
    description:
      'Updates in the database an `attachments obligatory mobility` based on the provided `_id` and returns the modified `attachments obligatory mobility`',
  })
  @ApiParam({
    name: API_ENDPOINTS.OBLIGATORY_MOBILITIES.BY_ID,
    description: '`attachments obligatory mobility` primary key',
  })
  @ApiBody({
    type: UpdateAttachmentsObligatoryMobilityDto,
    description: '`attachments obligatory mobility` data',
  })
  @ApiOkResponse({
    type: AttachmentsObligatoryMobility,
    description: 'The modified `attachments obligatory mobility`',
  })
  @ApiForbiddenResponse({
    description:
      '`attachments obligatory mobility not found` `attachments obligatory mobility not modified`',
  })
  @ApiUnauthorizedResponse({
    description: 'Not authorized to perform the query',
  })
  async updateAttachments(
    @Param(API_ENDPOINTS.OBLIGATORY_MOBILITIES.BY_ID, ValidateIdPipe)
    _id: string,
    @Body()
    updateAttachmentsObligatoryMobilityDto: UpdateAttachmentsObligatoryMobilityDto,
  ): Promise<HttpResponse<AttachmentsObligatoryMobility>> {
    return {
      data: await this.attachmentsObligatoryMobilitiesService.update(
        _id,
        updateAttachmentsObligatoryMobilityDto,
      ),
    };
  }

  @Delete(`:${API_ENDPOINTS.OBLIGATORY_MOBILITIES.BY_ID}`)
  @ApiBearerAuth()
  @ApiOperation({
    summary:
      '[Users] Delete an Attachments Obligatory Mobility in the database',
    description:
      'Deletes in the database an `attachments obligatory mobility` based on the provided `_id`',
  })
  @ApiParam({
    name: API_ENDPOINTS.OBLIGATORY_MOBILITIES.BY_ID,
    description: '`attachments obligatory mobility` primary key',
  })
  @ApiOkResponse({})
  @ApiForbiddenResponse({
    description:
      '`attachments obligatory mobility not found` `attachments obligatory mobility not deleted`',
  })
  @ApiUnauthorizedResponse({
    description: 'Not authorized to perform the query',
  })
  async deleteAttachments(
    @Param(API_ENDPOINTS.OBLIGATORY_MOBILITIES.BY_ID, ValidateIdPipe)
    _id: string,
  ): Promise<HttpResponse<undefined>> {
    await this.attachmentsObligatoryMobilitiesService.delete(
      _id,
      STORAGE_PATHS.OBLIGATORY_MOBILITIES,
    );
    return {};
  }

  @Get(`${API_ENDPOINTS.OBLIGATORY_MOBILITIES.DOCUMENT}`)
  @ApiBearerAuth()
  @ApiOperation({
    summary: '[Users] Get an Attachments Obligatory Mobility document',
    description: 'Finds in the database the document and returns it',
  })
  @ApiParam({
    name: API_ENDPOINTS.OBLIGATORY_MOBILITIES.BY_ID,
    description: '`attachments obligatory mobility` primary key',
  })
  @ApiQuery({
    name: 'type',
    enum: AttachmentsObligatoryMobilityDocumentTypesArray,
    description: 'Document type',
  })
  @ApiOkResponse({
    type: StreamableFile,
    description: 'The found document',
  })
  @ApiForbiddenResponse({
    description:
      '`attachments obligatory mobility not found` `document not found`',
  })
  @ApiUnauthorizedResponse({
    description: 'Not authorized to perform the query',
  })
  async getAttachmentsDocument(
    @Param(API_ENDPOINTS.OBLIGATORY_MOBILITIES.BY_ID, ValidateIdPipe)
    _id: string,
    @Query('type', ValidateAttachmentsObligatoryMobilityDocumentTypePipe)
    type: AttachmentsObligatoryMobilityDocumentTypes,
  ): Promise<StreamableFile> {
    return await this.attachmentsObligatoryMobilitiesService.getDocument(
      _id,
      STORAGE_PATHS.OBLIGATORY_MOBILITIES,
      type,
    );
  }

  @Put(`${API_ENDPOINTS.OBLIGATORY_MOBILITIES.DOCUMENT}`)
  @ApiBearerAuth()
  @ApiOperation({
    summary: '[Users] Update an Attachments Obligatory Mobility document',
    description:
      'Updates in the database the document and returns the `attachments obligatory mobility`',
  })
  @ApiParam({
    name: API_ENDPOINTS.OBLIGATORY_MOBILITIES.BY_ID,
    description: '`attachments obligatory mobility` primary key',
  })
  @ApiQuery({
    name: 'type',
    enum: AttachmentsObligatoryMobilityDocumentTypesArray,
    description: 'Document type',
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
        destination: STORAGE_PATHS.OBLIGATORY_MOBILITIES,
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
    type: AttachmentsObligatoryMobility,
    description: 'The modified `attachments obligatory mobility`',
  })
  @ApiForbiddenResponse({
    description:
      '`attachments obligatory mobility not found` `attachments obligatory mobility not updated` `file must be a pdf`',
  })
  @ApiUnauthorizedResponse({
    description: 'Not authorized to perform the query',
  })
  async updateAttachmentsDocument(
    @Param(API_ENDPOINTS.OBLIGATORY_MOBILITIES.BY_ID, ValidateIdPipe)
    _id: string,
    @UploadedFile() file: Express.Multer.File,
    @Query('type', ValidateAttachmentsObligatoryMobilityDocumentTypePipe)
    type: AttachmentsObligatoryMobilityDocumentTypes,
  ): Promise<HttpResponse<AttachmentsObligatoryMobility>> {
    return {
      data: await this.attachmentsObligatoryMobilitiesService.updateDocument(
        _id,
        STORAGE_PATHS.OBLIGATORY_MOBILITIES,
        file,
        type,
      ),
    };
  }

  @Delete(`${API_ENDPOINTS.OBLIGATORY_MOBILITIES.DOCUMENT}`)
  @ApiBearerAuth()
  @ApiOperation({
    summary: '[Users] Delete an Attachments Obligatory Mobility document',
    description:
      'Deletes in the database the document and returns the `attachments obligatory mobility`',
  })
  @ApiParam({
    name: API_ENDPOINTS.OBLIGATORY_MOBILITIES.BY_ID,
    description: '`attachments obligatory mobility` primary key',
  })
  @ApiQuery({
    name: 'type',
    enum: AttachmentsObligatoryMobilityDocumentTypesArray,
    description: 'Document type',
  })
  @ApiOkResponse({
    type: AttachmentsObligatoryMobility,
    description: 'The modified `attachments obligatory mobility`',
  })
  @ApiForbiddenResponse({
    description:
      '`attachments obligatory mobility not found` `attachments obligatory mobility not modified`',
  })
  @ApiUnauthorizedResponse({
    description: 'Not authorized to perform the query',
  })
  async deleteAttachmentsDocument(
    @Param(API_ENDPOINTS.OBLIGATORY_MOBILITIES.BY_ID, ValidateIdPipe)
    _id: string,
    @Query('type', ValidateAttachmentsObligatoryMobilityDocumentTypePipe)
    type: AttachmentsObligatoryMobilityDocumentTypes,
  ): Promise<HttpResponse<AttachmentsObligatoryMobility>> {
    return {
      data: await this.attachmentsObligatoryMobilitiesService.deleteDocument(
        _id,
        STORAGE_PATHS.OBLIGATORY_MOBILITIES,
        type,
      ),
    };
  }

  @Get(API_ENDPOINTS.OBLIGATORY_MOBILITIES.ATTACHMENTS_GENERATE)
  @ApiBearerAuth()
  @ApiOperation({
    summary:
      '[Users] Generate Attachments Obligatory Mobility solicitude document',
    description:
      'Generates `attachments obligatory mobility` solicitude document and returns it in a docx document',
  })
  @ApiQuery({ type: Number, name: 'numberOfDocument' })
  @ApiQuery({ type: Date, name: 'date' })
  @ApiParam({
    type: String,
    name: API_ENDPOINTS.OBLIGATORY_MOBILITIES.BY_ID,
    description: '`attachments obligatory mobility` primary key',
  })
  @ApiOkResponse({
    type: StreamableFile,
    description: 'The generated solicitude docx document',
  })
  @ApiForbiddenResponse({
    description: '`not template found`',
  })
  @ApiUnauthorizedResponse({
    description: 'Not authorized to perform the query',
  })
  async generateAttachmentsDocuments(
    @Param(API_ENDPOINTS.OBLIGATORY_MOBILITIES.BY_ID, ValidateIdPipe)
    _id: string,
    @Query('numberOfDocument', ValidateNumberPipe) numberOfDocuments: number,
    @Query('date', ValidateDatePipe) date: Date,
  ): Promise<StreamableFile> {
    return await this.attachmentsObligatoryMobilitiesService.generateDocument(
      _id,
      numberOfDocuments,
      date,
    );
  }
}
