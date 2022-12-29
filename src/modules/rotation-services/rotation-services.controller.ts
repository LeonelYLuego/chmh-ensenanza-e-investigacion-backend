import {
  Controller,
  Get,
  Post,
  Put,
  Query,
  Param,
  Body,
  Delete,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiCreatedResponse,
  ApiForbiddenResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiTags,
  ApiUnauthorizedResponse,
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

  @Post(API_ENDPOINTS.ROTATION_SERVICES.INCOMING)
  @ApiBearerAuth()
  @ApiOperation({ summary: '[Users] Add a Rotation Service in the database' })
  @ApiBody({ type: RotationServiceDto, description: '`rotation service` data' })
  @ApiCreatedResponse({ description: 'The created `rotation service`' })
  @ApiUnauthorizedResponse({
    description: 'Not authorized to perform the query',
  })
  @ApiForbiddenResponse({ description: `specialty must exist` })
  async createIncoming(
    @Body() rotationServiceDto: RotationServiceDto,
  ): Promise<HttpResponse<RotationService>> {
    return {
      data: await this.rotationServicesService.createIncoming(
        rotationServiceDto,
      ),
    };
  }

  @Get(API_ENDPOINTS.ROTATION_SERVICES.INCOMING)
  @ApiBearerAuth()
  @ApiOperation({
    summary: '[Users] Find all Rotation Services in the database',
    description:
      'Finds in the database all `rotation services` and returns an array of `rotation services`',
  })
  @ApiQuery({ name: 'specialty', description: 'Specialty primary key' })
  @ApiOkResponse({
    type: [RotationService],
    description: 'Array of found `rotation services`',
  })
  @ApiUnauthorizedResponse({
    description: 'Not authorized to perform the query',
  })
  async findAllIncoming(
    @Query('specialty', ValidateIdPipe) specialty: string,
  ): Promise<HttpResponse<RotationService[]>> {
    return {
      data: await this.rotationServicesService.findIncoming(specialty),
    };
  }

  @Get(
    `${API_ENDPOINTS.ROTATION_SERVICES.INCOMING}/:${API_ENDPOINTS.ROTATION_SERVICES.BY_ID}`,
  )
  @ApiBearerAuth()
  @ApiOperation({ summary: '[Users] Find a Rotation Service in the database' })
  @ApiParam({
    name: API_ENDPOINTS.ROTATION_SERVICES.BY_ID,
    description: '`rotation service` primary key',
  })
  @ApiOkResponse({
    type: RotationService,
    description: 'The found `rotation service`',
  })
  @ApiUnauthorizedResponse({
    description: 'Not authorized to perform the query',
  })
  @ApiForbiddenResponse({ description: '`rotation service not found`' })
  async findIncoming(
    @Param(API_ENDPOINTS.ROTATION_SERVICES.BY_ID, ValidateIdPipe) _id: string,
  ): Promise<HttpResponse<RotationService>> {
    return {
      data: await this.rotationServicesService.findOneIncoming(_id),
    };
  }

  @Put(
    `${API_ENDPOINTS.ROTATION_SERVICES.INCOMING}/:${API_ENDPOINTS.ROTATION_SERVICES.BY_ID}`,
  )
  @ApiBearerAuth()
  @ApiOperation({
    summary: '[Users] Update a Rotation Service in the database',
    description:
      'Updates in the database a `rotation service` based on the provided `_id` and return the modified `rotation service`',
  })
  @ApiParam({
    name: API_ENDPOINTS.ROTATION_SERVICES.BY_ID,
    description: '`rotation service` primary key',
  })
  @ApiBody({
    type: RotationServiceDto,
    description: '`rotation service` data',
  })
  @ApiOkResponse({
    type: RotationService,
    description: 'The modified `rotation service`',
  })
  @ApiUnauthorizedResponse({
    description: 'Not authorized to perform the query',
  })
  @ApiForbiddenResponse({
    description:
      '`specialty not found` `rotation service not found` `rotation service not modified`',
  })
  async updateIncoming(
    @Param(API_ENDPOINTS.ROTATION_SERVICES.BY_ID, ValidateIdPipe) _id: string,
    @Body() rotationServiceDto: RotationServiceDto,
  ): Promise<HttpResponse<RotationService>> {
    return {
      data: await this.rotationServicesService.updateIncoming(
        _id,
        rotationServiceDto,
      ),
    };
  }

  @Delete(
    `${API_ENDPOINTS.ROTATION_SERVICES.INCOMING}/:${API_ENDPOINTS.ROTATION_SERVICES.BY_ID}`,
  )
  @ApiBearerAuth()
  @ApiOperation({
    summary: '[Users] Delete a Rotation Service in the database',
    description:
      'Deletes a `rotation service` in the database based on the provided `_id`',
  })
  @ApiParam({
    name: API_ENDPOINTS.ROTATION_SERVICES.BY_ID,
    description: '`rotation service` primary key',
  })
  @ApiOkResponse()
  @ApiUnauthorizedResponse({
    description: 'Not authorized to perform the query',
  })
  @ApiForbiddenResponse({
    description: '`rotation service not found` `rotation service not deleted`',
  })
  async deleteIncoming(
    @Param(API_ENDPOINTS.ROTATION_SERVICES.BY_ID, ValidateIdPipe) _id: string,
  ): Promise<HttpResponse<undefined>> {
    await this.rotationServicesService.deleteIncoming(_id);
    return {};
  }

  @Post()
  @ApiBearerAuth()
  @ApiOperation({ summary: '[Users] Add a Rotation Service in the database' })
  @ApiBody({ type: RotationServiceDto, description: '`rotation service` data' })
  @ApiCreatedResponse({ description: 'The created `rotation service`' })
  @ApiUnauthorizedResponse({
    description: 'Not authorized to perform the query',
  })
  @ApiForbiddenResponse({ description: `specialty must exist` })
  async create(
    @Body() rotationServiceDto: RotationServiceDto,
  ): Promise<HttpResponse<RotationService>> {
    return {
      data: await this.rotationServicesService.create(rotationServiceDto),
    };
  }

  @Get()
  @ApiBearerAuth()
  @ApiOperation({
    summary: '[Users] Find all Rotation Services in the database',
    description:
      'Finds in the database all `rotation services` and returns an array of `rotation services`',
  })
  @ApiQuery({ name: 'specialty', description: 'Specialty primary key' })
  @ApiOkResponse({
    type: [RotationService],
    description: 'Array of found `rotation services`',
  })
  @ApiUnauthorizedResponse({
    description: 'Not authorized to perform the query',
  })
  async findAll(
    @Query('specialty', ValidateIdPipe) specialty: string,
  ): Promise<HttpResponse<RotationService[]>> {
    return {
      data: await this.rotationServicesService.find(specialty),
    };
  }

  @Get(`:${API_ENDPOINTS.ROTATION_SERVICES.BY_ID}`)
  @ApiBearerAuth()
  @ApiOperation({ summary: '[Users] Find a Rotation Service in the database' })
  @ApiParam({
    name: API_ENDPOINTS.ROTATION_SERVICES.BY_ID,
    description: '`rotation service` primary key',
  })
  @ApiOkResponse({
    type: RotationService,
    description: 'The found `rotation service`',
  })
  @ApiUnauthorizedResponse({
    description: 'Not authorized to perform the query',
  })
  @ApiForbiddenResponse({ description: '`rotation service not found`' })
  async find(
    @Param(API_ENDPOINTS.ROTATION_SERVICES.BY_ID, ValidateIdPipe) _id: string,
  ): Promise<HttpResponse<RotationService>> {
    return {
      data: await this.rotationServicesService.findOne(_id),
    };
  }

  @Put(`:${API_ENDPOINTS.ROTATION_SERVICES.BY_ID}`)
  @ApiBearerAuth()
  @ApiOperation({
    summary: '[Users] Update a Rotation Service in the database',
    description:
      'Updates in the database a `rotation service` based on the provided `_id` and return the modified `rotation service`',
  })
  @ApiParam({
    name: API_ENDPOINTS.ROTATION_SERVICES.BY_ID,
    description: '`rotation service` primary key',
  })
  @ApiBody({
    type: RotationServiceDto,
    description: '`rotation service` data',
  })
  @ApiOkResponse({
    type: RotationService,
    description: 'The modified `rotation service`',
  })
  @ApiUnauthorizedResponse({
    description: 'Not authorized to perform the query',
  })
  @ApiForbiddenResponse({
    description:
      '`specialty not found` `rotation service not found` `rotation service not modified`',
  })
  async update(
    @Param(API_ENDPOINTS.ROTATION_SERVICES.BY_ID, ValidateIdPipe) _id: string,
    @Body() rotationServiceDto: RotationServiceDto,
  ): Promise<HttpResponse<RotationService>> {
    return {
      data: await this.rotationServicesService.update(_id, rotationServiceDto),
    };
  }

  @Delete(`:${API_ENDPOINTS.ROTATION_SERVICES.BY_ID}`)
  @ApiBearerAuth()
  @ApiOperation({
    summary: '[Users] Delete a Rotation Service in the database',
    description:
      'Deletes a `rotation service` in the database based on the provided `_id`',
  })
  @ApiParam({
    name: API_ENDPOINTS.ROTATION_SERVICES.BY_ID,
    description: '`rotation service` primary key',
  })
  @ApiOkResponse()
  @ApiUnauthorizedResponse({
    description: 'Not authorized to perform the query',
  })
  @ApiForbiddenResponse({
    description: '`rotation service not found` `rotation service not deleted`',
  })
  async delete(
    @Param(API_ENDPOINTS.ROTATION_SERVICES.BY_ID, ValidateIdPipe) _id: string,
  ): Promise<HttpResponse<undefined>> {
    await this.rotationServicesService.delete(_id);
    return {};
  }
}
