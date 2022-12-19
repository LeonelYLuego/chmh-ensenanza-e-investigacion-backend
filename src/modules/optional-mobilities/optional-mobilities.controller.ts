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
  UnauthorizedException,
} from '@nestjs/common';
import { OptionalMobilitiesService } from './optional-mobilities.service';
import { CreateOptionalMobilityDto } from './dto/create-optional-mobility.dto';
import { UpdateOptionalMobilityDto } from './dto/update-optional-mobility.dto';
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
import { OptionalMobility } from './optional-mobility.schema';
import { ValidateIdPipe } from '@utils/pipes';
import { OptionalMobilityIntervalInterface } from './interfaces/optional-mobility-interval.interface';
import { ValidateDatePipe } from '@utils/pipes/validate-date.pipe';
import { OptionalMobilityBySpecialtyDto } from '.';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import {
  OptionalMobilityDocumentTypes,
  OptionalMobilityDocumentTypesArray,
} from './types/optional-mobility-document.type';
import { ValidateOptionalMobilityDocumentTypePipe } from './pipes/validate-optional-mobility-document.pipe';

@ApiTags('Optional Mobilities')
@Controller(API_ENDPOINTS.OPTIONAL_MOBILITIES.BASE_PATH)
export class OptionalMobilitiesController {
  constructor(
    private readonly optionalMobilitiesService: OptionalMobilitiesService,
  ) {}

  @Post()
  @ApiBearerAuth()
  @ApiOperation({
    summary: '[User] Add an Optional Mobility in the database',
    description:
      'Creates a new `Optional Mobility` in the database and returns the created `Optional Mobility`',
  })
  @ApiBody({ type: CreateOptionalMobilityDto })
  @ApiCreatedResponse({
    type: OptionalMobility,
    description: 'The created `optional mobility`',
  })
  @ApiUnauthorizedResponse({
    description: 'Not authorized to perform the query',
  })
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
  @ApiOperation({
    summary: '[Users] Get Optional Mobility interval',
    description:
      'Gets from Optional Mobilities the initial and final registered date years',
  })
  @ApiOkResponse({
    type: OptionalMobilityIntervalInterface,
    description: 'The first and last registered dates years',
  })
  @ApiUnauthorizedResponse({
    description: 'Not authorized to perform the query',
  })
  @ApiForbiddenResponse({
    description: '`optional mobility interval not found`',
  })
  async interval(): Promise<HttpResponse<OptionalMobilityIntervalInterface>> {
    return {
      data: await this.optionalMobilitiesService.interval(),
    };
  }

  @Get()
  @ApiBearerAuth()
  @ApiOperation({
    summary: '[Users] Find all Optional Mobilities in the database',
    description:
      'Finds in the database all `optional mobilities` and returns an array of `optional mobilities`',
  })
  @ApiQuery({ name: 'initialDate', type: Date })
  @ApiQuery({ name: 'finalDate', type: Date })
  @ApiOkResponse({
    type: [OptionalMobility],
    description: 'Array of `optional mobilities`',
  })
  @ApiUnauthorizedResponse({
    description: 'Not authorized to perform the query',
  })
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
  @ApiOperation({
    summary: '[Users] Find an Optional Mobility in the database',
    description:
      'Finds in the database an `optional mobility` based on the provided `_id` and returns the found `optional mobility`',
  })
  @ApiOkResponse({
    type: OptionalMobility,
    description: 'The found `optional mobility`',
  })
  @ApiUnauthorizedResponse({
    description: 'Not authorized to perform the query',
  })
  @ApiForbiddenResponse({ description: '`optional mobility not found`' })
  async findOne(
    @Param(API_ENDPOINTS.OPTIONAL_MOBILITIES.BY_ID, ValidateIdPipe) _id: string,
  ): Promise<HttpResponse<OptionalMobility>> {
    return {
      data: await this.optionalMobilitiesService.findOne(_id),
    };
  }

