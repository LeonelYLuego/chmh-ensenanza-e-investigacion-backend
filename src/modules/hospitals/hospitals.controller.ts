import {
  Controller,
  Get,
  Post,
  Body,
  Put,
  Param,
  Delete,
} from '@nestjs/common';
import { HospitalsService } from './hospitals.service';
import { CreateHospitalDto } from './dto/create-hospital.dto';
import { UpdateHospitalDto } from './dto/update-hospital.dto';
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
import {
  API_ENDPOINTS,
  API_RESOURCES,
  DEFAULT_API_PATHS,
} from '@utils/constants/api-routes.constant';
import { Hospital } from './hospital.schema';
import { ValidateIdPipe } from '@utils/pipes/validate-id.pipe';
import {
  ExceptionDeleteHospitalDto,
  ExceptionFindHospitalDto,
  ExceptionUpdateHospitalDto,
} from './dto/exception-hospital.dto';

@ApiTags('Hospitals')
@Controller(API_RESOURCES.HOSPITALS)
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
  ): Promise<Hospital> {
    return await this.hospitalsService.create(createHospitalDto);
  }

  @Get()
  @ApiOperation({
    summary: '[Users] Find all Hospitals in the database',
    description:
      'Finds in the database al `hospitals` and returns an array of `hospitals`',
  })
  @ApiBearerAuth()
  @ApiOkResponse({ type: [Hospital] })
  @ApiUnauthorizedResponse({
    description: 'Not authorized to perform the query',
  })
  async findAll(): Promise<Hospital[]> {
    return await this.hospitalsService.findAll();
  }

  @Get(API_ENDPOINTS.HOSPITALS.SOCIAL_SERVICE)
  @ApiBearerAuth()
  async findBySocialService(): Promise<Hospital[]> {
    return await this.hospitalsService.findBySocialService();
  }

  @Get(DEFAULT_API_PATHS.BY_ID)
  @ApiOperation({
    summary: '[Users] Find a Hospital in the database',
    description:
      'Finds in the database a `hospital` based on the provided `_id` and returns the found `hospital`',
  })
  @ApiBearerAuth()
  @ApiParam({ type: String, name: '_id', description: 'Hospital primary key' })
  @ApiOkResponse({ type: Hospital, description: 'The found Hospital' })
  @ApiForbiddenResponse({ type: ExceptionFindHospitalDto })
  @ApiUnauthorizedResponse({
    description: 'Not authorized to perform the query',
  })
  async findOne(@Param('_id', ValidateIdPipe) _id: string): Promise<Hospital> {
    return await this.hospitalsService.findOne(_id);
  }

  @Put(DEFAULT_API_PATHS.BY_ID)
  @ApiOperation({
    summary: '[Users] Update a Hospital in the database',
    description:
      'Updates in the database a `hospital` based on the provided `_id` and returns the modfied `hospital`',
  })
  @ApiBearerAuth()
  @ApiParam({
    type: String,
    name: '_id',
    description: '`hospital` primary key',
  })
  @ApiBody({ type: UpdateHospitalDto, description: '`hospital` data' })
  @ApiOkResponse({ type: Hospital, description: 'The updated `hospital`' })
  @ApiForbiddenResponse({ type: ExceptionUpdateHospitalDto })
  @ApiUnauthorizedResponse({
    description: 'Not authorized to perform the query',
  })
  async update(
    @Param('_id', ValidateIdPipe) _id: string,
    @Body() updateHospitalDto: UpdateHospitalDto,
  ): Promise<Hospital> {
    return await this.hospitalsService.update(_id, updateHospitalDto);
  }

  @Delete(DEFAULT_API_PATHS.BY_ID)
  @ApiOperation({
    summary: '[Users] Delete a Hospital in the database',
    description:
      'Deletes a `hospital` in the database based on the provided `_id`',
  })
  @ApiBearerAuth()
  @ApiParam({ type: String, name: '_id', description: 'Hospital primary key' })
  @ApiOkResponse()
  @ApiForbiddenResponse({ type: ExceptionDeleteHospitalDto })
  @ApiUnauthorizedResponse({
    description: 'Not authorized to perform the query',
  })
  async remove(@Param('_id', ValidateIdPipe) _id: string): Promise<void> {
    await this.hospitalsService.remove(_id);
  }
}
