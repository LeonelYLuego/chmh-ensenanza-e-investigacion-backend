import { Controller, Get, Post, Query, Param, Body } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiParam,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';
import { API_ENDPOINTS } from '@utils/constants';
import { HttpResponse } from '@utils/dtos';
import { ValidateIdPipe } from '@utils/pipes';
import { RotationServiceDto } from './dtos/rotation-service.dto';
import { RotationService } from './rotation-service.schema';
import { RotationServicesService } from './rotation-services.service';

@ApiTags('Rotation Services')
@Controller(API_ENDPOINTS.ROTATION_SERVICES.BASE_PATH)
export class RotationServicesController {
  constructor(private rotationServicesService: RotationServicesService) {}

  @Post()
  @ApiBearerAuth()
  @ApiBody({ type: RotationServiceDto })
  async create(
    @Body() rotationServiceDto: RotationServiceDto,
  ): Promise<HttpResponse<RotationService>> {
    return {
      data: await this.rotationServicesService.create(rotationServiceDto),
    };
  }

  @Get()
  @ApiBearerAuth()
  @ApiQuery({ name: 'specialty', description: 'Specialty primary key' })
  async findAll(
    @Query('specialty', ValidateIdPipe) specialty: string,
  ): Promise<HttpResponse<RotationService[]>> {
    return {
      data: await this.rotationServicesService.find(specialty),
    };
  }

  @Get(`:${API_ENDPOINTS.ROTATION_SERVICES.BY_ID}`)
  @ApiBearerAuth()
  @ApiParam({
    name: API_ENDPOINTS.ROTATION_SERVICES.BY_ID,
    description: 'Rotation Service primary key',
  })
  async find(
    @Param(API_ENDPOINTS.ROTATION_SERVICES.BY_ID, ValidateIdPipe) _id: string,
  ): Promise<HttpResponse<RotationService>> {
    return {
      data: await this.rotationServicesService.findOne(_id),
    };
  }
}
