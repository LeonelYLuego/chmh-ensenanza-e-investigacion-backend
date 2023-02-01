import { Injectable, StreamableFile } from '@nestjs/common';
import { ForbiddenException } from '@nestjs/common/exceptions';
import { InjectModel } from '@nestjs/mongoose';
import { FilesService } from '@utils/services';
import { Model } from 'mongoose';
import { CreateObligatoryMobilityDto } from '../dto/create-obligatory-mobility.dto';
import { ObligatoryMobilityByHospitalDto } from '../dto/obligatory-mobility-by-hospital.dto';
import { ObligatoryMobilityByStudentDto } from '../dto/obligatory-mobility-by-student.dto';
import { ObligatoryMobilityIntervalDto } from '../dto/obligatory-mobility-interval.dto';
import { UpdateObligatoryMobilityDto } from '../dto/update-obligatory-mobility.dto';
import {
  ObligatoryMobility,
  ObligatoryMobilityDocument,
} from '../schemas/obligatory-mobility.schema';
import { ObligatoryMobilityDocumentTypes } from '../types/obligatory-mobility-document.type';
import * as fs from 'fs';
import { ObligatoryMobilityResponseDto } from '../dto/obligatory-mobility-response.dto';
import { AttachmentsObligatoryMobilitiesService } from './attachments-obligatory-movility.service';

@Injectable()
export class ObligatoryMobilitiesService {
  constructor(
    @InjectModel(ObligatoryMobility.name)
    private obligatoryMobilitiesModel: Model<ObligatoryMobilityDocument>,
    private attachmentsObligatoryMobilitiesService: AttachmentsObligatoryMobilitiesService,
    private filesService: FilesService,
  ) {}

  async create(
    createObligatoryMobilityDto: CreateObligatoryMobilityDto,
  ): Promise<ObligatoryMobility> {
    const obligatoryMobility = new this.obligatoryMobilitiesModel(
      createObligatoryMobilityDto,
    );
    return await obligatoryMobility.save();
  }

  async findAll(
    specialty: string,
    hospital: string,
    initialDate: Date,
    finalDate: Date,
  ): Promise<ObligatoryMobility[]> {
    var ObjectId = require('mongoose').Types.ObjectId;
    const obligatoryMobilities = await this.obligatoryMobilitiesModel
      .find({
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
        hospital: new ObjectId(hospital),
      })
      .populate('student rotationService')
      .sort('initialDate');
    return obligatoryMobilities.filter(
      (obligatoryMobility) =>
        JSON.stringify(obligatoryMobility.student.specialty) ==
        JSON.stringify(specialty),
    );
  }

  async findAllByHospital(
    specialty: string,
    initialDate: Date,
    finalDate: Date,
  ): Promise<ObligatoryMobilityByHospitalDto[]> {
    let obligatoryMobilitiesByHospital =
      (await this.obligatoryMobilitiesModel.aggregate([
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
            from: 'rotationservices',
            localField: 'rotationService',
            foreignField: '_id',
            as: 'rotationService',
          },
        },
        {
          $lookup: {
            from: 'students',
            localField: 'student',
            foreignField: '_id',
            as: 'student',
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
          $project: {
            _id: '$_id',
            initialDate: '$initialDate',
            finalDate: '$finalDate',
            presentationOfficeDocument: '$presentationOfficeDocument',
            evaluationDocument: '$evaluationDocument',
            canceled: '$canceled',
            student: { $arrayElemAt: ['$student', 0] },
            hospital: { $arrayElemAt: ['$hospital', 0] },
            rotationService: { $arrayElemAt: ['$rotationService', 0] },
          },
        },
        {
          $group: {
            _id: '$hospital._id',
            name: { $first: '$hospital.name' },
            obligatoryMobilities: {
              $push: {
                _id: '$_id',
                initialDate: '$initialDate',
                finalDate: '$finalDate',
                presentationOfficeDocument: '$presentationOfficeDocument',
                evaluationDocument: '$evaluationDocument',
                canceled: '$canceled',
                student: '$student',
                rotationService: '$rotationService',
              },
            },
          },
        },
      ])) as ObligatoryMobilityByHospitalDto[];

