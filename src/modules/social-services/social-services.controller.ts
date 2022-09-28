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
import { SocialServicesService } from './social-services.service';
import { CreateSocialServiceDto } from './dto/create-social-service.dto';
import {
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiOkResponse,
  ApiParam,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';
import { SocialService } from './social-service.schema';
import {
  API_ENDPOINTS,
  API_RESOURCES,
  DEFAULT_API_PATHS,
} from '@utils/constants/api-routes.constant';
import { ValidateYearPipe } from '@utils/pipes/validate-year.pipe';
import { ValidatePeriodPipe } from '@utils/pipes/validate-period.pipe';
import { ValidateIdPipe } from '@utils/pipes/validate-id.pipe';
import { UpdateSocialServiceDto } from './dto/update-social-service.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { STORAGE_PATHS } from '@utils/constants/storage.constant';
import { SocialServiceBySpecialtyDto } from './dto/social-service-by-specialty.dto';
import { extname } from 'path';
import { ValidateTypeSocialServicePipe } from './pipes/validate-type-social-service.pipe';

@ApiTags('Social Services')
@Controller(API_RESOURCES.SOCIAL_SERVICES)
export class SocialServicesController {
  constructor(private readonly socialServicesService: SocialServicesService) {}

  //CRUD
  @Post()
  @ApiBearerAuth()
  async create(
    @Body() createSocialServiceDto: CreateSocialServiceDto,
  ): Promise<SocialService> {
    return await this.socialServicesService.create(createSocialServiceDto);
  }

  @Get(API_ENDPOINTS.SOCIAL_SERVICES.PERIODS)
  @ApiBearerAuth()
  async getPeriods(): Promise<{
    initialYear: number;
    finalYear: number;
  } | null> {
    return await this.socialServicesService.getPeriods();
  }

  @Get()
  @ApiBearerAuth()
  @ApiQuery({ type: Number, name: 'initialPeriod' })
  @ApiQuery({ type: Number, name: 'initialYear' })
  @ApiQuery({ type: Number, name: 'finalPeriod' })
  @ApiQuery({ type: Number, name: 'finalYear' })
  @ApiOkResponse({ type: [SocialServiceBySpecialtyDto] })
  async findAll(
    @Query('initialPeriod', ValidatePeriodPipe) initialPeriod: number,
    @Query('initialYear', ValidateYearPipe) initialYear: number,
    @Query('finalPeriod', ValidatePeriodPipe) finalPeriod: number,
    @Query('finalYear', ValidateYearPipe) finalYear: number,
  ): Promise<SocialServiceBySpecialtyDto[]> {
    return await this.socialServicesService.findAll(
      initialPeriod,
      initialYear,
      finalPeriod,
      finalYear,
    );
  }

  @Get(DEFAULT_API_PATHS.BY_ID)
  @ApiBearerAuth()
  async findOne(
    @Param('_id', ValidateIdPipe) _id: string,
  ): Promise<SocialService> {
    return await this.socialServicesService.findOne(_id);
  }

  @Put(DEFAULT_API_PATHS.BY_ID)
  @ApiBearerAuth()
  async update(
    @Param('_id', ValidateIdPipe) _id: string,
    @Body() updateSocialServiceDto: UpdateSocialServiceDto,
  ): Promise<SocialService> {
    return await this.socialServicesService.update(_id, updateSocialServiceDto);
  }

  @Delete(DEFAULT_API_PATHS.BY_ID)
  @ApiBearerAuth()
  async remove(@Param('_id', ValidateIdPipe) _id: string): Promise<void> {
    return await this.socialServicesService.remove(_id);
  }

  //Validar type
  @Get(API_ENDPOINTS.SOCIAL_SERVICES.DOCUMENT)
  @ApiBearerAuth()
  @ApiParam({ name: '_id', description: 'Social Service primary key' })
  @ApiQuery({
    name: 'type',
    type: String,
    enum: ['presentationOfficeDocument', 'reportDocument', 'constancyDocument'],
    required: true,
  })
  async getDocument(
    @Param('_id', ValidateIdPipe) _id: string,
    @Query('type', ValidateTypeSocialServicePipe)
    type: 'presentationOfficeDocument' | 'reportDocument' | 'constancyDocument',
  ): Promise<StreamableFile> {
    return await this.socialServicesService.getDocument(
      _id,
      STORAGE_PATHS.SOCIAL_SERVICES.BASE,
      type,
    );
  }

  @Put(API_ENDPOINTS.SOCIAL_SERVICES.DOCUMENT)
  @ApiBearerAuth()
  @ApiParam({
    name: '_id',
    type: String,
    description: 'Social Service primary key',
  })
  @ApiQuery({
    name: 'type',
    type: String,
    enum: ['presentationOfficeDocument', 'reportDocument', 'constancyDocument'],
    required: true,
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
        destination: STORAGE_PATHS.SOCIAL_SERVICES.BASE,
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
    @Param('_id', ValidateIdPipe) _id: string,
    @UploadedFile() file: Express.Multer.File,
    @Query('type', ValidateTypeSocialServicePipe)
    type: 'presentationOfficeDocument' | 'reportDocument' | 'constancyDocument',
  ): Promise<SocialService> {
    return this.socialServicesService.updateDocument(
      _id,
      STORAGE_PATHS.SOCIAL_SERVICES.BASE,
      file,
      type,
    );
  }

  @Delete(API_ENDPOINTS.SOCIAL_SERVICES.DOCUMENT)
  @ApiBearerAuth()
  @ApiParam({
    name: '_id',
    type: String,
    description: 'Social Service primary key',
  })
  @ApiQuery({
    name: 'type',
    type: String,
    enum: ['presentationOfficeDocument', 'reportDocument', 'constancyDocument'],
    required: true,
  })
  async deleteDocument(
    @Param('_id', ValidateIdPipe) _id: string,
    @Query('type')
    type: 'presentationOfficeDocument' | 'reportDocument' | 'constancyDocument',
  ): Promise<void> {
    await this.socialServicesService.deleteDocument(
      _id,
      STORAGE_PATHS.SOCIAL_SERVICES.BASE,
      type,
    );
  }
}
