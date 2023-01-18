import { Injectable } from '@nestjs/common';
import { ForbiddenException } from '@nestjs/common/exceptions';
import { InjectModel } from '@nestjs/mongoose';
import { FilesService } from '@utils/services';
import { Model } from 'mongoose';
import { CreateObligatoryMobilityDto } from './dto/create-obligatory-mobility.dto';
import { ObligatoryMobilityByHospitalDto } from './dto/obligatory-mobility-by-hospital.dto';
import { ObligatoryMobilityByStudentDto } from './dto/obligatory-mobility-by-student.dto';
import { ObligatoryMobilityIntervalDto } from './dto/obligatory-mobility-interval.dto';
import { UpdateObligatoryMobilityDto } from './dto/update-obligatory-mobility.dto';
import {
  ObligatoryMobility,
  ObligatoryMobilityDocument,
} from './obligatory-mobility.schema';

@Injectable()
export class ObligatoryMobilitiesService {
  constructor(
    @InjectModel(ObligatoryMobility.name)
    private obligatoryMobilitiesModel: Model<ObligatoryMobilityDocument>,
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

  async findOne(_id: string): Promise<ObligatoryMobility> {
    const obligatoryMobility = await this.obligatoryMobilitiesModel.findOne({
      _id,
    });
    if (!obligatoryMobility)
      throw new ForbiddenException('obligatory mobility not found');
    return obligatoryMobility;
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
    const min = await this.obligatoryMobilitiesModel.findOne().sort('date');
    const max = await this.obligatoryMobilitiesModel.findOne().sort('-date');
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
}
