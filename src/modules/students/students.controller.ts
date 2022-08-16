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
import { ApiBearerAuth, ApiParam, ApiQuery, ApiTags } from '@nestjs/swagger';
import {
  API_RESOURCES,
  DEFAULT_API_PATHS,
} from '@utils/constants/api-routes.constant';
import { Student } from './student.schema';
import { ValidateIdPipe } from '@utils/pipes/validate-id.pipe';
import { ValidateYearPipe } from '@utils/pipes/validate-year.pipe';

@ApiTags('Students')
@Controller(API_RESOURCES.STUDENTS)
export class StudentsController {
  constructor(private readonly studentsService: StudentsService) {}

  @Post()
  @ApiBearerAuth()
  async create(@Body() createStudentDto: CreateStudentDto): Promise<Student> {
    return await this.studentsService.create(createStudentDto);
  }

  @Get()
  @ApiBearerAuth()
  @ApiQuery({ name: 'specialty', description: 'Student specialty _id' })
  @ApiQuery({name: 'lastYearGeneration', description: 'Student last year generation'})
  async findAll(
    @Query('specialty', ValidateIdPipe) specialtyId: string,
    @Query('lastYearGeneration', ValidateYearPipe) lastYearGeneration: number,
  ): Promise<Student[]> {
    return await this.studentsService.findAll(specialtyId, lastYearGeneration);
  }

  @Get(DEFAULT_API_PATHS.BY_ID)
  @ApiBearerAuth()
  @ApiParam({ name: '_id' })
  async findOne(@Param('_id', ValidateIdPipe) _id: string): Promise<Student> {
    return await this.studentsService.findOne(_id);
  }

  @Put(DEFAULT_API_PATHS.BY_ID)
  @ApiBearerAuth()
  @ApiParam({ name: '_id' })
  async update(
    @Param('_id', ValidateIdPipe) _id: string,
    @Body() updateStudentDto: UpdateStudentDto,
  ): Promise<Student> {
    return await this.studentsService.update(_id, updateStudentDto);
  }

  @Delete(DEFAULT_API_PATHS.BY_ID)
  @ApiBearerAuth()
  @ApiParam({ name: '_id' })
  async remove(@Param('_id', ValidateIdPipe) _id: string): Promise<void> {
    return this.studentsService.delete(_id);
  }
}
