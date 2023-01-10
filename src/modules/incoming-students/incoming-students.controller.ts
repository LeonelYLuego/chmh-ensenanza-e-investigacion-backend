import {
  Controller,
  Get,
  Post,
  Body,
  Put,
  Param,
  Delete,
  Query,
  StreamableFile,
} from '@nestjs/common';
import { UseInterceptors } from '@nestjs/common/decorators/core/use-interceptors.decorator';
import { UploadedFile } from '@nestjs/common/decorators/http/route-params.decorator';
import { FileInterceptor } from '@nestjs/platform-express';
import {
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiParam,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';
import { API_ENDPOINTS, STORAGE_PATHS } from '@utils/constants';
import { HttpResponse } from '@utils/dtos';
import { ValidateIdPipe } from '@utils/pipes';
import { ValidateDatePipe } from '@utils/pipes/validate-date.pipe';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { CreateIncomingStudentDto } from './dto/create-incoming-student.dto';
import { IncomingStudentIntervalDto } from './dto/incoming-student-interval.dto';
import { UpdateIncomingStudentDto } from './dto/update-incoming-student.dto';
import { IncomingStudent } from './incoming-student.schema';
import { IncomingStudentsService } from './incoming-students.service';
import { ValidateIncomingStudentDocumentTypePipe } from './pipes/validate-incoming-student-document-type.pipe';
import {
  IncomingStudentDocumentTypes,
  IncomingStudentDocumentTypesArray,
} from './types/incoming-student-document.type';

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

  @Put(API_ENDPOINTS.INCOMING_STUDENTS.CANCEL)
  @ApiBearerAuth()
  async cancel(
    @Param(API_ENDPOINTS.INCOMING_STUDENTS.BY_ID, ValidateIdPipe) _id: string,
  ): Promise<HttpResponse<IncomingStudent>> {
    return {
      data: await this.incomingStudentsService.cancel(_id),
    };
  }

  @Put(API_ENDPOINTS.INCOMING_STUDENTS.UNCANCEL)
  @ApiBearerAuth()
  async uncancel(
    @Param(API_ENDPOINTS.INCOMING_STUDENTS.BY_ID, ValidateIdPipe) _id: string,
  ): Promise<HttpResponse<IncomingStudent>> {
    return {
      data: await this.incomingStudentsService.uncancel(_id),
    };
  }

  @Put(API_ENDPOINTS.INCOMING_STUDENTS.DOCUMENT_VOBO)
  @ApiBearerAuth()
  async VoBo(
    @Param(API_ENDPOINTS.INCOMING_STUDENTS.BY_ID, ValidateIdPipe) _id: string,
  ): Promise<HttpResponse<IncomingStudent>> {
    return {
      data: await this.incomingStudentsService.VoBo(_id),
    };
  }

  @Get(API_ENDPOINTS.INCOMING_STUDENTS.DOCUMENT)
  @ApiBearerAuth()
  @ApiParam({
    name: API_ENDPOINTS.INCOMING_STUDENTS.BY_ID,
  })
  @ApiQuery({
    name: 'type',
    enum: IncomingStudentDocumentTypesArray,
  })
  async getDocument(
    @Param(API_ENDPOINTS.INCOMING_STUDENTS.BY_ID, ValidateIdPipe) _id: string,
    @Query('type', ValidateIncomingStudentDocumentTypePipe)
    type: IncomingStudentDocumentTypes,
  ): Promise<StreamableFile> {
    return await this.incomingStudentsService.getDocument(
      _id,
      STORAGE_PATHS.INCOMING_STUDENTS,
      type,
    );
  }

  @Put(API_ENDPOINTS.INCOMING_STUDENTS.DOCUMENT)
  @ApiBearerAuth()
  @ApiParam({
    name: API_ENDPOINTS.INCOMING_STUDENTS.BY_ID,
  })
  @ApiQuery({
    name: 'type',
    enum: IncomingStudentDocumentTypesArray,
  })
  @ApiOkResponse({
    type: IncomingStudent,
  })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    description: 'Document',
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: STORAGE_PATHS.INCOMING_STUDENTS,
        filename: (req, file, cb) => {
          const randomName = Array(32)
            .fill(null)
            .map(() => Math.round(Math.random() * 16).toString(16))
            .join('');
          cb(null, `${randomName}${extname(file.originalname)}`);
        },
      }),
    }),
  )
  async updateDocument(
    @Param(API_ENDPOINTS.INCOMING_STUDENTS.BY_ID, ValidateIdPipe) _id: string,
    @UploadedFile() file: Express.Multer.File,
    @Query('type', ValidateIncomingStudentDocumentTypePipe)
    type: IncomingStudentDocumentTypes,
  ): Promise<HttpResponse<IncomingStudent>> {
    return {
      data: await this.incomingStudentsService.updateDocument(
        _id,
        STORAGE_PATHS.INCOMING_STUDENTS,
        file,
        type,
      ),
    };
  }

  @Delete(API_ENDPOINTS.INCOMING_STUDENTS.DOCUMENT)
  @ApiBearerAuth()
  @ApiParam({
    name: 'type',
    enum: IncomingStudentDocumentTypesArray,
  })
  @ApiOkResponse({
    type: IncomingStudent,
  })
  async deleteDocument(
    @Param(API_ENDPOINTS.INCOMING_STUDENTS.BY_ID, ValidateIdPipe) _id: string,
    @Query('type') type: IncomingStudentDocumentTypes,
  ): Promise<HttpResponse<IncomingStudent>> {
    return {
      data: await this.incomingStudentsService.deleteDocument(
        _id,
        STORAGE_PATHS.INCOMING_STUDENTS,
        type,
      ),
    };
  }
}
