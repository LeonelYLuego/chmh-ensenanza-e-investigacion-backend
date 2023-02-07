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
import { ObligatoryMobilityResponseDto } from '..';

@ApiTags('Obligatory Mobilities')
@Controller(API_ENDPOINTS.OBLIGATORY_MOBILITIES.BASE_PATH)
export class ObligatoryMobilitiesController {
  constructor(
    private readonly obligatoryMobilitiesService: ObligatoryMobilitiesService,
  ) {}

  @Post()
  @ApiBearerAuth()
  @ApiOperation({
    summary: '[Users] Add an Obligatory Mobility in the database',
    description:
      'Creates a new `obligatory mobility` in the database and returns the created `obligatory mobility`',
  })
  @ApiBody({
    type: CreateObligatoryMobilityDto,
    description: '`obligatory mobility` data',
  })
  @ApiCreatedResponse({
    type: ObligatoryMobility,
    description: 'The created `obligatory mobility`',
  })
  @ApiUnauthorizedResponse({
    description: 'Not authorized to perform the query',
  })
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
  @ApiOperation({
    summary: '[Users] Find all Obligatory Mobilities in the database',
    description:
      'Finds in the database all `obligatory mobilities` and returns an array of `obligatory mobilities`',
  })
  @ApiQuery({ name: 'specialty', type: String })
  @ApiQuery({ name: 'hospital', type: String })
  @ApiQuery({ name: 'initialDate', type: Date })
  @ApiQuery({ name: 'finalDate', type: Date })
  @ApiOkResponse({
    type: [ObligatoryMobility],
    description: 'Array of `obligatory mobilities`',
  })
  @ApiUnauthorizedResponse({
    description: 'Not authorized to perform the query',
  })
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
  @ApiOperation({
    summary:
      '[Users] Find all Obligatory Mobilities by Hospital in the database',
    description:
      'Finds in the database all `obligatory mobilities`, groups them by `hospital` and returns an array of `obligatory mobilities` by `hospital`',
  })
  @ApiQuery({ name: 'specialty', type: String })
  @ApiQuery({ name: 'initialDate', type: Date })
  @ApiQuery({ name: 'finalDate', type: Date })
  @ApiOkResponse({
    type: [ObligatoryMobilityByHospitalDto],
    description: 'Array of `obligatory mobilities` by `hospital`',
  })
  @ApiUnauthorizedResponse({
    description: 'Not authorized to perform the query',
  })
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
  @ApiOperation({
    summary:
      '[Users] Find all Obligatory Mobilities by Student in the database',
    description:
      'Finds in the database all `obligatory mobilities`, groups them by `student` and returns an array of `obligatory mobilities` by `hospital`',
  })
  @ApiQuery({ name: 'specialty', type: String })
  @ApiQuery({ name: 'initialDate', type: Date })
  @ApiQuery({ name: 'finalDate', type: Date })
  @ApiOkResponse({
    type: [ObligatoryMobilityByStudentDto],
    description: 'Array of `obligatory mobilities` by `student`',
  })
  @ApiUnauthorizedResponse({
    description: 'Not authorized to perform the query',
  })
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
  @ApiOperation({
    summary: '[Users] Get a Obligatory Mobilities interval',
    description:
      'Gets from `obligatory mobilities` the initial and final registered years',
  })
  @ApiOkResponse({
    type: ObligatoryMobilityIntervalDto,
    description: 'The first and last registered dates years',
  })
  @ApiForbiddenResponse({
    description: '`obligatory mobility interval not found`',
  })
  @ApiUnauthorizedResponse({
    description: 'Not authorized to perform the query',
  })
  async interval(): Promise<HttpResponse<ObligatoryMobilityIntervalDto>> {
    return {
      data: await this.obligatoryMobilitiesService.interval(),
    };
  }

  @Get(`:${API_ENDPOINTS.OBLIGATORY_MOBILITIES.BY_ID}`)
  @ApiBearerAuth()
  @ApiOperation({
    summary: '[Users] Find an Obligatory Mobility in the database',
    description:
      'Finds in the database an `obligatory mobility` based on the provided `_id` and returns the found `obligatory mobility`',
  })
  @ApiParam({
    name: API_ENDPOINTS.OPTIONAL_MOBILITIES.BY_ID,
    description: '`obligatory mobility` primary key',
  })
  @ApiOkResponse({
    type: ObligatoryMobilityResponseDto,
    description: 'The found `obligatory mobility`',
  })
  @ApiForbiddenResponse({
    description: '`obligatory mobility not found`',
  })
  @ApiUnauthorizedResponse({
    description: 'Not authorized to perform the query',
  })
  async findOne(
    @Param(API_ENDPOINTS.OPTIONAL_MOBILITIES.BY_ID, ValidateIdPipe) _id: string,
  ): Promise<HttpResponse<ObligatoryMobilityResponseDto>> {
    return {
      data: await this.obligatoryMobilitiesService.findOne(_id),
    };
  }

