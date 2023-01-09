import {
  Controller,
  Get,
  Post,
  Body,
  Put,
  Param,
  Delete,
  Query,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';
import { API_ENDPOINTS, STORAGE_PATHS } from '@utils/constants';
import { HttpResponse } from '@utils/dtos';
import { ValidateIdPipe } from '@utils/pipes';
import { ValidateDatePipe } from '@utils/pipes/validate-date.pipe';
import { CreateIncomingStudentDto } from './dto/create-incoming-student.dto';
import { IncomingStudentIntervalDto } from './dto/incoming-student-interval.dto';
import { UpdateIncomingStudentDto } from './dto/update-incoming-student.dto';
import { IncomingStudent } from './incoming-student.schema';
import { IncomingStudentsService } from './incoming-students.service';

@ApiTags('Incoming Students')
@Controller(API_ENDPOINTS.INCOMING_STUDENTS.BASE_PATH)
export class IncomingStudentsController {
  constructor(
    private readonly incomingStudentsService: IncomingStudentsService,
  ) {}

  @Post()
  @ApiBearerAuth()
  @ApiBody({
    type: CreateIncomingStudentDto,
  })
  @ApiCreatedResponse({
    type: IncomingStudent,
  })
  async create(
    @Body() createIncomingStudentDto: CreateIncomingStudentDto,
  ): Promise<HttpResponse<IncomingStudent>> {
    return {
      data: await this.incomingStudentsService.create(createIncomingStudentDto),
    };
  }

  @Get(API_ENDPOINTS.INCOMING_STUDENTS.INTERVAL)
  @ApiBearerAuth()
  @ApiOkResponse({
    type: IncomingStudentIntervalDto,
  })
  async interval(): Promise<HttpResponse<IncomingStudentIntervalDto>> {
    return {
      data: await this.incomingStudentsService.interval(),
    };
  }

  @Get()
  @ApiBearerAuth()
  @ApiQuery({ name: 'initialDate', type: Date })
  @ApiQuery({ name: 'finalDate', type: Date })
  @ApiOkResponse({ type: [IncomingStudent] })
  async findAll(
    @Query('initialDate', ValidateDatePipe) initialDate: Date,
    @Query('finalDate', ValidateDatePipe) finalDate: Date,
  ): Promise<HttpResponse<IncomingStudent[]>> {
    return {
      data: await this.incomingStudentsService.findAll(initialDate, finalDate),
    };
  }

  @Get(`:${API_ENDPOINTS.INCOMING_STUDENTS.BY_ID}`)
  @ApiBearerAuth()
  @ApiOkResponse({
    type: IncomingStudent,
  })
  async findOne(
    @Param(API_ENDPOINTS.INCOMING_STUDENTS.BY_ID, ValidateIdPipe) _id: string,
  ): Promise<HttpResponse<IncomingStudent>> {
    return {
      data: await this.incomingStudentsService.findOne(_id),
    };
  }

  @Put(`:${API_ENDPOINTS.INCOMING_STUDENTS.BY_ID}`)
  @ApiBearerAuth()
  @ApiBody({
    type: UpdateIncomingStudentDto,
  })
  @ApiOkResponse({
    type: IncomingStudent,
  })
  async update(
    @Param(API_ENDPOINTS.INCOMING_STUDENTS.BY_ID, ValidateIdPipe) _id: string,
    @Body() updateIncomingStudentDto: UpdateIncomingStudentDto,
  ): Promise<HttpResponse<IncomingStudent>> {
    return {
      data: await this.incomingStudentsService.update(
        _id,
        updateIncomingStudentDto,
      ),
    };
  }

  @Delete(`:${API_ENDPOINTS.INCOMING_STUDENTS.BY_ID}`)
  @ApiBearerAuth()
  async remove(
    @Param(API_ENDPOINTS.INCOMING_STUDENTS.BY_ID, ValidateIdPipe) _id: string,
  ): Promise<HttpResponse<undefined>> {
    await this.incomingStudentsService.remove(
      _id,
      STORAGE_PATHS.INCOMING_STUDENTS,
    );
    return {};
  }
}
