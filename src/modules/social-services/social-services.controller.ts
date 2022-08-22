import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Query,
  Put,
} from '@nestjs/common';
import { SocialServicesService } from './social-services.service';
import { CreateSocialServiceDto } from './dto/create-social-service.dto';
import { ApiBearerAuth, ApiParam, ApiQuery, ApiTags } from '@nestjs/swagger';
import { SocialService } from './social-service.schema';
import {
  API_RESOURCES,
  DEFAULT_API_PATHS,
} from '@utils/constants/api-routes.constant';
import { ValidateYearPipe } from '@utils/pipes/validate-year.pipe';
import { ValidatePeriodPipe } from '@utils/pipes/validate-period.pipe';
import { ValidateIdPipe } from '@utils/pipes/validate-id.pipe';
import { UpdateSocialServiceDto } from './dto/update-social-service.dto';

@ApiTags('Social Services')
@Controller(API_RESOURCES.SOCIAL_SERVICES)
export class SocialServicesController {
  constructor(private readonly socialServicesService: SocialServicesService) {}

  @Post()
  @ApiBearerAuth()
  async create(
    @Body() createSocialServiceDto: CreateSocialServiceDto,
  ): Promise<SocialService> {
    return await this.socialServicesService.create(createSocialServiceDto);
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
}
