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
  ApiForbiddenResponse,
  ApiOkResponse,
  ApiParam,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';
import { API_ENDPOINTS, STORAGE_PATHS } from '@utils/constants';
import { HttpResponse } from '@utils/dtos';
import { ValidateIdPipe } from '@utils/pipes';
import { ValidateDatePipe } from '@utils/pipes/validate-date.pipe';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { CreateObligatoryMobilityDto } from '../dto/create-obligatory-mobility.dto';
import { ObligatoryMobilityByHospitalDto } from '../dto/obligatory-mobility-by-hospital.dto';
import { ObligatoryMobilityByStudentDto } from '../dto/obligatory-mobility-by-student.dto';
import { ObligatoryMobilityIntervalDto } from '../dto/obligatory-mobility-interval.dto';
import { UpdateObligatoryMobilityDto } from '../dto/update-obligatory-mobility.dto';
import { ObligatoryMobility } from '../schemas/obligatory-mobility.schema';
import { ValidateObligatoryMobilityDocumentTypePipe } from '../pipes/validate-obligatory-mobility-document.pipe';
import {
  ObligatoryMobilityDocumentTypes,
  ObligatoryMobilityDocumentTypesArray,
} from '../types/obligatory-mobility-document.type';
import { ObligatoryMobilitiesService } from '../services/obligatory-mobilities.service';

@ApiTags('Obligatory Mobilities')
@Controller(API_ENDPOINTS.OBLIGATORY_MOBILITIES.BASE_PATH)
export class ObligatoryMobilitiesController {
  constructor(
    private readonly obligatoryMobilitiesService: ObligatoryMobilitiesService,
  ) {}

  @Post()
  @ApiBearerAuth()
  @ApiBody({ type: CreateObligatoryMobilityDto })
  async create(
    @Body() createObligatoryMobilityDto: CreateObligatoryMobilityDto,
  ): Promise<HttpResponse<ObligatoryMobility>> {
    return {
      data: await this.obligatoryMobilitiesService.create(
        createObligatoryMobilityDto,
      ),
    };
  }

  @Get()
  @ApiBearerAuth()
  @ApiQuery({ name: 'specialty', type: String })
  @ApiQuery({ name: 'hospital', type: String })
  @ApiQuery({ name: 'initialDate', type: Date })
  @ApiQuery({ name: 'finalDate', type: Date })
  async findAll(
    @Query('specialty', ValidateIdPipe) specialty: string,
    @Query('hospital', ValidateIdPipe) hospital: string,
    @Query('initialDate', ValidateDatePipe) initialDate: Date,
    @Query('finalDate', ValidateDatePipe) finalDate: Date,
  ): Promise<HttpResponse<ObligatoryMobility[]>> {
    return {
      data: await this.obligatoryMobilitiesService.findAll(
        specialty,
        hospital,
        initialDate,
        finalDate,
      ),
    };
  }

  @Get(API_ENDPOINTS.OBLIGATORY_MOBILITIES.BY_HOSPITAL)
  @ApiBearerAuth()
  @ApiQuery({ name: 'specialty', type: String })
  @ApiQuery({ name: 'initialDate', type: Date })
  @ApiQuery({ name: 'finalDate', type: Date })
  async findAllByHospital(
    @Query('specialty', ValidateIdPipe) specialty: string,
    @Query('initialDate', ValidateDatePipe) initialDate: Date,
    @Query('finalDate', ValidateDatePipe) finalDate: Date,
  ): Promise<HttpResponse<ObligatoryMobilityByHospitalDto[]>> {
    return {
      data: await this.obligatoryMobilitiesService.findAllByHospital(
        specialty,
        initialDate,
        finalDate,
      ),
    };
  }

  @Get(API_ENDPOINTS.OBLIGATORY_MOBILITIES.BY_STUDENT)
  @ApiBearerAuth()
  @ApiQuery({ name: 'specialty', type: String })
  @ApiQuery({ name: 'initialDate', type: Date })
  @ApiQuery({ name: 'finalDate', type: Date })
  async findAllByStudent(
    @Query('specialty', ValidateIdPipe) specialty: string,
    @Query('initialDate', ValidateDatePipe) initialDate: Date,
    @Query('finalDate', ValidateDatePipe) finalDate: Date,
  ): Promise<HttpResponse<ObligatoryMobilityByStudentDto[]>> {
    return {
      data: await this.obligatoryMobilitiesService.findAllByStudent(
        specialty,
        initialDate,
        finalDate,
      ),
    };
  }

  @Get(API_ENDPOINTS.OBLIGATORY_MOBILITIES.INTERVAL)
  @ApiBearerAuth()
  @ApiOkResponse({ type: ObligatoryMobilityIntervalDto })
  @ApiForbiddenResponse({
    description: '`obligatory mobility interval not found`',
  })
  async interval(): Promise<HttpResponse<ObligatoryMobilityIntervalDto>> {
    return {
      data: await this.obligatoryMobilitiesService.interval(),
    };
  }

