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
  ApiForbiddenResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { API_ENDPOINTS, STORAGE_PATHS } from '@utils/constants';
import { HttpResponse } from '@utils/dtos';
import { ValidateIdPipe, ValidateNumberPipe } from '@utils/pipes';
import { ValidateDatePipe } from '@utils/pipes/validate-date.pipe';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { CreateIncomingStudentDto } from './dto/create-incoming-student.dto';
import { IncomingStudentIntervalDto } from './dto/incoming-student-interval.dto';
import { IncomingStudentsBySpecialtyDto } from './dto/incoming-students-by-specialty.dto';
import { UpdateIncomingStudentDto } from './dto/update-incoming-student.dto';
import { IncomingStudent } from './incoming-student.schema';
import { IncomingStudentsService } from './incoming-students.service';
import { ValidateIncomingStudentDocumentTypePipe } from './pipes/validate-incoming-student-document-type.pipe';
import {
  IncomingStudentDocumentTypes,
  IncomingStudentDocumentTypesArray,
} from './types/incoming-student-document.type';

/** Incoming Students controller */
@ApiTags('Incoming Students')
@Controller(API_ENDPOINTS.INCOMING_STUDENTS.BASE_PATH)
export class IncomingStudentsController {
  constructor(
    private readonly incomingStudentsService: IncomingStudentsService,
  ) {}

