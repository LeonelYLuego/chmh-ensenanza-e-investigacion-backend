import { HospitalsService } from '@hospitals/hospitals.service';
import { ForbiddenException, Injectable, StreamableFile } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { SpecialtiesService } from '@specialties/specialties.service';
import { FilesService } from '@utils/services';
import { RotationServicesService } from 'modules/rotation-services';
import { Model } from 'mongoose';
import { CreateIncomingStudentDto } from './dto/create-incoming-student.dto';
import { IncomingStudentIntervalDto } from './dto/incoming-student-interval.dto';
import { UpdateIncomingStudentDto } from './dto/update-incoming-student.dto';
import {
  IncomingStudent,
  IncomingStudentDocument,
} from './incoming-student.schema';
import { IncomingStudentDocumentTypes } from './types/incoming-student-document.type';
import * as fs from 'fs';

@Injectable()
export class IncomingStudentsService {
  constructor(
    @InjectModel(IncomingStudent.name)
    private incomingStudentsModel: Model<IncomingStudentDocument>,
    private rotationServicesService: RotationServicesService,
    private hospitalsService: HospitalsService,
    private specialtiesService: SpecialtiesService,
    private filesService: FilesService,
  ) {}

  async create(
    createIncomingStudentDto: CreateIncomingStudentDto,
  ): Promise<IncomingStudent> {
    await this.rotationServicesService.findOneIncoming(
      createIncomingStudentDto.rotationService,
    );
    await this.hospitalsService.findOne(createIncomingStudentDto.hospital);
    const createdIncomingStudent = new this.incomingStudentsModel(
      createIncomingStudentDto,
    );
    return await createdIncomingStudent.save();
  }

  async findAll(
    initialDate: Date,
    finalDate: Date,
  ): Promise<IncomingStudent[]> {
    return await this.incomingStudentsModel
      .find({
        initialDate: {
          $gte: initialDate,
        },
        finalDate: {
          $lte: finalDate,
        },
      })
      .populate('hospital')
      .sort('initialDate');
  }

  async findOne(_id: string): Promise<IncomingStudent> {
    const incomingStudent = await this.incomingStudentsModel
      .findOne({ _id })
      .populate('rotationService hospital');
    if (!incomingStudent)
      throw new ForbiddenException('incoming student not found');
    incomingStudent.rotationService.specialty =
      await this.specialtiesService.findOneIncoming(
        incomingStudent.rotationService.specialty as unknown as string,
      );
    return incomingStudent;
  }

  async update(
    _id: string,
    updateIncomingStudentDto: UpdateIncomingStudentDto,
  ): Promise<IncomingStudent> {
    await this.findOne(_id);
    if (updateIncomingStudentDto.rotationService)
      await this.rotationServicesService.findOneIncoming(
        updateIncomingStudentDto.rotationService,
      );
    if (updateIncomingStudentDto.hospital)
      await this.hospitalsService.findOne(updateIncomingStudentDto.hospital);
    if (
      (
        await this.incomingStudentsModel.updateOne(
          { _id },
          updateIncomingStudentDto,
        )
      ).modifiedCount == 0
    )
      throw new ForbiddenException('incoming student not modified');
    return await this.findOne(_id);
  }

  async remove(_id: string, path: string): Promise<void> {
    const incomingStudent = await this.findOne(_id);
    if (incomingStudent.acceptanceDocument)
      this.filesService.deleteFile(
        `${path}/${incomingStudent.acceptanceDocument}`,
      );
    if (incomingStudent.evaluationDocument)
      this.filesService.deleteFile(
        `${path}/${incomingStudent.evaluationDocument}`,
      );
    if (incomingStudent.solicitudeDocument)
      this.filesService.deleteFile(
        `${path}/${incomingStudent.solicitudeDocument}`,
      );
    await this.incomingStudentsModel.findOneAndDelete({ _id });
    if (await this.incomingStudentsModel.findOne({ _id }))
      throw new ForbiddenException('incoming student not deleted');
  }

  async interval(): Promise<IncomingStudentIntervalDto> {
    const min = await this.incomingStudentsModel.findOne().sort('initialDate');
    const max = await this.incomingStudentsModel.findOne().sort('-finalDate');
    if (min && max) {
      return {
        initialYear: min.initialDate.getFullYear(),
        finalYear: max.finalDate.getFullYear(),
      };
    }
    throw new ForbiddenException('incoming student interval not found');
  }

  async getDocument(
    _id: string,
    path: string,
    document: IncomingStudentDocumentTypes,
  ): Promise<StreamableFile> {
    const incomingStudent = await this.findOne(_id);
    if (incomingStudent[document]) {
      const filePath = `${path}/${incomingStudent[document]}`;
      if (fs.existsSync(filePath)) {
        const file = fs.createReadStream(filePath);
        return new StreamableFile(file, {
          type: 'application/pdf',
        });
      }
    }
    throw new ForbiddenException('document not found');
  }

  async updateDocument(
    _id: string,
    path: string,
    file: Express.Multer.File,
    document: IncomingStudentDocumentTypes,
  ): Promise<IncomingStudent> {
    try {
      this.filesService.validatePDF(file);
      const incomingStudent = await this.findOne(_id);
      if (incomingStudent[document]) {
        this.filesService.deleteFile(`${path}/${incomingStudent[document]}`);
      }
      let updateObject: object = {};
      updateObject[document] = file.filename;
      if (
        (
          await this.incomingStudentsModel.updateOne(
            { _id: incomingStudent._id },
            updateObject,
          )
        ).modifiedCount < 1
      )
        throw new ForbiddenException('incoming student not modified');
      return await this.findOne(_id);
    } catch (err) {
      this.filesService.deleteFile(`${path}/${file.filename}`);
    }
  }

  async deleteDocument(
    _id: string,
    path: string,
    document: IncomingStudentDocumentTypes,
  ): Promise<IncomingStudent> {
    const incomingStudent = await this.findOne(_id);
    if (incomingStudent[document])
      this.filesService.deleteFile(`${path}/${incomingStudent[document]}`);
    let updateObject: object = {};
    updateObject[document] = null;
    if (
      (
        await this.incomingStudentsModel.updateOne(
          { _id: incomingStudent._id },
          updateObject,
        )
      ).modifiedCount < 1
    )
      throw new ForbiddenException('incoming student not modified');
    return await this.findOne(_id);
  }

  async VoBo(_id: string): Promise<IncomingStudent> {
    const incomingStudent = await this.findOne(_id);
    if (
      (
        await this.incomingStudentsModel.updateOne(
          {
            _id,
          },
          {
            solicitudeVoBo: !incomingStudent.solicitudeVoBo,
          },
        )
      ).modifiedCount < 1
    )
      throw new ForbiddenException('incoming student not modified');
    return await this.findOne(_id);
  }

  async cancel(_id: string): Promise<IncomingStudent> {
    await this.findOne(_id);
    if (
      (await this.incomingStudentsModel.updateOne({ _id }, { canceled: true }))
        .modifiedCount < 1
    )
      throw new ForbiddenException('incoming student not modified');
    return await this.findOne(_id);
  }

  async uncancel(_id: string): Promise<IncomingStudent> {
    await this.findOne(_id);
    if (
      (await this.incomingStudentsModel.updateOne({ _id }, { canceled: false }))
        .modifiedCount < 1
    )
      throw new ForbiddenException('incoming student not modified');
    return await this.findOne(_id);
  }
}
