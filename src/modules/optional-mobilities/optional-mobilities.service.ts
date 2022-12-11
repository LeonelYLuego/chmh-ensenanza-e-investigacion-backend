import { ForbiddenException, Injectable, StreamableFile } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { FilesService } from '@utils/services';
import * as fs from 'fs';
import { Model } from 'mongoose';
import { CreateOptionalMobilityDto } from './dto/create-optional-mobility.dto';
import { OptionalMobilityBySpecialtyDto } from './dto/optional-mobility-by-specialty';
import { UpdateOptionalMobilityDto } from './dto/update-optional-mobility.dto';
import { OptionalMobilityIntervalInterface } from './interfaces/optional-mobility-interval.interface';
import {
  OptionalMobility,
  OptionalMobilityDocument,
} from './optional-mobility.schema';
import { OptionalMobilityDocumentTypes } from './types/optional-mobility-document.type';

/** Optional Mobility service */
@Injectable()
export class OptionalMobilitiesService {
  constructor(
    @InjectModel(OptionalMobility.name)
    private optionalMobilitiesModel: Model<OptionalMobilityDocument>,
    private filesService: FilesService,
  ) {}

  /**
   * Creates a new Optional Mobility and saves it in the database
   * @param createOptionalMobilityDto Optional Mobility to create
   * @returns {OptionalMobility} the created Optional Mobility
   */
  async create(
    createOptionalMobilityDto: CreateOptionalMobilityDto,
  ): Promise<OptionalMobility> {
    const optionalMobility = new this.optionalMobilitiesModel(
      createOptionalMobilityDto,
    );
    return await optionalMobility.save();
  }

