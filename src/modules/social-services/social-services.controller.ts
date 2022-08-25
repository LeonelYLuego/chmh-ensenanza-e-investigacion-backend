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
  async findAll(
    @Query('initialPeriod', ValidatePeriodPipe) initialPeriod: number,
    @Query('initialYear', ValidateYearPipe) initialYear: number,
    @Query('finalPeriod', ValidatePeriodPipe) finalPeriod: number,
    @Query('finalYear', ValidateYearPipe) finalYear: number,
  ): Promise<SocialService[]> {
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

  /*
  //Presentation Office Document
  @Get(API_ENDPOINTS.SOCIAL_SERVICES.PRESENTATION_OFFICE)
  @ApiBearerAuth()
  async getPresentationOffice(
    @Param('_id', ValidateIdPipe) _id: string,
  ): Promise<StreamableFile | null> {
    return await this.socialServicesService.getPresentationOffice(_id);
  }

  @Put(API_ENDPOINTS.SOCIAL_SERVICES.PRESENTATION_OFFICE)
  @ApiBearerAuth()
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: STORAGE_PATHS.SOCIAL_SERVICES.PRESENTATION_OFFICES,
      }),
    }),
  )
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
  async updatePresentationOffice(
    @Param('_id', ValidateIdPipe) _id: string,
    @UploadedFile() file: Express.Multer.File,
  ): Promise<SocialService> {
    return await this.socialServicesService.updatePresentationOffice(_id, file);
  }

  @Delete(API_ENDPOINTS.SOCIAL_SERVICES.PRESENTATION_OFFICE)
  @ApiBearerAuth()
  async deletePresentationOffice(
    @Param('_id', ValidateIdPipe) _id: string,
  ): Promise<void> {
    return await this.socialServicesService.deletePresentationOffice(_id);
  }

  //Report document
  @Get(API_ENDPOINTS.SOCIAL_SERVICES.REPORT)
  @ApiBearerAuth()
  async getReport(
    @Param('_id', ValidateIdPipe) _id: string,
  ): Promise<StreamableFile | null> {
    return await this.socialServicesService.getReport(_id);
  }

  @Put(API_ENDPOINTS.SOCIAL_SERVICES.REPORT)
  @ApiBearerAuth()
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: STORAGE_PATHS.SOCIAL_SERVICES.REPORTS,
      }),
    }),
  )
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
  async updateReport(
    @Param('_id', ValidateIdPipe) _id: string,
    @UploadedFile() file: Express.Multer.File,
  ): Promise<SocialService> {
    return await this.socialServicesService.updateReport(_id, file);
  }

  @Delete(API_ENDPOINTS.SOCIAL_SERVICES.REPORT)
  @ApiBearerAuth()
  async deleteReport(@Param('_id', ValidateIdPipe) _id: string): Promise<void> {
    return await this.socialServicesService.deleteReport(_id);
  }

  //Constancy document
  @Get(API_ENDPOINTS.SOCIAL_SERVICES.COSTANCY)
  @ApiBearerAuth()
  async getConstancy(
    @Param('_id', ValidateIdPipe) _id: string,
  ): Promise<StreamableFile | null> {
    return await this.socialServicesService.getConstancy(_id);
  }

  @Put(API_ENDPOINTS.SOCIAL_SERVICES.COSTANCY)
  @ApiBearerAuth()
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: STORAGE_PATHS.SOCIAL_SERVICES.CONSTANCIES,
      }),
    }),
  )
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
  async updateConstancy(
    @Param('_id', ValidateIdPipe) _id: string,
    @UploadedFile() file: Express.Multer.File,
  ): Promise<SocialService> {
    return await this.socialServicesService.updateConstancy(_id, file);
  }

  @Delete(API_ENDPOINTS.SOCIAL_SERVICES.COSTANCY)
  @ApiBearerAuth()
  async deleteConstancy(
    @Param('_id', ValidateIdPipe) _id: string,
  ): Promise<void> {
    return await this.socialServicesService.deleteConstancy(_id);
  }
  */
}
