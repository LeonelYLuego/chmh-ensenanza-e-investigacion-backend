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
import { IncomingStudentsBySpecialtyDto } from './dto/incoming-students-by-specialty.dto';

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
    await this.specialtiesService.findOneIncoming(
      createIncomingStudentDto.incomingSpecialty,
    );
    await this.rotationServicesService.findOne(
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
  ): Promise<IncomingStudentsBySpecialtyDto[]> {
    const incomingStudentsBySpecialties =
      (await this.incomingStudentsModel.aggregate([
        {
          $match: {
            $or: [
              {
                initialDate: {
                  $gte: initialDate,
                  $lte: finalDate,
                },
              },
              {
                finalDate: {
                  $gte: initialDate,
                  $lte: finalDate,
                },
              },
            ],
          },
        },
        {
          $lookup: {
            from: 'specialties',
            localField: 'incomingSpecialty',
            foreignField: '_id',
            as: 'incomingSpecialty',
          },
        },
        {
          $lookup: {
            from: 'hospitals',
            localField: 'hospital',
            foreignField: '_id',
            as: 'hospital',
          },
        },
        {
          $lookup: {
            from: 'rotationservices',
            localField: 'rotationService',
            foreignField: '_id',
            as: 'rotationService',
          },
        },
        {
          $lookup: {
            from: 'specialties',
            localField: 'rotationService.specialty',
            foreignField: '_id',
            as: 'specialty',
          },
        },
        {
          $project: {
            _id: '$_id',
            name: '$name',
            firstLastName: '$firstLastName',
            secondLastName: '$secondLastName',
            initialDate: '$initialDate',
            finalDate: '$finalDate',
            solicitudeVoBo: '$solicitudeVoBo',
            solicitudeDocument: '$solicitudeDocument',
            acceptanceDocument: '$acceptanceDocument',
            evaluationDocument: '$evaluationDocument',
            canceled: '$canceled',
            incomingSpecialty: { $arrayElemAt: ['$incomingSpecialty', 0] },
            hospital: { $arrayElemAt: ['$hospital', 0] },
            rotationService: { $arrayElemAt: ['$rotationService', 0] },
            specialty: { $arrayElemAt: ['$specialty', 0] },
          },
        },
        {
          $group: {
            _id: '$specialty._id',
            value: { $first: '$specialty.value' },
            incomingStudents: {
              $push: {
                _id: '$_id',
                name: '$name',
                firstLastName: '$firstLastName',
                secondLastName: '$secondLastName',
                initialDate: '$initialDate',
                finalDate: '$finalDate',
                solicitudeVoBo: '$solicitudeVoBo',
                solicitudeDocument: '$solicitudeDocument',
                acceptanceDocument: '$acceptanceDocument',
                evaluationDocument: '$evaluationDocument',
                canceled: '$canceled',
                incomingSpecialty: '$incomingSpecialty',
                hospital: '$hospital',
                rotationService: '$rotationService',
              },
            },
          },
        },
      ])) as IncomingStudentsBySpecialtyDto[];
    incomingStudentsBySpecialties.map((incomingStudentsBySpecialty) => {
      incomingStudentsBySpecialty.incomingStudents.sort((a, b) =>
        a.secondLastName.localeCompare(b.secondLastName),
      );
      incomingStudentsBySpecialty.incomingStudents.sort((a, b) =>
        a.firstLastName.localeCompare(b.firstLastName),
      );
    });
    incomingStudentsBySpecialties.sort((a, b) =>
      a.value.localeCompare(b.value),
    );
    return incomingStudentsBySpecialties;
  }

  async findOne(_id: string): Promise<IncomingStudent> {
    const incomingStudent = await this.incomingStudentsModel
      .findOne({ _id })
      .populate('incomingSpecialty rotationService hospital');
    if (!incomingStudent)
      throw new ForbiddenException('incoming student not found');
    incomingStudent.rotationService.specialty =
      await this.specialtiesService.findOne(
        incomingStudent.rotationService.specialty as unknown as string,
      );
    return incomingStudent;
  }

  async update(
    _id: string,
    updateIncomingStudentDto: UpdateIncomingStudentDto,
  ): Promise<IncomingStudent> {
    await this.findOne(_id);
    await this.specialtiesService.findOneIncoming(
      updateIncomingStudentDto.incomingSpecialty,
    );
    await this.rotationServicesService.findOne(
      updateIncomingStudentDto.rotationService,
    );
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

  async delete(_id: string, path: string): Promise<void> {
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
