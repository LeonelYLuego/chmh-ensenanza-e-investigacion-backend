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
import { API_ENDPOINTS } from '@utils/constants';
import { HttpResponse } from '@utils/dtos';
import { ValidateIdPipe } from '@utils/pipes';
import { IncomingSpecialtyDto } from './dtos/incoming-specialty.dto';
import { SpecialtyDto } from './dtos/specialty.dto';
import { SpecialtiesService } from './specialties.service';
import { Specialty } from './specialty.schema';

@ApiTags('Specialties')
@Controller(API_ENDPOINTS.SPECIALTIES.BASE_PATH)
export class SpecialtiesController {
  constructor(private readonly specialtiesService: SpecialtiesService) {}

  // Incoming ////////////////////////////////////////////////////////////////////
  @Post(API_ENDPOINTS.SPECIALTIES.INCOMING)
  @ApiOperation({
    summary: '[Users] Add a Incoming Specialty in the database',
    description:
      'Creates a `incoming specialty` in the database and returns the `specialty`',
  })
  @ApiBearerAuth()
  @ApiBody({
    type: IncomingSpecialtyDto,
    description: '`incoming specialty` data',
  })
  @ApiCreatedResponse({
    type: Specialty,
    description: 'The created `incoming specialty`',
  })
  @ApiForbiddenResponse({
    description: '`incoming specialty already exists`',
  })
  @ApiUnauthorizedResponse({
    description: 'Not authorized to perform the query',
  })
  async createIncoming(
    @Body() incomingSpecialtyDto: IncomingSpecialtyDto,
  ): Promise<HttpResponse<Specialty>> {
    return {
      data: await this.specialtiesService.createIncoming(incomingSpecialtyDto),
    };
  }

  @Get(API_ENDPOINTS.SPECIALTIES.INCOMING)
  @ApiOperation({
    summary: '[Users] Find all Incoming Specialties in the database',
    description:
      'Finds in the database all `incoming specialties` and returns an array of `specialties`',
  })
  @ApiBearerAuth()
  @ApiOkResponse({
    type: [Specialty],
    description: 'Array of found `incoming specialties`',
  })
  @ApiUnauthorizedResponse({
    description: 'Not authorized to perform the query',
  })
  async findIncoming(): Promise<HttpResponse<Specialty[]>> {
    return {
      data: await this.specialtiesService.findIncoming(),
    };
  }

  @Get(
    `${API_ENDPOINTS.SPECIALTIES.INCOMING}/:${API_ENDPOINTS.SPECIALTIES.BY_ID}`,
  )
  @ApiOperation({
    summary: '[Users] Find a Incoming Specialty in the database',
    description: 'Finds in the database a `incoming specialty` and returns it',
  })
  @ApiBearerAuth()
  @ApiParam({
    type: String,
    name: API_ENDPOINTS.SPECIALTIES.BY_ID,
    description: '`incoming specialty` primary key',
  })
  @ApiOkResponse({
    type: Specialty,
    description: 'The found `incoming specialty`',
  })
  @ApiForbiddenResponse({
    description: '`specialty not found`',
  })
  @ApiUnauthorizedResponse({
    description: 'Not authorized to perform the query',
  })
  async findOneIncoming(
    @Param(API_ENDPOINTS.SPECIALTIES.BY_ID, ValidateIdPipe) _id: string,
  ): Promise<HttpResponse<Specialty>> {
    return {
      data: await this.specialtiesService.findOneIncoming(_id),
    };
  }

  @Put(
    `${API_ENDPOINTS.SPECIALTIES.INCOMING}/:${API_ENDPOINTS.SPECIALTIES.BY_ID}`,
  )
  @ApiOperation({
    summary: '[Users] Update a Incoming Specialty in the database',
    description:
      'Updates in the database a `incoming specialty` based on the provided `_id` and returns the modified `specialty`',
  })
  @ApiBearerAuth()
  @ApiParam({
    type: String,
    name: API_ENDPOINTS.SPECIALTIES.BY_ID,
    description: '`incoming specialty` primary key',
  })
  @ApiBody({
    type: IncomingSpecialtyDto,
    description: '`incoming specialty` data',
  })
  @ApiForbiddenResponse({
    description: '`specialty not modified` `specialty not found`',
  })
  @ApiUnauthorizedResponse({
    description: 'Not authorized to perform the query',
  })
  async updateIncoming(
    @Param(API_ENDPOINTS.SPECIALTIES.BY_ID, ValidateIdPipe) _id: string,
    @Body() incomingSpecialtyDto: IncomingSpecialtyDto,
  ): Promise<HttpResponse<Specialty>> {
    return {
      data: await this.specialtiesService.updateIncoming(
        _id,
        incomingSpecialtyDto,
      ),
    };
  }