    for (let i = 0; i < obligatoryMobilitiesByHospital.length; i++) {
      obligatoryMobilitiesByHospital[i].obligatoryMobilities =
        obligatoryMobilitiesByHospital[i].obligatoryMobilities.filter(
          (obligatoryMobility) =>
            (obligatoryMobility.rotationService.specialty as unknown) ==
            specialty,
        );
      obligatoryMobilitiesByHospital[i].obligatoryMobilities.sort(
        (a, b) => a.finalDate.getTime() - b.finalDate.getTime(),
      );
      obligatoryMobilitiesByHospital[i].obligatoryMobilities.sort(
        (a, b) => a.initialDate.getTime() - b.initialDate.getTime(),
      );
      const attachmentsObligatoryMobilities =
        await this.attachmentsObligatoryMobilitiesService.findAttachments(
          initialDate,
          finalDate,
          specialty,
          obligatoryMobilitiesByHospital[i]._id,
        );
      obligatoryMobilitiesByHospital[i].obligatoryMobilities.map(
        (obligatoryMobility) => {
          obligatoryMobility.solicitudeDocument = [];
          obligatoryMobility.acceptanceDocument = [];
        },
      );
      attachmentsObligatoryMobilities.map((attachmentsObligatoryMobility) => {
        const aInitialDate =
            attachmentsObligatoryMobility.initialDate.getTime(),
          aFinalDate = attachmentsObligatoryMobility.finalDate.getTime();
        obligatoryMobilitiesByHospital[i].obligatoryMobilities.map(
          (obligatoryMobility) => {
            const oInitialDate = obligatoryMobility.initialDate.getTime(),
              oFinalDate = obligatoryMobility.finalDate.getTime();
            if (
              (oInitialDate >= aInitialDate && oInitialDate <= aFinalDate) ||
              (oFinalDate >= aInitialDate && oFinalDate <= aFinalDate)
            ) {
              if (attachmentsObligatoryMobility.solicitudeDocument)
                obligatoryMobility.solicitudeDocument.push(
                  attachmentsObligatoryMobility._id,
                );
              if (attachmentsObligatoryMobility.acceptanceDocument)
                obligatoryMobility.acceptanceDocument.push(
                  attachmentsObligatoryMobility._id,
                );
            }
          },
        );
      });
    }
    for (let i = 0; i < obligatoryMobilitiesByHospital.length; i++)
      if (obligatoryMobilitiesByHospital[i].obligatoryMobilities.length == 0)
        obligatoryMobilitiesByHospital.splice(i, 1);
    obligatoryMobilitiesByHospital.sort((a, b) => a.name.localeCompare(b.name));
    return obligatoryMobilitiesByHospital;
  }

  async findAllByStudent(
    specialty: string,
    initialDate: Date,
    finalDate: Date,
  ): Promise<ObligatoryMobilityByStudentDto[]> {
    let obligatoryMobilitiesByStudent =
      (await this.obligatoryMobilitiesModel.aggregate([
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
            from: 'rotationservices',
            localField: 'rotationService',
            foreignField: '_id',
            as: 'rotationService',
          },
        },
        {
          $lookup: {
            from: 'students',
            localField: 'student',
            foreignField: '_id',
            as: 'student',
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
          $project: {
            _id: '$_id',
            initialDate: '$initialDate',
            finalDate: '$finalDate',
            presentationOfficeDocument: '$presentationOfficeDocument',
            evaluationDocument: '$evaluationDocument',
            canceled: '$canceled',
            student: { $arrayElemAt: ['$student', 0] },
            hospital: { $arrayElemAt: ['$hospital', 0] },
            rotationService: { $arrayElemAt: ['$rotationService', 0] },
          },
        },
        {
          $group: {
            _id: '$student._id',
            name: { $first: '$student.name' },
            firstLastName: { $first: '$student.firstLastName' },
            secondLastName: { $first: '$student.secondLastName' },
            obligatoryMobilities: {
              $push: {
                _id: '$_id',
                initialDate: '$initialDate',
                finalDate: '$finalDate',
                presentationOfficeDocument: '$presentationOfficeDocument',
                evaluationDocument: '$evaluationDocument',
                canceled: '$canceled',
                hospital: '$hospital',
                rotationService: '$rotationService',
              },
            },
          },
        },
      ])) as ObligatoryMobilityByStudentDto[];

    for (let i = 0; i < obligatoryMobilitiesByStudent.length; i++) {
      obligatoryMobilitiesByStudent[i].obligatoryMobilities =
        obligatoryMobilitiesByStudent[i].obligatoryMobilities.filter(
          (obligatoryMobility) =>
            (obligatoryMobility.rotationService.specialty as unknown) ==
            specialty,
        );
      obligatoryMobilitiesByStudent[i].obligatoryMobilities.sort(
        (a, b) => a.finalDate.getTime() - b.finalDate.getTime(),
      );
      obligatoryMobilitiesByStudent[i].obligatoryMobilities.sort(
        (a, b) => a.initialDate.getTime() - b.initialDate.getTime(),
      );
    }
    for (let i = 0; i < obligatoryMobilitiesByStudent.length; i++)
      if (obligatoryMobilitiesByStudent[i].obligatoryMobilities.length == 0)
        obligatoryMobilitiesByStudent.splice(i, 1);
    obligatoryMobilitiesByStudent.sort((a, b) =>
      a.secondLastName.localeCompare(b.secondLastName),
    );
    obligatoryMobilitiesByStudent.sort((a, b) =>
      a.firstLastName.localeCompare(b.firstLastName),
    );
    return obligatoryMobilitiesByStudent;
  }

  async findOne(_id: string): Promise<ObligatoryMobilityResponseDto> {
    const obligatoryMobility = await this.obligatoryMobilitiesModel
      .findOne({
        _id,
      })
      .populate('student');
    if (!obligatoryMobility)
      throw new ForbiddenException('obligatory mobility not found');
    const attachmentsObligatoryMobilities =
      await this.attachmentsObligatoryMobilitiesService.findAttachments(
        obligatoryMobility.initialDate,
        obligatoryMobility.finalDate,
        obligatoryMobility.student.specialty as unknown as string,
        obligatoryMobility.hospital as unknown as string,
      );
    console.log(attachmentsObligatoryMobilities);
    const solicitudeDocument: string[] = attachmentsObligatoryMobilities
      .filter(
        (attachmentsObligatoryMobility) =>
          attachmentsObligatoryMobility.solicitudeDocument,
      )
      .map(
        (attachmentsObligatoryMobility) => attachmentsObligatoryMobility._id,
      );
    const acceptanceDocument: string[] = attachmentsObligatoryMobilities
      .filter(
        (attachmentsObligatoryMobility) =>
          attachmentsObligatoryMobility.acceptanceDocument,
      )
      .map(
        (attachmentsObligatoryMobility) => attachmentsObligatoryMobility._id,
      );
    return {
      solicitudeDocument,
      acceptanceDocument,
      ...(obligatoryMobility.toJSON() as ObligatoryMobility),
    };
  }

  async update(
    _id: string,
    updateObligatoryMobility: UpdateObligatoryMobilityDto,
  ): Promise<ObligatoryMobility> {
    await this.findOne(_id);
    if (
      (
        await this.obligatoryMobilitiesModel.updateOne(
          { _id },
          updateObligatoryMobility,
        )
      ).modifiedCount == 0
    )
      throw new ForbiddenException('obligatory mobility not modified');
    return await this.findOne(_id);
  }

  async remove(_id: string, path: string): Promise<void> {
    const obligatoryMobility = await this.findOne(_id);
    if (obligatoryMobility.evaluationDocument)
      this.filesService.deleteFile(
        `${path}/${obligatoryMobility.evaluationDocument}`,
      );
    if (obligatoryMobility.presentationOfficeDocument)
      this.filesService.deleteFile(
        `${path}/${obligatoryMobility.presentationOfficeDocument}`,
      );
    await this.obligatoryMobilitiesModel.findOneAndDelete({ _id });
    if (await this.obligatoryMobilitiesModel.findOne({ _id }))
      throw new ForbiddenException('obligatory mobility not deleted');
  }

  async interval(): Promise<ObligatoryMobilityIntervalDto> {
    const min = await this.obligatoryMobilitiesModel
      .findOne()
      .sort('initialDate');
    const max = await this.obligatoryMobilitiesModel
      .findOne()
      .sort('-finalDate');
    if (min && max) {
      return {
        initialYear: min.initialDate.getFullYear(),
        finalYear: max.finalDate.getFullYear(),
      };
    }
    throw new ForbiddenException('obligatory mobility interval not found');
  }

  async cancel(_id: string): Promise<ObligatoryMobility> {
    await this.findOne(_id);
    if (
      (
        await this.obligatoryMobilitiesModel.updateOne(
          { _id },
          { canceled: true },
        )
      ).modifiedCount == 0
    )
      throw new ForbiddenException('obligatory mobility not modified');
    return await this.findOne(_id);
  }

  async uncancel(_id: string): Promise<ObligatoryMobility> {
    await this.findOne(_id);
    if (
      (
        await this.obligatoryMobilitiesModel.updateOne(
          { _id },
          { canceled: false },
        )
      ).modifiedCount == 0
    )
      throw new ForbiddenException('obligatory mobility not modified');
    return await this.findOne(_id);
  }

  async getDocument(
    _id: string,
    path: string,
    document: ObligatoryMobilityDocumentTypes,
  ): Promise<StreamableFile> {
    const obligatoryMobility = await this.findOne(_id);
    if (obligatoryMobility[document]) {
      const filePath = `${path}/${obligatoryMobility[document]}`;
      if (fs.existsSync(filePath)) {
        const file = fs.createReadStream(filePath);
        return new StreamableFile(file, {
          type: 'application/pdf',
        });
      }
    } else throw new ForbiddenException('document not found');
  }

  async updateDocument(
    _id: string,
    path: string,
    file: Express.Multer.File,
    document: ObligatoryMobilityDocumentTypes,
  ): Promise<ObligatoryMobility> {
    try {
      this.filesService.validatePDF(file);
      const obligatoryMobility = await this.findOne(_id);
      if (obligatoryMobility[document])
        this.filesService.deleteFile(`${path}/${obligatoryMobility[document]}`);
      let updateObject: object = {};
      updateObject[document] = file.filename;
      if (
        (
          await this.obligatoryMobilitiesModel.updateOne(
            { _id: obligatoryMobility._id },
            updateObject,
          )
        ).modifiedCount < 1
      )
        throw new ForbiddenException('obligatory mobility not modified');
      return await this.findOne(_id);
    } catch (err) {
      this.filesService.deleteFile(`${path}/${file.filename}`);
    }
  }

  async deleteDocument(
    _id: string,
    path: string,
    document: ObligatoryMobilityDocumentTypes,
  ): Promise<ObligatoryMobility> {
    const obligatoryMobility = await this.findOne(_id);
    if (obligatoryMobility[document])
      this.filesService.deleteFile(`${path}/${obligatoryMobility[document]}`);
    let updateObject: object = {};
    updateObject[document] = null;
    if (
      (
        await this.obligatoryMobilitiesModel.updateOne(
          { _id: obligatoryMobility._id },
          updateObject,
        )
      ).modifiedCount < 1
    )
      throw new ForbiddenException('obligatory mobility not modified');
    return await this.findOne(_id);
  }
}