  @Put(`:${API_ENDPOINTS.OPTIONAL_MOBILITIES.BY_ID}`)
  @ApiBearerAuth()
  @ApiOperation({
    summary: '[Users] Update an Optional Mobility in the database',
    description:
      'Updates in the database an `optional mobility` based on the provided `_id` and returns the modified `optional mobility`',
  })
  @ApiBody({ type: UpdateOptionalMobilityDto })
  @ApiOkResponse({
    type: OptionalMobility,
    description: 'The modified `optional mobility`',
  })
  @ApiUnauthorizedResponse({ description: '`optional mobility not found`' })
  @ApiForbiddenResponse({
    description:
      '`optional mobility not found` `optional mobility not modified`',
  })
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
  @ApiOperation({
    summary: '[Users] Delete an Optional Mobility in the database',
    description:
      'Deletes an `optional mobility` in the database on the provided _id',
  })
  @ApiOkResponse()
  @ApiUnauthorizedResponse({
    description: 'Not authorized to perform the query',
  })
  @ApiForbiddenResponse({
    description:
      '`optional mobility not found` `optional mobility not deleted`',
  })
  async remove(
    @Param(API_ENDPOINTS.OPTIONAL_MOBILITIES.BY_ID, ValidateIdPipe) _id: string,
  ): Promise<HttpResponse<undefined>> {
    await this.optionalMobilitiesService.remove(
      _id,
      STORAGE_PATHS.OPTIONAL_MOBILITIES,
    );
    return {};
  }

  @Get(API_ENDPOINTS.OPTIONAL_MOBILITIES.DOCUMENT)
  @ApiBearerAuth()
  @ApiOperation({
    summary: '[Users] Get an Optional Mobility document',
    description: 'Finds in the database the document and returns it',
  })
  @ApiParam({
    name: API_ENDPOINTS.OPTIONAL_MOBILITIES.BY_ID,
    description: '`optional mobility` primary key',
  })
  @ApiParam({
    name: 'type',
    description: 'Document type',
    enum: OptionalMobilityDocumentTypesArray,
  })
  @ApiOkResponse({ type: StreamableFile, description: 'The found document' })
  @ApiUnauthorizedResponse({
    description: 'Not authorized to perform the query',
  })
  @ApiForbiddenResponse({
    description: '`optional mobility not found` `document not found`',
  })
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
  @ApiOperation({
    summary: '[Users] Update an Optional Mobility document',
    description:
      'Updates in the database the document and returns the `optional mobility`',
  })
  @ApiParam({
    name: API_ENDPOINTS.OPTIONAL_MOBILITIES.BY_ID,
    description: '`optional mobility` primary key',
  })
  @ApiParam({
    name: 'type',
    description: 'Document type',
    enum: OptionalMobilityDocumentTypesArray,
  })
  @ApiOkResponse({
    type: OptionalMobility,
    description: 'The updated `optional mobility`',
  })
  @ApiUnauthorizedResponse({
    description: 'Not authorized to perform the query',
  })
  @ApiForbiddenResponse({
    description:
      '`optional mobility not found` `optional mobility not updated` `file must be a pdf`',
  })
  @ApiParam({
    name: API_ENDPOINTS.OPTIONAL_MOBILITIES.BY_ID,
    type: String,
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
  @ApiOperation({
    summary: '[Users] Delete an Optional Mobility document',
    description:
      'Deletes in the database the document and returns the `optional mobility`',
  })
  @ApiParam({
    name: API_ENDPOINTS.OPTIONAL_MOBILITIES.BY_ID,
    description: '`optional mobility` primary key',
  })
  @ApiParam({
    name: 'type',
    description: 'Document type',
    enum: OptionalMobilityDocumentTypesArray,
  })
  @ApiOkResponse({
    type: OptionalMobility,
    description: 'The updated `optional mobility`',
  })
  @ApiUnauthorizedResponse({
    description: 'Not authorized to perform the query',
  })
  @ApiForbiddenResponse({
    description:
      '`optional mobility not found` `optional mobility not updated`',
  })
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