  @Delete(
    `${API_ENDPOINTS.SPECIALTIES.INCOMING}/:${API_ENDPOINTS.SPECIALTIES.BY_ID}`,
  )
  @ApiOperation({
    summary: '[Users] Delete a Incoming Specialty in the database',
    description:
      'Deletes a `incoming specialty` in the database based on the provided `_id`',
  })
  @ApiBearerAuth()
  @ApiParam({
    type: String,
    name: API_ENDPOINTS.SPECIALTIES.BY_ID,
    description: '_id of the `incoming specialty`',
  })
  @ApiOkResponse()
  @ApiForbiddenResponse({
    description: '`specialty not deleted` `specialty not found`',
  })
  @ApiUnauthorizedResponse({
    description: 'Not authorized to perform the query',
  })
  async deleteIncoming(
    @Param(API_ENDPOINTS.SPECIALTIES.BY_ID, ValidateIdPipe) _id: string,
  ): Promise<HttpResponse<undefined>> {
    await this.specialtiesService.deleteIncoming(_id);
    return {};
  }

  // Normal /////////////////////////////////////////////////////////////////////////
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
  @ApiForbiddenResponse({
    description: '`specialty already exists`',
  })
  @ApiUnauthorizedResponse({
    description: 'Not authorized to perform the query',
  })
  async create(
    @Body() specialtyDto: SpecialtyDto,
  ): Promise<HttpResponse<Specialty>> {
    return {
      data: await this.specialtiesService.create(specialtyDto),
    };
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
  async find(): Promise<HttpResponse<Specialty[]>> {
    return {
      data: await this.specialtiesService.find(),
    };
  }

  @Get(`:${API_ENDPOINTS.SPECIALTIES.BY_ID}`)
  @ApiOperation({
    summary: '[Users] Find a Specialty in the database',
    description: 'Finds in the database a `specialty` and returns it',
  })
  @ApiBearerAuth()
  @ApiParam({
    type: String,
    name: API_ENDPOINTS.SPECIALTIES.BY_ID,
    description: '`specialty` primary key',
  })
  @ApiOkResponse({
    type: Specialty,
    description: 'The found `specialty`',
  })
  @ApiForbiddenResponse({
    description: '`specialty not found`',
  })
  @ApiUnauthorizedResponse({
    description: 'Not authorized to perform the query',
  })
  async findOne(
    @Param(API_ENDPOINTS.SPECIALTIES.BY_ID, ValidateIdPipe) _id: string,
  ): Promise<HttpResponse<Specialty>> {
    return {
      data: await this.specialtiesService.findOne(_id),
    };
  }

  @Put(`:${API_ENDPOINTS.SPECIALTIES.BY_ID}`)
  @ApiOperation({
    summary: '[Users] Update a Specialty in the database',
    description:
      'Updates in the database a `specialty` based on the provided `_id` and returns the modified `specialty`',
  })
  @ApiBearerAuth()
  @ApiParam({
    type: String,
    name: API_ENDPOINTS.SPECIALTIES.BY_ID,
    description: '`specialty` primary key',
  })
  @ApiBody({ type: SpecialtyDto, description: '`specialty` data' })
  @ApiForbiddenResponse({
    description: '`specialty not modified` `specialty not found`',
  })
  @ApiUnauthorizedResponse({
    description: 'Not authorized to perform the query',
  })
  async update(
    @Param(API_ENDPOINTS.SPECIALTIES.BY_ID, ValidateIdPipe) _id: string,
    @Body() specialtyDto: SpecialtyDto,
  ): Promise<HttpResponse<Specialty>> {
    return {
      data: await this.specialtiesService.update(_id, specialtyDto),
    };
  }

  @Delete(`:${API_ENDPOINTS.SPECIALTIES.BY_ID}`)
  @ApiOperation({
    summary: '[Users] Delete a Specialty in the database',
    description:
      'Deletes a `specialty` in the database based on the provided `_id`',
  })
  @ApiBearerAuth()
  @ApiParam({
    type: String,
    name: API_ENDPOINTS.SPECIALTIES.BY_ID,
    description: '_id of the `specialty`',
  })
  @ApiOkResponse()
  @ApiForbiddenResponse({
    description: '`specialty not deleted` `specialty not found`',
  })
  @ApiUnauthorizedResponse({
    description: 'Not authorized to perform the query',
  })
  async delete(
    @Param(API_ENDPOINTS.SPECIALTIES.BY_ID, ValidateIdPipe) _id: string,
  ): Promise<HttpResponse<undefined>> {
    await this.specialtiesService.delete(_id);
    return {};
  }
}
