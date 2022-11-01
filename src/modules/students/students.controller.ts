import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Put,
  Query,
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
import { ValidateIdPipe, ValidateYearPipe } from '@utils/pipes';
import { CreateStudentDto } from './dto/create-student.dto';
import { UpdateStudentDto } from './dto/update-student.dto';
import { Student } from './student.schema';
import { StudentsService } from './students.service';

@ApiTags('Students')
@Controller(API_ENDPOINTS.STUDENTS.BASE_PATH)
export class StudentsController {
  constructor(private readonly studentsService: StudentsService) {}

  @Post()
  @ApiOperation({
    summary: '[Users] Add a Student to the database',
    description:
      'Creates an `student` in the database and returns the `student`',
  })
  @ApiBearerAuth()
  @ApiBody({ type: CreateStudentDto, description: '`student` data' })
  @ApiCreatedResponse({ type: Student, description: 'The created `student`' })
  @ApiUnauthorizedResponse({
    description: 'Not authorized to perform the query',
  })
  async create(
    @Body() createStudentDto: CreateStudentDto,
  ): Promise<HttpResponse<Student>> {
    return {
      data: await this.studentsService.create(createStudentDto),
    };
  }

  @Get()
  @ApiOperation({
    summary: '[Users] Find all Students in the database',
    description:
      'Finds in the database all `students` based on the provided `speciatlty._id` and `lastYearGeneration` and returns an array of `students`',
  })
  @ApiBearerAuth()
  @ApiQuery({ name: 'specialty', description: '`student` specialty _id' })
  @ApiQuery({
    name: 'lastYearGeneration',
    description: '`student` last year generation',
  })
  @ApiOkResponse({ type: [Student], description: 'Array of found `students`' })
  @ApiUnauthorizedResponse({
    description: 'Not authorized to perform the query',
  })
  async findAll(
    @Query('specialty', ValidateIdPipe) specialtyId: string,
    @Query('lastYearGeneration', ValidateYearPipe) lastYearGeneration: number,
  ): Promise<HttpResponse<Student[]>> {
    return {
      data: await this.studentsService.findAll(specialtyId, lastYearGeneration),
    };
  }

  @Get(`:${API_ENDPOINTS.STUDENTS.BY_ID}`)
  @ApiOperation({
    summary: '[Users] Find a Student in the database',
    description:
      'Finds in the database a `student` based on the provided `_id` and returns the `student`',
  })
  @ApiBearerAuth()
  @ApiParam({
    name: API_ENDPOINTS.STUDENTS.BY_ID,
    description: '`student` primary key',
  })
  @ApiOkResponse({ type: Student, description: 'Found `student`' })
  @ApiForbiddenResponse({
    description: '`student not found`',
  })
  @ApiUnauthorizedResponse({
    description: 'Not authorized to perform the query',
  })
  async findOne(
    @Param(API_ENDPOINTS.STUDENTS.BY_ID, ValidateIdPipe) _id: string,
  ): Promise<HttpResponse<Student>> {
    return {
      data: await this.studentsService.findOne(_id),
    };
  }

  @Put(`:${API_ENDPOINTS.STUDENTS.BY_ID}`)
  @ApiOperation({
    summary: '[User] Update a Student in the database',
    description:
      'Updates in the database a `student` based on the provided `_id` and returns the modified `student`',
  })
  @ApiBearerAuth()
  @ApiParam({
    name: API_ENDPOINTS.STUDENTS.BY_ID,
    description: '`student` primary key',
  })
  @ApiBody({ type: UpdateStudentDto, description: '`student` data' })
  @ApiOkResponse({ type: Student, description: 'The modified `student`' })
  @ApiForbiddenResponse({
    description: '`student not modified` `student not found`',
  })
  @ApiUnauthorizedResponse({
    description: 'Not authorized to perform the query',
  })
  async update(
    @Param(API_ENDPOINTS.STUDENTS.BY_ID, ValidateIdPipe) _id: string,
    @Body() updateStudentDto: UpdateStudentDto,
  ): Promise<HttpResponse<Student>> {
    return {
      data: await this.studentsService.update(_id, updateStudentDto),
    };
  }

  @Delete(`:${API_ENDPOINTS.STUDENTS.BY_ID}`)
  @ApiOperation({
    summary: '[Users] Delete a Student in the database',
    description:
      'Deletes a `student` in the database based on the provided `_id`',
  })
  @ApiBearerAuth()
  @ApiParam({
    name: API_ENDPOINTS.STUDENTS.BY_ID,
    description: '`student` primary key',
  })
  @ApiForbiddenResponse({
    description: '`student not deleted` `student not found`',
  })
  @ApiOkResponse()
  @ApiUnauthorizedResponse({
    description: 'Not authorized to perform the query',
  })
  async remove(
    @Param(API_ENDPOINTS.STUDENTS.BY_ID, ValidateIdPipe) _id: string,
  ): Promise<HttpResponse<undefined>> {
    await this.studentsService.delete(_id);
    return {};
  }
}