  @Post()
  @ApiBearerAuth()
  @ApiOperation({
    summary: '[User] Add an Incoming Student in the database',
    description:
      'Creates a new `Incoming Student` in the database and returns the created `Incoming Student`',
  })
  @ApiBody({
    type: CreateIncomingStudentDto,
    description: 'Incoming Student data',
  })
  @ApiCreatedResponse({
    type: IncomingStudent,
    description: 'The created `incoming student`',
  })
  @ApiForbiddenResponse({
    description: '`specialty not found` `rotation service not found`',
  })
  @ApiUnauthorizedResponse({
    description: 'Not authorized to perform the query',
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
  @ApiOperation({
    summary: '[Users] Get an Incoming Student interval',
    description:
      'Gets from `incoming students` the initial and final registered years',
  })
  @ApiOkResponse({
    type: IncomingStudentIntervalDto,
    description: 'Incoming Student data',
  })
  @ApiForbiddenResponse({
    description: '`incoming student interval not found`',
  })
  @ApiUnauthorizedResponse({
    description: 'Not authorized to perform the query',
  })
  async interval(): Promise<HttpResponse<IncomingStudentIntervalDto>> {
    return {
      data: await this.incomingStudentsService.interval(),
    };
  }

  @Get()
  @ApiBearerAuth()
  @ApiOperation({
    summary: '[Users] Find all Incoming Students in the database',
    description:
      'Finds in the database all `incoming students` and returns an array of `incoming students`',
  })
  @ApiQuery({ name: 'initialDate', type: Date })
  @ApiQuery({ name: 'finalDate', type: Date })
  @ApiOkResponse({
    type: [IncomingStudent],
    description: 'Array of `incoming students`',
  })
  @ApiUnauthorizedResponse({
    description: 'Not authorized to perform the query',
  })
  async findAll(
    @Query('initialDate', ValidateDatePipe) initialDate: Date,
    @Query('finalDate', ValidateDatePipe) finalDate: Date,
  ): Promise<HttpResponse<IncomingStudentsBySpecialtyDto[]>> {
    return {
      data: await this.incomingStudentsService.findAll(initialDate, finalDate),
    };
  }

  @Get(API_ENDPOINTS.INCOMING_STUDENTS.GENERATE)
  @ApiBearerAuth()
  @ApiOperation({
    summary: '[Users] Generate Incoming Students documents',
    description:
      'Generates Incoming Students documents and returns them in a zip file',
  })
  @ApiQuery({ type: Number, name: 'initialNumberOfDocuments' })
  @ApiQuery({ type: Number, name: 'numberOfDocument' })
  @ApiQuery({ type: Date, name: 'dateOfDocuments' })
  @ApiQuery({ type: Date, name: 'dateToPresent' })
  @ApiQuery({ type: Date, name: 'initialDate' })
  @ApiQuery({ type: Date, name: 'finalDate' })
  @ApiQuery({ type: String, name: 'hospital', required: false })
  @ApiQuery({ type: String, name: 'specialty', required: false })
  @ApiOkResponse({
    description: 'The generated document',
  })
  @ApiForbiddenResponse({
    description: '`not template found`',
  })
  @ApiUnauthorizedResponse({
    description: 'Not authorized to perform the query',
  })
  async generateDocuments(
    @Query('initialNumberOfDocuments', ValidateNumberPipe)
    initialNumberOfDocuments: number,
    @Query('numberOfDocument', ValidateNumberPipe)
    numberOfDocument: number,
    @Query('dateOfDocuments', ValidateDatePipe) dateOfDocuments: Date,
    @Query('dateToPresent', ValidateDatePipe) dateToPresent: Date,
    @Query('initialDate', ValidateDatePipe) initialDate: Date,
    @Query('finalDate', ValidateDatePipe) finalDate: Date,
    @Query('hospital', ValidateIdPipe) hospital?: string,
    @Query('specialty', ValidateIdPipe) specialty?: string,
  ): Promise<StreamableFile> {
    return await this.incomingStudentsService.generateDocuments(
      initialNumberOfDocuments,
      numberOfDocument,
      dateOfDocuments,
      dateToPresent,
      initialDate,
      finalDate,
      hospital,
      specialty,
    );
  }

  @Get(`:${API_ENDPOINTS.INCOMING_STUDENTS.BY_ID}`)
  @ApiBearerAuth()
  @ApiOperation({
    summary: '[Users] Find an Incoming Student in the database',
    description:
      'Finds in the database an `incoming student` based on the provided `_id` and returns it',
  })
  @ApiParam({
    name: API_ENDPOINTS.INCOMING_STUDENTS.BY_ID,
    description: '`incoming student` primary key',
  })
  @ApiOkResponse({
    type: IncomingStudent,
    description: 'The found `incoming student`',
  })
  @ApiForbiddenResponse({
    description: '`incoming student not found`',
  })
  @ApiUnauthorizedResponse({
    description: 'Not authorized to perform the query',
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
  @ApiOperation({
    summary: '[Users] Update an Incoming Student in the database',
    description:
      'Updates in the database an `incoming student` based on the provided `_id` and returns the modified `incoming student`',
  })
  @ApiParam({
    name: API_ENDPOINTS.INCOMING_STUDENTS.BY_ID,
    description: '`incoming student` primary key',
  })
  @ApiBody({
    type: UpdateIncomingStudentDto,
    description: '`incoming student` data',
  })
  @ApiOkResponse({
    type: IncomingStudent,
    description: 'The modified `incoming student`',
  })
  @ApiForbiddenResponse({
    description: '`incoming student not found` `incoming student not modified`',
  })
  @ApiUnauthorizedResponse({
    description: 'Not authorized to perform the query',
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
  @ApiOperation({
    summary: '[Users] Deletes an Incoming Student in the database',
    description:
      'Deletes an `incoming student` in the database based on the provided `_id`',
  })
  @ApiParam({
    name: API_ENDPOINTS.INCOMING_STUDENTS.BY_ID,
    description: '`incoming student` primary key',
  })
  @ApiOkResponse({})
  @ApiForbiddenResponse({
    description: '`incoming student not found` `incoming student not deleted`',
  })
  @ApiUnauthorizedResponse({
    description: 'Not authorized to perform the query',
  })
  async delete(
    @Param(API_ENDPOINTS.INCOMING_STUDENTS.BY_ID, ValidateIdPipe) _id: string,
  ): Promise<HttpResponse<undefined>> {
    await this.incomingStudentsService.delete(
      _id,
      STORAGE_PATHS.INCOMING_STUDENTS,
    );
    return {};
  }

  @Put(API_ENDPOINTS.INCOMING_STUDENTS.CANCEL)
  @ApiBearerAuth()
  @ApiOperation({
    summary: '[Users] Cancel an Incoming Student',
    description:
      'Cancels an `incoming student` in the database based on the provided `_id` and return the modified `incoming student`',
  })
  @ApiParam({
    name: API_ENDPOINTS.INCOMING_STUDENTS.BY_ID,
    description: '`incoming student` primary key',
  })
  @ApiOkResponse({
    type: IncomingStudent,
    description: 'The modified `incoming student`',
  })
  @ApiForbiddenResponse({
    description: '`incoming student not found` `incoming student not modified`',
  })
  @ApiUnauthorizedResponse({
    description: 'Not authorized to perform the query',
  })
  async cancel(
    @Param(API_ENDPOINTS.INCOMING_STUDENTS.BY_ID, ValidateIdPipe) _id: string,
  ): Promise<HttpResponse<IncomingStudent>> {
    return {
      data: await this.incomingStudentsService.cancel(_id),
    };
  }

  @Put(API_ENDPOINTS.INCOMING_STUDENTS.UNCANCEL)
  @ApiBearerAuth()
  @ApiOperation({
    summary: '[Users] Uncancel an Incoming Student',
    description:
      'Uncancels an `incoming student` in the database based on the provided `_id` and return the modified `incoming student`',
  })
  @ApiParam({
    name: API_ENDPOINTS.INCOMING_STUDENTS.BY_ID,
    description: '`incoming student` primary key',
  })
  @ApiOkResponse({
    type: IncomingStudent,
    description: 'The modified `incoming student`',
  })
  @ApiForbiddenResponse({
    description: '`incoming student not found` `incoming student not modified`',
  })
  @ApiUnauthorizedResponse({
    description: 'Not authorized to perform the query',
  })
  async uncancel(
    @Param(API_ENDPOINTS.INCOMING_STUDENTS.BY_ID, ValidateIdPipe) _id: string,
  ): Promise<HttpResponse<IncomingStudent>> {
    return {
      data: await this.incomingStudentsService.uncancel(_id),
    };
  }

  @Put(API_ENDPOINTS.INCOMING_STUDENTS.DOCUMENT_VOBO)
  @ApiBearerAuth()
  @ApiOperation({
    summary: '[Users] Change the state of the Incoming Student VoBo',
    description:
      'Changes the state of the `incoming student` VoBo document from `false` to `true` or from `true` to `false` and returns the modified `incoming student`',
  })
  @ApiParam({
    name: API_ENDPOINTS.INCOMING_STUDENTS.BY_ID,
    description: '`incoming student` primary key',
  })
  @ApiOkResponse({
    type: IncomingStudent,
    description: 'The modified `incoming student`',
  })
  @ApiForbiddenResponse({
    description: '`incoming student not found` `incoming student not modified`',
  })
  @ApiUnauthorizedResponse({
    description: 'Not authorized to perform the query',
  })
  async VoBo(
    @Param(API_ENDPOINTS.INCOMING_STUDENTS.BY_ID, ValidateIdPipe) _id: string,
  ): Promise<HttpResponse<IncomingStudent>> {
    return {
      data: await this.incomingStudentsService.VoBo(_id),
    };
  }

  @Get(API_ENDPOINTS.INCOMING_STUDENTS.DOCUMENT)
  @ApiBearerAuth()
  @ApiOperation({
    summary: '[Users] Get an Incoming Student document',
    description: 'Finds in the database the document and returns it',
  })
  @ApiParam({
    name: API_ENDPOINTS.INCOMING_STUDENTS.BY_ID,
    description: '`incoming student` primary key',
  })
  @ApiQuery({
    name: 'type',
    enum: IncomingStudentDocumentTypesArray,
    description: 'Document type',
  })
  @ApiOkResponse({
    type: StreamableFile,
    description: 'The found document',
  })
  @ApiForbiddenResponse({
    description: '`incoming student not found` `document not found`',
  })
  @ApiUnauthorizedResponse({
    description: 'Not authorized to perform the query',
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
  @ApiOperation({
    summary: '[Users] Update an Incoming Student document',
    description:
      'Updates in the database the document and return the modified `incoming student`',
  })
  @ApiParam({
    name: API_ENDPOINTS.INCOMING_STUDENTS.BY_ID,
    description: '`incoming student` primary key',
  })
  @ApiQuery({
    name: 'type',
    enum: IncomingStudentDocumentTypesArray,
    description: 'Document type',
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
  @ApiOkResponse({
    type: IncomingStudent,
    description: 'The modified `incoming student`',
  })
  @ApiForbiddenResponse({
    description:
      '`incoming student not found` `incoming student not modified` `file must be a pdf`',
  })
  @ApiUnauthorizedResponse({
    description: 'Not authorized to perform the query',
  })
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
  @ApiOperation({
    summary: '[Users] Delete an Incoming Student document',
    description:
      'Deletes in the database the document and return the modified `incoming student`',
  })
  @ApiParam({
    name: API_ENDPOINTS.INCOMING_STUDENTS.BY_ID,
    description: '`incoming student` primary key',
  })
  @ApiParam({
    name: 'type',
    enum: IncomingStudentDocumentTypesArray,
    description: 'Document type',
  })
  @ApiOkResponse({
    type: IncomingStudent,
    description: 'The modified `incoming student`',
  })
  @ApiForbiddenResponse({
    description: '`incoming student not found` `incoming student not modified`',
  })
  @ApiUnauthorizedResponse({
    description: 'Not authorized to perform the query',
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
