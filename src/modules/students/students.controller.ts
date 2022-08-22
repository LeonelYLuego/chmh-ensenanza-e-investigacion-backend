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
import { StudentsService } from './students.service';
import { CreateStudentDto } from './dto/create-student.dto';
import { UpdateStudentDto } from './dto/update-student.dto';
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
import {
  API_RESOURCES,
  DEFAULT_API_PATHS,
} from '@utils/constants/api-routes.constant';
import { Student } from './student.schema';
import { ValidateIdPipe } from '@utils/pipes/validate-id.pipe';
import { ValidateYearPipe } from '@utils/pipes/validate-year.pipe';
import {
  ExceptionDeleteStudentDto,
  ExceptionUpdateStudentDto,
} from './dto/exception-student.dto';

@ApiTags('Students')
@Controller(API_RESOURCES.STUDENTS)
export class StudentsController {
  constructor(private readonly studentsService: StudentsService) {}

  @Post()
  @ApiOperation({
    summary: '[Users] Add a Student to the databse',
    description:
      'Creates an `student` in the database and returns the `student`',
  })
  @ApiBearerAuth()
  @ApiBody({ type: CreateStudentDto, description: '`student` data' })
  @ApiCreatedResponse({ type: Student, description: 'The created `student`' })
  @ApiUnauthorizedResponse({
    description: 'Not authorized to perform the query',
  })
  async create(@Body() createStudentDto: CreateStudentDto): Promise<Student> {
    return await this.studentsService.create(createStudentDto);
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
  ): Promise<Student[]> {
    return await this.studentsService.findAll(specialtyId, lastYearGeneration);
  }

  @Get(DEFAULT_API_PATHS.BY_ID)
  @ApiOperation({
    summary: '[Users] Find a Student in the database',
    description:
      'Finds in the database a `student` based on the provided `_id` and returns the `student`',
  })
  @ApiBearerAuth()
  @ApiParam({ name: '_id', description: '`student` primary key' })
  @ApiOkResponse({ type: Student, description: 'Found `student`' })
  @ApiUnauthorizedResponse({
    description: 'Not authorized to perform the query',
  })
  async findOne(@Param('_id', ValidateIdPipe) _id: string): Promise<Student> {
    return await this.studentsService.findOne(_id);
  }

  @Put(DEFAULT_API_PATHS.BY_ID)
  @ApiOperation({
    summary: '[User] Update a Student in the database',
    description:
      'Updates in the database a `student` based on the provided `_id` and returns the modified `student`',
  })
  @ApiBearerAuth()
  @ApiParam({ name: '_id', description: '`student` primary key' })
  @ApiBody({ type: UpdateStudentDto, description: '`student` data' })
  @ApiOkResponse({ type: Student, description: 'The modified `student`' })
  @ApiForbiddenResponse({ type: ExceptionUpdateStudentDto })
  @ApiUnauthorizedResponse({
    description: 'Not authorized to perform the query',
  })
  async update(
    @Param('_id', ValidateIdPipe) _id: string,
    @Body() updateStudentDto: UpdateStudentDto,
  ): Promise<Student> {
    return await this.studentsService.update(_id, updateStudentDto);
  }

  @Delete(DEFAULT_API_PATHS.BY_ID)
  @ApiOperation({
    summary: '[Users] Delete a Student in the database',
    description:
      'Deletes a `student` in the database based on the provided `_id`',
  })
  @ApiBearerAuth()
  @ApiParam({ name: '_id', description: '`student` primary key' })
  @ApiForbiddenResponse({ type: ExceptionDeleteStudentDto })
  @ApiOkResponse()
  @ApiUnauthorizedResponse({
    description: 'Not authorized to perform the query',
  })
  async remove(@Param('_id', ValidateIdPipe) _id: string): Promise<void> {
    return this.studentsService.delete(_id);
  }
}
