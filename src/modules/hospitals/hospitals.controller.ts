import {
  Controller,
  Get,
  Post,
  Body,
  Put,
  Param,
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
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { API_ENDPOINTS } from '@utils/constants';
import { HttpResponse } from '@utils/dtos';
import { ValidateIdPipe } from '@utils/pipes';
import { CreateHospitalDto } from './dto/create-hospital.dto';
import { UpdateHospitalDto } from './dto/update-hospital.dto';
import { Hospital } from './hospital.schema';
import { HospitalsService } from './hospitals.service';

@ApiTags('Hospitals')
@Controller(API_ENDPOINTS.HOSPITALS.BASE_PATH)
export class HospitalsController {
  constructor(private readonly hospitalsService: HospitalsService) {}

  @Post()
  @ApiOperation({
    summary: '[Users] Add a Hospital in the database',
    description:
      'Creates a `hospital` in the database and returns the `hospital`',
  })
  @ApiBearerAuth()
  @ApiBody({ type: CreateHospitalDto, description: '`hospital` data' })
  @ApiCreatedResponse({ type: Hospital, description: 'The created `hospital`' })
  @ApiUnauthorizedResponse({
    description: 'Not authorized to perform the query',
  })
  async create(
    @Body() createHospitalDto: CreateHospitalDto,
  ): Promise<HttpResponse<Hospital>> {
    return {
      data: await this.hospitalsService.create(createHospitalDto),
    };
  }

  @Get()
  @ApiOperation({
    summary: '[Users] Find all Hospitals in the database',
    description:
      'Finds in the database all `hospitals` and returns an array of `hospitals`',
  })
  @ApiBearerAuth()
  @ApiOkResponse({ type: [Hospital] })
  @ApiUnauthorizedResponse({
    description: 'Not authorized to perform the query',
  })
  async findAll(): Promise<HttpResponse<Hospital[]>> {
    return {
      data: await this.hospitalsService.findAll(),
    };
  }

  @Get(API_ENDPOINTS.HOSPITALS.SOCIAL_SERVICE)
  @ApiOperation({
    summary: '[Users] Find Social Service Hospitals in the database',
    description:
      'Finds in the database all social service `hospitals` and returns an array of `hospitals`',
  })
  @ApiBearerAuth()
  @ApiOkResponse({ type: [Hospital] })
  @ApiUnauthorizedResponse({
    description: 'Not authorized to perform the query',
  })
  async findBySocialService(): Promise<HttpResponse<Hospital[]>> {
    return {
      data: await this.hospitalsService.findBySocialService(),
    };
  }

  @Get(`:${API_ENDPOINTS.HOSPITALS.BY_ID}`)
  @ApiOperation({
    summary: '[Users] Find a Hospital in the database',
    description:
      'Finds in the database a `hospital` based on the provided `_id` and returns the found `hospital`',
  })
  @ApiBearerAuth()
  @ApiParam({
    type: String,
    name: API_ENDPOINTS.HOSPITALS.BY_ID,
    description: 'Hospital primary key',
  })
  @ApiOkResponse({ type: Hospital, description: 'The found Hospital' })
  @ApiForbiddenResponse({
    description: '`hospital not found`',
  })
  @ApiUnauthorizedResponse({
    description: 'Not authorized to perform the query',
  })
  async findOne(
    @Param(API_ENDPOINTS.HOSPITALS.BY_ID, ValidateIdPipe) _id: string,
  ): Promise<HttpResponse<Hospital>> {
    return {
      data: await this.hospitalsService.findOne(_id),
    };
  }

  @Put(`:${API_ENDPOINTS.HOSPITALS.BY_ID}`)
  @ApiOperation({
    summary: '[Users] Update a Hospital in the database',
    description:
      'Updates in the database a `hospital` based on the provided `_id` and returns the modfied `hospital`',
  })
  @ApiBearerAuth()
  @ApiParam({
    type: String,
    name: API_ENDPOINTS.HOSPITALS.BY_ID,
    description: '`hospital` primary key',
  })
  @ApiBody({ type: UpdateHospitalDto, description: '`hospital` data' })
  @ApiOkResponse({ type: Hospital, description: 'The updated `hospital`' })
  @ApiForbiddenResponse({})
  @ApiUnauthorizedResponse({
    description: 'Not authorized to perform the query',
  })
  @ApiForbiddenResponse({
    description: '`hospital not found` `hospital not modified`',
  })
  async update(
    @Param(API_ENDPOINTS.HOSPITALS.BY_ID, ValidateIdPipe) _id: string,
    @Body() updateHospitalDto: UpdateHospitalDto,
  ): Promise<HttpResponse<Hospital>> {
    return {
      data: await this.hospitalsService.update(_id, updateHospitalDto),
    };
  }

  @Delete(`:${API_ENDPOINTS.HOSPITALS.BY_ID}`)
  @ApiOperation({
    summary: '[Users] Delete a Hospital in the database',
    description:
      'Deletes a `hospital` in the database based on the provided `_id`',
  })
  @ApiBearerAuth()
  @ApiParam({
    type: String,
    name: API_ENDPOINTS.HOSPITALS.BY_ID,
    description: 'Hospital primary key',
  })
  @ApiOkResponse()
  @ApiForbiddenResponse({
    description: '`hospital not found` `hospital not deleted`',
  })
  @ApiUnauthorizedResponse({
    description: 'Not authorized to perform the query',
  })
  async remove(
    @Param(API_ENDPOINTS.HOSPITALS.BY_ID, ValidateIdPipe) _id: string,
  ): Promise<HttpResponse<undefined>> {
    await this.hospitalsService.remove(_id);
    return {};
  }
}
