import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
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
import {
  API_ENDPOINTS,
  API_RESOURCES,
  DEFAULT_API_PATHS,
} from '@utils/constants/api-routes.constant';
import { ValidateIdPipe } from '@utils/pipes/validate-id.pipe';
import {
  ExceptionCreateSpecialtyDto,
  ExceptionDeleteSpecialtyDto,
  ExceptionUpdateSpecialtyDto,
} from './dtos/exception-specialty.dto';
import { SpecialtyDto } from './dtos/specialty.dto';
import { SpecialtiesService } from './specialties.service';
import { Specialty } from './specialty.schema';

@ApiTags('Specialties')
@Controller(API_RESOURCES.SPECIALTIES)
export class SpecialtiesController {
  constructor(private readonly specialtiesService: SpecialtiesService) {}

  @Post()
  @ApiOperation({
    summary: '[Users] Add a Specialty in the database',
    description:
      'Creates a `specialty` in the database and returns the `specialty`',
  })
  @ApiBearerAuth()
  @ApiBody({ type: SpecialtyDto, description: '`specialty` data' })
  @ApiCreatedResponse({
    type: Specialty,
    description: 'The created `specialty`',
  })
  @ApiForbiddenResponse({ type: ExceptionCreateSpecialtyDto })
  @ApiUnauthorizedResponse({
    description: 'Not authorized to perform the query',
  })
  async create(@Body() specialtyDto: SpecialtyDto): Promise<Specialty> {
    return await this.specialtiesService.create(specialtyDto);
  }

  @Get()
  @ApiOperation({
    summary: '[Users] Find all Specialties in the database',
    description:
      'Finds in the database all `specialties` and returns an array of `specialties`',
  })
  @ApiBearerAuth()
  @ApiOkResponse({
    type: [Specialty],
    description: 'Array of found `specialties`',
  })
  @ApiUnauthorizedResponse({
    description: 'Not authorized to perform the query',
  })
  async find(): Promise<Specialty[]> {
    return await this.specialtiesService.find();
  }

  @Get(DEFAULT_API_PATHS.BY_ID)
  @ApiBearerAuth()
  async findOne(@Param('_id', ValidateIdPipe) _id: string): Promise<Specialty> {
    return await this.specialtiesService.findOne(_id);
  }

  @Put(DEFAULT_API_PATHS.BY_ID)
  @ApiOperation({
    summary: '[Users] Update a Student in the database',
    description:
      'Updates in the database a `specialty` based on the provided `_id` and returns the modified `specialty`',
  })
  @ApiBearerAuth()
  @ApiParam({
    type: String,
    name: '_id',
    description: '`specialty` primary key',
  })
  @ApiBody({ type: SpecialtyDto, description: '`specialty` data' })
  @ApiForbiddenResponse({ type: ExceptionUpdateSpecialtyDto })
  @ApiUnauthorizedResponse({
    description: 'Not authorized to perform the query',
  })
  async update(
    @Param('_id', ValidateIdPipe) _id: string,
    @Body() specialtyDto: SpecialtyDto,
  ): Promise<Specialty> {
    return await this.specialtiesService.update(_id, specialtyDto);
  }

  @Delete(DEFAULT_API_PATHS.BY_ID)
  @ApiOperation({
    summary: '[Users] Delete a Specialty in the database',
    description:
      'Deletes a `specialty` in the database based on the provided `_id`',
  })
  @ApiBearerAuth()
  @ApiParam({
    type: String,
    name: '_id',
    description: '_id of the `specialty`',
  })
  @ApiOkResponse()
  @ApiForbiddenResponse({ type: ExceptionDeleteSpecialtyDto })
  @ApiUnauthorizedResponse({
    description: 'Not authorized to perform the query',
  })
  async delete(@Param('_id', ValidateIdPipe) _id: string): Promise<void> {
    await this.specialtiesService.delete(_id);
  }
}
