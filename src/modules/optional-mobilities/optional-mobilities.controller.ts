import {
  Controller,
  Get,
  Post,
  Body,
  Put,
  Param,
  Delete,
  Query,
  UseInterceptors,
  UploadedFile,
  StreamableFile,
} from '@nestjs/common';
import { OptionalMobilitiesService } from './optional-mobilities.service';
import { CreateOptionalMobilityDto } from './dto/create-optional-mobility.dto';
import { UpdateOptionalMobilityDto } from './dto/update-optional-mobility.dto';
import {
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiParam,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';
import { API_ENDPOINTS, STORAGE_PATHS } from '@utils/constants';
import { HttpResponse } from '@utils/dtos';
import { OptionalMobility } from './optional-mobility.schema';
import { ValidateIdPipe } from '@utils/pipes';
import { OptionalMobilityIntervalInterface } from './interfaces/optional-mobility-interval.interface';
import { ValidateDatePipe } from '@utils/pipes/validate-date.pipe';
import { OptionalMobilityBySpecialtyDto } from '.';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { OptionalMobilityDocumentTypes } from './types/optional-mobility-document.type';
import { ValidateOptionalMobilityDocumentTypePipe } from './pipes/validate-optional-mobility-document.pipe';

@ApiTags('Optional Mobilities')
@Controller(API_ENDPOINTS.OPTIONAL_MOBILITIES.BASE_PATH)
export class OptionalMobilitiesController {
  constructor(
    private readonly optionalMobilitiesService: OptionalMobilitiesService,
  ) {}

  @Post()
  @ApiBearerAuth()
  @ApiCreatedResponse({ type: OptionalMobility })
  @ApiBody({ type: CreateOptionalMobilityDto })
  async create(
    @Body() createOptionalMobilityDto: CreateOptionalMobilityDto,
  ): Promise<HttpResponse<OptionalMobility>> {
    return {
      data: await this.optionalMobilitiesService.create(
        createOptionalMobilityDto,
      ),
    };
  }

  @Get(API_ENDPOINTS.OPTIONAL_MOBILITIES.INTERVAL)
  @ApiBearerAuth()
  @ApiOkResponse({
    type: OptionalMobilityIntervalInterface,
  })
  async interval(): Promise<HttpResponse<OptionalMobilityIntervalInterface>> {
    return {
      data: await this.optionalMobilitiesService.interval(),
    };
  }

  @Get()
  @ApiBearerAuth()
  @ApiQuery({ name: 'initialDate', type: Date })
  @ApiQuery({ name: 'finalDate', type: Date })
  @ApiOkResponse({ type: [OptionalMobility] })
  async findAll(
    @Query('initialDate', ValidateDatePipe) initialDate: Date,
    @Query('finalDate', ValidateDatePipe) finalDate: Date,
  ): Promise<HttpResponse<OptionalMobilityBySpecialtyDto[]>> {
    return {
      data: await this.optionalMobilitiesService.findAll(
        initialDate,
        finalDate,
      ),
    };
  }

  @Get(`:${API_ENDPOINTS.OPTIONAL_MOBILITIES.BY_ID}`)
  @ApiBearerAuth()
  @ApiOkResponse({ type: OptionalMobility })
  async findOne(
    @Param(API_ENDPOINTS.OPTIONAL_MOBILITIES.BY_ID, ValidateIdPipe) _id: string,
  ): Promise<HttpResponse<OptionalMobility>> {
    return {
      data: await this.optionalMobilitiesService.findOne(_id),
    };
  }

  @Put(`:${API_ENDPOINTS.OPTIONAL_MOBILITIES.BY_ID}`)
  @ApiBearerAuth()
  @ApiOkResponse({ type: OptionalMobility })
  @ApiBody({ type: UpdateOptionalMobilityDto })
  async update(
    @Param(API_ENDPOINTS.OPTIONAL_MOBILITIES.BY_ID, ValidateIdPipe) _id: string,
    @Body() updateOptionalMobilityDto: UpdateOptionalMobilityDto,
  ): Promise<HttpResponse<OptionalMobility>> {
    return {
      data: await this.optionalMobilitiesService.update(
        _id,
        updateOptionalMobilityDto,
      ),
    };
  }

  @Delete(`:${API_ENDPOINTS.OPTIONAL_MOBILITIES.BY_ID}`)
  @ApiBearerAuth()
  @ApiOkResponse()
  async remove(
    @Param(API_ENDPOINTS.OPTIONAL_MOBILITIES.BY_ID, ValidateIdPipe) _id: string,
  ): Promise<HttpResponse<undefined>> {
    await this.optionalMobilitiesService.remove(_id);
    return {};
  }

  @Get(API_ENDPOINTS.OPTIONAL_MOBILITIES.DOCUMENT)
  @ApiBearerAuth()
  async getDocument(
    @Param(API_ENDPOINTS.OPTIONAL_MOBILITIES.BY_ID, ValidateIdPipe) _id: string,
    @Query('type', ValidateOptionalMobilityDocumentTypePipe)
    type: OptionalMobilityDocumentTypes,
  ): Promise<StreamableFile> {
    return await this.optionalMobilitiesService.getDocument(
      _id,
      STORAGE_PATHS.OPTIONAL_MOBILITIES,
      type,
    );
  }

  @Put(API_ENDPOINTS.OPTIONAL_MOBILITIES.DOCUMENT)
  @ApiBearerAuth()
  @ApiParam({
    name: API_ENDPOINTS.OPTIONAL_MOBILITIES.BY_ID,
    type: String,
  })
  @ApiQuery({
    name: 'type',
    type: String,
    enum: [
      'solicitudeDocument',
      'presentationOfficeDocument',
      'acceptanceDocument',
      'evaluationDocument',
    ],
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
        destination: STORAGE_PATHS.OPTIONAL_MOBILITIES,
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
    @Param(API_ENDPOINTS.OPTIONAL_MOBILITIES.BY_ID, ValidateIdPipe) _id: string,
    @UploadedFile() file: Express.Multer.File,
    @Query('type', ValidateOptionalMobilityDocumentTypePipe)
    type: OptionalMobilityDocumentTypes,
  ): Promise<HttpResponse<OptionalMobility>> {
    return {
      data: await this.optionalMobilitiesService.updateDocument(
        _id,
        STORAGE_PATHS.OPTIONAL_MOBILITIES,
        file,
        type,
      ),
    };
  }

  @Delete(API_ENDPOINTS.OPTIONAL_MOBILITIES.DOCUMENT)
  @ApiBearerAuth()
  async deleteDocument(
    @Param(API_ENDPOINTS.OPTIONAL_MOBILITIES.BY_ID, ValidateIdPipe) _id: string,
    @Query('type') type: OptionalMobilityDocumentTypes,
  ): Promise<HttpResponse<OptionalMobility>> {
    return {
      data: await this.optionalMobilitiesService.deleteDocument(
        _id,
        STORAGE_PATHS.OPTIONAL_MOBILITIES,
        type,
      ),
    };
  }
}