  /**
   * Finds all Optional Mobilities in the database
   * @param initialDate initial date to find
   * @param finalDate final date to find
   * @returns {OptionalMobilityBySpecialtyDto} the found Optional Mobilities grouped by Specialty
   */
  async findAll(
    initialDate: Date,
    finalDate: Date,
  ): Promise<OptionalMobilityBySpecialtyDto[]> {
    return await this.optionalMobilitiesModel.aggregate([
      {
        //Find all Optional Mobility between the provided dates
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
        //Does an inner join with students
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
        //Gets the first element of the specialties, students, hospitals and rotation services
        $project: {
          _id: '$_id',
          specialty: { $arrayElemAt: ['$specialty', 0] },
          initialDate: '$initialDate',
          finalDate: '$finalDate',
          solicitudeDocument: '$solicitudeDocument',
          presentationOfficeDocument: '$presentationOfficeDocument',
          acceptanceDocument: '$acceptanceDocument',
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
        //Groups Optional Mobilities by Specialty
        $group: {
          _id: '$specialty._id',
          value: { $first: '$specialty.value' },
          optionalMobilities: {
            $push: {
              _id: '$_id',
              initialDate: '$initialDate',
              finalDate: '$finalDate',
              solicitudeDocument: '$solicitudeDocument',
              presentationOfficeDocument: '$presentationOfficeDocument',
              acceptanceDocument: '$acceptanceDocument',
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

  /**
   * Finds an Optional Mobility by Id in the database
   * @param _id
   * @returns {OptionalMobility} the found Optional Mobility
   * @throws {ForbiddenException} the Optional Mobility must exist
   */
  async findOne(_id: string): Promise<OptionalMobility> {
    const optionalMobility = await this.optionalMobilitiesModel.findOne({
      _id,
    });
    if (!optionalMobility)
      throw new ForbiddenException('optional mobility not found');
    return optionalMobility;
  }

  /**
   * Updates an Optional Mobility by Id in the database
   * @param _id
   * @param updateOptionalMobilityDto
   * @returns {OptionalMobility} the updated Optional Mobility
   * @throws {ForbiddenException} Optional Mobility must be modified
   * @throws {ForbiddenException} Optional Mobility must exist
   */
  async update(
    _id: string,
    updateOptionalMobilityDto: UpdateOptionalMobilityDto,
  ): Promise<OptionalMobility> {
    await this.findOne(_id);
    if (
      (
        await this.optionalMobilitiesModel.updateOne(
          { _id },
          updateOptionalMobilityDto,
        )
      ).modifiedCount == 0
    )
      throw new ForbiddenException('optional mobility not modified');
    return await this.findOne(_id);
  }

  /**
   * Removes an Optional Mobility by Id in the database
   * @param _id
   * @param path
   * @throws {ForbiddenException} Optional Mobility must be deleted
   * @throws {ForbiddenException} Optional Mobility must exist
   */
  async remove(_id: string, path: string): Promise<void> {
    const optionalMobility =
      await this.optionalMobilitiesModel.findOneAndDelete({ _id });
    if (optionalMobility.acceptanceDocument)
      this.filesService.deleteFile(
        `${path}/${optionalMobility.acceptanceDocument}`,
      );
    if (optionalMobility.evaluationDocument)
      this.filesService.deleteFile(
        `${path}/${optionalMobility.evaluationDocument}`,
      );
    if (optionalMobility.solicitudeDocument)
      this.filesService.deleteFile(
        `${path}/${optionalMobility.solicitudeDocument}`,
      );
    if (optionalMobility.presentationOfficeDocument)
      this.filesService.deleteFile(
        `${path}/${optionalMobility.presentationOfficeDocument}`,
      );
    if (await this.optionalMobilitiesModel.findOne({ _id }))
      throw new ForbiddenException('optional mobility not deleted');
  }

  /**
   * Gets the initial and final date of all Optional Mobilities
   * @returns {OptionalMobilityIntervalInterface} The initial and final date of all Optional Mobilities
   * @throws {ForbiddenException} must exist at least one Optional Mobility
   */
  async interval(): Promise<OptionalMobilityIntervalInterface> {
    const min = await this.optionalMobilitiesModel
      .findOne()
      .sort('initialDate');
    const max = await this.optionalMobilitiesModel.findOne().sort('-finalDate');
    if (min && max) {
      return {
        initialYear: min.initialDate.getFullYear(),
        finalYear: max.finalDate.getFullYear(),
      };
    }
    throw new ForbiddenException('optional mobility interval not found');
  }

  /**
   * Gets the specified document of the Optional Mobility by Id
   * @param _id
   * @param path
   * @param document
   * @returns the found document
   * @throws {ForbiddenException} Optional Mobility must exist
   * @throws {ForbiddenException} document must exist
   */
  async getDocument(
    _id: string,
    path: string,
    document: OptionalMobilityDocumentTypes,
  ): Promise<StreamableFile> {
    const optionalMobility = await this.findOne(_id);
    if (optionalMobility[document]) {
      const filePath = `${path}/${optionalMobility[document]}`;
      if (fs.existsSync(filePath)) {
        const file = fs.createReadStream(filePath);
        return new StreamableFile(file, {
          type: 'application/pdf',
        });
      }
    }
    throw new ForbiddenException('document not found');
  }

  /**
   * Updates the specified document of the Optional Mobility by Id
   * @param _id
   * @param path
   * @param file
   * @param document
   * @returns {ForbiddenException} Optional Mobility must exist
   * @returns {ForbiddenException} Optional Mobility must be modified
   */
  async updateDocument(
    _id: string,
    path: string,
    file: Express.Multer.File,
    document: OptionalMobilityDocumentTypes,
  ): Promise<OptionalMobility> {
    try {
      this.filesService.validatePDF(file);
      const optionalMobility = await this.findOne(_id);
      if (optionalMobility[document])
        this.filesService.deleteFile(`${path}/${optionalMobility[document]}`);
      let updateObject: object = {};
      updateObject[document] = file.filename;
      if (
        (
          await this.optionalMobilitiesModel.updateOne(
            { _id: optionalMobility._id },
            updateObject,
          )
        ).modifiedCount < 1
      )
        throw new ForbiddenException('optional mobility not updated');
      return await this.findOne(_id);
    } catch (err) {
      this.filesService.deleteFile(`${path}/${file.filename}`);
    }
  }

  /**
   * Deletes the specified document of the Optional Mobility by Id
   * @param _id
   * @param path
   * @param document
   * @returns
   * @throws {ForbiddenException} Optional Mobility must exist
   * @throws {ForbiddenException} Optional Mobility must be modified
   */
  async deleteDocument(
    _id: string,
    path: string,
    document: OptionalMobilityDocumentTypes,
  ): Promise<OptionalMobility> {
    const optionalMobility = await this.findOne(_id);
    if (optionalMobility[document])
      this.filesService.deleteFile(`${path}/${optionalMobility[document]}`);
    let updateObject: object = {};
    updateObject[document] = null;
    if (
      (
        await this.optionalMobilitiesModel.updateOne(
          { _id: optionalMobility._id },
          updateObject,
        )
      ).modifiedCount < 1
    )
      throw new ForbiddenException('optional mobility not updated');
    return await this.findOne(_id);
  }
}
