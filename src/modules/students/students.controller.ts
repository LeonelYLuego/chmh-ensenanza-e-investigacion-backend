import { Controller, Get, Post, Body, Param, Delete, Put } from '@nestjs/common';
import { StudentsService } from './students.service';
import { CreateStudentDto } from './dto/create-student.dto';
import { UpdateStudentDto } from './dto/update-student.dto';
import { ApiBearerAuth, ApiParam, ApiTags } from '@nestjs/swagger';
import { API_RESOURCES, DEFAULT_API_PATHS } from '@utils/constants/api-routes.constant';
import { Student } from './student.schema';

@ApiTags('Students')
@Controller(API_RESOURCES.STUDENTS)
export class StudentsController {
  constructor(private readonly studentsService: StudentsService) {}

  @Post()
  @ApiBearerAuth()
  async create(@Body() createStudentDto: CreateStudentDto) : Promise<Student> {
    return await this.studentsService.create(createStudentDto);
  }

  @Get()
  @ApiBearerAuth()
  async findAll() : Promise<Student[]> {
    return await this.studentsService.findAll();
  }

  @Get(DEFAULT_API_PATHS.BY_ID)
  @ApiBearerAuth()
  @ApiParam({name: '_id'})
  async findOne(@Param('_id') _id: string) : Promise<Student> {
    return await this.studentsService.findOne(_id);
  }

  @Put(DEFAULT_API_PATHS.BY_ID)
  @ApiBearerAuth()
  @ApiParam({name: '_id'})
  async update(@Param('_id') _id: string, @Body() updateStudentDto: UpdateStudentDto) : Promise<Student> {
    return await this.studentsService.update(_id, updateStudentDto);
  }

  @Delete(DEFAULT_API_PATHS.BY_ID)
  @ApiBearerAuth()
  @ApiParam({name: '_id'})
  async remove(@Param('_id') _id: string) : Promise<void> {
    return this.studentsService.delete(_id);
  }
}