  @Put(API_ENDPOINTS.OBLIGATORY_MOBILITIES.CANCEL)
  @ApiBearerAuth()
  @ApiOperation({
    summary: '[Users] Cancel an Obligatory Mobility',
    description:
      'Cancels an `obligatory mobility` in the database bases on the provided `_id` and return the modified `obligatory mobility`',
  })
  @ApiOkResponse({
    type: ObligatoryMobility,
    description: 'The modified `obligatory mobility`',
  })
  @ApiForbiddenResponse({
    description:
      '`obligatory mobility not found` `obligatory mobility not modified`',
  })
  @ApiUnauthorizedResponse({
    description: 'Not authorized to perform the query',
  })
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
  @ApiOperation({
    summary: '[Users] Unancel an Obligatory Mobility',
    description:
      'Unancels an `obligatory mobility` in the database bases on the provided `_id` and return the modified `obligatory mobility`',
  })
  @ApiOkResponse({
    type: ObligatoryMobility,
    description: 'The modified `obligatory mobility`',
  })
  @ApiForbiddenResponse({
    description:
      '`obligatory mobility not found` `obligatory mobility not modified`',
  })
  @ApiUnauthorizedResponse({
    description: 'Not authorized to perform the query',
  })
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
  @ApiOperation({
    summary: '[Users] Update an Obligatory Mobility in the database',
    description:
      'Updates in the database an `obligatory mobility` based on the provided `_id` and returns the modified `obligatory mobility`',
  })
  @ApiParam({
    name: API_ENDPOINTS.OBLIGATORY_MOBILITIES.BY_ID,
    description: '`obligatory mobility` primary key',
  })
  @ApiBody({
    type: UpdateObligatoryMobilityDto,
    description: '`obligatory mobility` data',
  })
  @ApiOkResponse({
    type: ObligatoryMobility,
    description: 'The modified `obligatory mobility`',
  })
  @ApiForbiddenResponse({
    description:
      '`obligatory mobility not found` `obligatory mobility not modified`',
  })
  @ApiUnauthorizedResponse({
    description: 'Not authorized to perform the query',
  })
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
  @ApiOperation({
    summary: '[Users] Delete an Obligatory Mobility in the database',
    description:
      'Deletes in the database an `obligatory mobility` based on the provided `_id`',
  })
  @ApiParam({
    name: API_ENDPOINTS.OBLIGATORY_MOBILITIES.BY_ID,
    description: '`obligatory mobility` primary key',
  })
  @ApiOkResponse({})
  @ApiForbiddenResponse({
    description:
      '`obligatory mobility not found` `obligatory mobility not deleted`',
  })
  @ApiUnauthorizedResponse({
    description: 'Not authorized to perform the query',
  })
  async delete(
    @Param(API_ENDPOINTS.OBLIGATORY_MOBILITIES.BY_ID, ValidateIdPipe)
    _id: string,
  ): Promise<HttpResponse<undefined>> {
    await this.obligatoryMobilitiesService.delete(
      _id,
      STORAGE_PATHS.OBLIGATORY_MOBILITIES,
    );
    return {};
  }

  @Get(API_ENDPOINTS.OBLIGATORY_MOBILITIES.DOCUMENT)
  @ApiBearerAuth()
  @ApiOperation({
    summary: '[Users] Get an Obligatory Mobility document',
    description: 'Finds in the database the document and returns it',
  })
  @ApiParam({
    name: API_ENDPOINTS.OBLIGATORY_MOBILITIES.BY_ID,
    description: '`obligatory mobility` primary key',
  })
  @ApiQuery({
    name: 'type',
    enum: ObligatoryMobilityDocumentTypesArray,
    description: 'Document type',
  })
  @ApiOkResponse({
    type: StreamableFile,
    description: 'The found document',
  })
  @ApiForbiddenResponse({
    description: '`obligatory mobility not found` `document not found`',
  })
  @ApiUnauthorizedResponse({
    description: 'Not authorized to perform the query',
  })
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
  @ApiOperation({
    summary: '[Users] Update an Obligatory Mobility document',
    description:
      'Updates in the database the document and returns the `obligatory mobility`',
  })
  @ApiParam({
    name: API_ENDPOINTS.OBLIGATORY_MOBILITIES.BY_ID,
    description: '`obligatory mobility` primary key',
  })
  @ApiQuery({
    name: 'type',
    enum: ObligatoryMobilityDocumentTypesArray,
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
    type: ObligatoryMobility,
    description: 'The modified `obligatory mobility`',
  })
  @ApiForbiddenResponse({
    description:
      '`obligatory mobility not found` `obligatory mobility not updated` `file must be a pdf`',
  })
  @ApiUnauthorizedResponse({
    description: 'Not authorized to perform the query',
  })
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
  @ApiOperation({
    summary: '[Users] Delete an Obligatory Mobility document',
    description:
      'Deletes in the database the document and returns the `obligatory mobility`',
  })
  @ApiParam({
    name: API_ENDPOINTS.OBLIGATORY_MOBILITIES.BY_ID,
    description: '`obligatory mobility` primary key',
  })
  @ApiQuery({
    name: 'type',
    enum: ObligatoryMobilityDocumentTypesArray,
    description: 'Document type',
  })
  @ApiOkResponse({
    type: ObligatoryMobility,
    description: 'The modified `obligatory mobility`',
  })
  @ApiForbiddenResponse({
    description:
      '`obligatory mobility not found` `obligatory mobility not modified`',
  })
  @ApiUnauthorizedResponse({
    description: 'Not authorized to perform the query',
  })
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
