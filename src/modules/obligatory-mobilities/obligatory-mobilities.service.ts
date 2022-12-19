import { Injectable } from '@nestjs/common';
import { ForbiddenException } from '@nestjs/common/exceptions';
import { InjectModel } from '@nestjs/mongoose';
import { FilesService } from '@utils/services';
import { Model } from 'mongoose';
import { CreateObligatoryMobilityDto } from './dto/create-obligatory-mobility.dto';
import { ObligatoryMobilityBySpecialtyDto } from './dto/obligatory-mobility-by-specialty.dto';
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

  async findAll(
    initialDate: Date,
    finalDate: Date,
  ): Promise<ObligatoryMobilityBySpecialtyDto[]> {
    return await this.obligatoryMobilitiesModel.aggregate([
      {
        $match: {
          $and: [
            {
              initialDate: {
                $gte: initialDate,
              },
            },
            {
              finalDate: {
                $lte: finalDate,
              },
            },
          ],
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
          localField: 'student.specialty',
          foreignField: '_id',
          as: 'specialty',
        },
      },
      {
        $project: {
          _id: '$_id',
          specialty: { $arrayElemAt: ['$specialty', 0] },
          initialDate: '$initialDate',
          finalDate: '$finalDate',
          presentationOfficeDocument: '$presentationOfficeDocument',
          evaluationDocument: '$evaluationDocument',
          student: {
            $arrayElemAt: ['$student', 0],
          },
          hospital: {
            $arrayElemAt: ['$hospital', 0],
          },
          rotationService: {
            $arrayElemAt: ['$rotationService', 0],
          },
        },
      },
      {
        $group: {
          _id: '$specialty._id',
          value: { $first: '$specialty.value' },
          optionalMobilities: {
            $push: {
              _id: '$_id',
              initialDate: '$initialDate',
              finalDate: '$finalDate',
              presentationOfficeDocument: '$presentationOfficeDocument',
              evaluationDocument: '$evaluationDocument',
              student: {
                _id: '$student._id',
                name: '$student.name',
                firstLastName: '$student.firstLastName',
                secondLastName: '$student.secondLastName',
              },
              hospital: {
                _id: '$hospital._id',
                name: '$hospital.name',
              },
              rotationService: {
                _id: '$rotationService._id',
                value: '$rotationService.value',
              },
            },
          },
        },
      },
    ]);
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
    const min = await this.obligatoryMobilitiesModel.findOne().sort('initialDate');
    const max = await this.obligatoryMobilitiesModel.findOne().sort('finalDate');
    if(min && max) {
      return {
        initialYear: min.initialDate.getFullYear(),
        finalYear: max.finalDate.getFullYear(),
      }
    }
    throw new ForbiddenException('obligatory mobility interval not found')
  }
}