  @Get(`:${API_ENDPOINTS.OBLIGATORY_MOBILITIES.BY_ID}`)
  @ApiBearerAuth()
  async findOne(
    @Param(API_ENDPOINTS.OPTIONAL_MOBILITIES.BY_ID, ValidateIdPipe) _id: string,
  ): Promise<HttpResponse<ObligatoryMobility>> {
    return {
      data: await this.obligatoryMobilitiesService.findOne(_id),
    };
  }

  @Put(API_ENDPOINTS.OBLIGATORY_MOBILITIES.CANCEL)
  @ApiBearerAuth()
  async cancel(
    @Param(API_ENDPOINTS.OBLIGATORY_MOBILITIES.BY_ID, ValidateIdPipe)
    _id: string,
  ): Promise<HttpResponse<ObligatoryMobility>> {
    return {
      data: await this.obligatoryMobilitiesService.cancel(_id),
    };
  }

  @Put(API_ENDPOINTS.OBLIGATORY_MOBILITIES.UNCANCEL)
  @ApiBearerAuth()
  async uncancel(
    @Param(API_ENDPOINTS.OBLIGATORY_MOBILITIES.BY_ID, ValidateIdPipe)
    _id: string,
  ): Promise<HttpResponse<ObligatoryMobility>> {
    return {
      data: await this.obligatoryMobilitiesService.uncancel(_id),
    };
  }

  @Put(`:${API_ENDPOINTS.OBLIGATORY_MOBILITIES.BY_ID}`)
  @ApiBearerAuth()
  @ApiBody({ type: UpdateObligatoryMobilityDto })
  async update(
    @Param(API_ENDPOINTS.OBLIGATORY_MOBILITIES.BY_ID, ValidateIdPipe)
    _id: string,
    @Body() updateObligatoryMobility: UpdateObligatoryMobilityDto,
  ): Promise<HttpResponse<ObligatoryMobility>> {
    return {
      data: await this.obligatoryMobilitiesService.update(
        _id,
        updateObligatoryMobility,
      ),
    };
  }

  @Delete(`:${API_ENDPOINTS.OBLIGATORY_MOBILITIES.BY_ID}`)
  @ApiBearerAuth()
  async remove(
    @Param(API_ENDPOINTS.OBLIGATORY_MOBILITIES.BY_ID, ValidateIdPipe)
    _id: string,
  ): Promise<HttpResponse<undefined>> {
    await this.obligatoryMobilitiesService.remove(
      _id,
      STORAGE_PATHS.OBLIGATORY_MOBILITIES,
    );
    return {};
  }

  @Get(API_ENDPOINTS.OBLIGATORY_MOBILITIES.DOCUMENT)
  @ApiBearerAuth()
  @ApiParam({ name: API_ENDPOINTS.OBLIGATORY_MOBILITIES.BY_ID })
  @ApiQuery({ name: 'type', enum: ObligatoryMobilityDocumentTypesArray })
  async getDocument(
    @Param(API_ENDPOINTS.OBLIGATORY_MOBILITIES.BY_ID, ValidateIdPipe)
    _id: string,
    @Query('type', ValidateObligatoryMobilityDocumentTypePipe)
    type: ObligatoryMobilityDocumentTypes,
  ): Promise<StreamableFile> {
    return await this.obligatoryMobilitiesService.getDocument(
      _id,
      STORAGE_PATHS.OBLIGATORY_MOBILITIES,
      type,
    );
  }

  @Put(API_ENDPOINTS.OBLIGATORY_MOBILITIES.DOCUMENT)
  @ApiBearerAuth()
  @ApiParam({ name: API_ENDPOINTS.OBLIGATORY_MOBILITIES.BY_ID })
  @ApiQuery({ name: 'type', enum: ObligatoryMobilityDocumentTypesArray })
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
  async updateDocument(
    @Param(API_ENDPOINTS.OBLIGATORY_MOBILITIES.BY_ID, ValidateIdPipe)
    _id: string,
    @UploadedFile() file: Express.Multer.File,
    @Query('type', ValidateObligatoryMobilityDocumentTypePipe)
    type: ObligatoryMobilityDocumentTypes,
  ): Promise<HttpResponse<ObligatoryMobility>> {
    return {
      data: await this.obligatoryMobilitiesService.updateDocument(
        _id,
        STORAGE_PATHS.OBLIGATORY_MOBILITIES,
        file,
        type,
      ),
    };
  }

  @Delete(API_ENDPOINTS.OBLIGATORY_MOBILITIES.DOCUMENT)
  @ApiBearerAuth()
  @ApiParam({
    name: API_ENDPOINTS.OBLIGATORY_MOBILITIES.BY_ID,
  })
  @ApiQuery({ name: 'type', enum: ObligatoryMobilityDocumentTypesArray })
  async deleteDocument(
    @Param(API_ENDPOINTS.OBLIGATORY_MOBILITIES.BY_ID, ValidateIdPipe)
    _id: string,
    @Query('type', ValidateObligatoryMobilityDocumentTypePipe)
    type: ObligatoryMobilityDocumentTypes,
  ): Promise<HttpResponse<ObligatoryMobility>> {
    return {
      data: await this.obligatoryMobilitiesService.deleteDocument(
        _id,
        STORAGE_PATHS.OBLIGATORY_MOBILITIES,
        type,
      ),
    };
  }
}