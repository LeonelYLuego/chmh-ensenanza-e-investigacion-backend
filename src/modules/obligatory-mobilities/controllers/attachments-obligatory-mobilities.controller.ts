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
  ApiParam,
  ApiQuery,
  ApiTags,
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
import { AttachmentsObligatoryMobilitiesService } from '../services/attachments-obligatory-movility.service';

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
  @ApiBody({ type: CreateAttachmentsObligatoryMobilityDto })
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
  @ApiQuery({ name: 'specialty', type: String })
  @ApiQuery({ name: 'initialDate', type: Date })
  @ApiQuery({ name: 'finalDate', type: Date })
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
  @ApiBody({ type: UpdateAttachmentsObligatoryMobilityDto })
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
  async deleteAttachments(
    @Param(API_ENDPOINTS.OBLIGATORY_MOBILITIES.BY_ID, ValidateIdPipe)
    _id: string,
  ): Promise<HttpResponse<undefined>> {
    await this.attachmentsObligatoryMobilitiesService.delete(_id);
    return {};
  }

  @Get(`${API_ENDPOINTS.OBLIGATORY_MOBILITIES.DOCUMENT}`)
  @ApiBearerAuth()
  @ApiParam({ name: API_ENDPOINTS.OBLIGATORY_MOBILITIES.BY_ID })
  @ApiQuery({
    name: 'type',
    enum: AttachmentsObligatoryMobilityDocumentTypesArray,
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
  @ApiParam({ name: API_ENDPOINTS.OBLIGATORY_MOBILITIES.BY_ID })
  @ApiQuery({
    name: 'type',
    enum: AttachmentsObligatoryMobilityDocumentTypesArray,
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
  @ApiParam({
    name: API_ENDPOINTS.OBLIGATORY_MOBILITIES.BY_ID,
  })
  @ApiQuery({
    name: 'type',
    enum: AttachmentsObligatoryMobilityDocumentTypesArray,
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
  @ApiQuery({ type: Number, name: 'numberOfDocument' })
  @ApiQuery({ type: Date, name: 'date' })
  @ApiParam({ type: String, name: API_ENDPOINTS.OBLIGATORY_MOBILITIES.BY_ID })
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
