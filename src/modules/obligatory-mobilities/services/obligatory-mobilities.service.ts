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
import { AttachmentsObligatoryMobilitiesService } from './attachments-obligatory-mobility.service';

/** Obligatory Mobility service */
@Injectable()
export class ObligatoryMobilitiesService {
  constructor(
    @InjectModel(ObligatoryMobility.name)
    private obligatoryMobilitiesModel: Model<ObligatoryMobilityDocument>,
    private attachmentsObligatoryMobilitiesService: AttachmentsObligatoryMobilitiesService,
    private filesService: FilesService,
  ) {}

  /**
   * Creates and adds a new Obligatory Mobility in the database
   * @param createObligatoryMobilityDto
   * @returns the created Obligatory Mobility
   */
  async create(
    createObligatoryMobilityDto: CreateObligatoryMobilityDto,
  ): Promise<ObligatoryMobility> {
    const obligatoryMobility = new this.obligatoryMobilitiesModel(
      createObligatoryMobilityDto,
    );
    return await obligatoryMobility.save();
  }

  /**
   * Finds all Obligatory Mobilities in the database bases on
   * the provided specialty, hospital, initial date and final date
   * @param specialty
   * @param hospital
   * @param initialDate
   * @param finalDate
   * @returns the found Obligatory Mobilities
   */
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

  /**
   * Finds all Obligatory Mobilities grouped by Hospital
   * based on the provided specialty, initial date and final date
   * @param specialty
   * @param initialDate
   * @param finalDate
   * @returns the found Obligatory Mobilities grouped by Hospital
   */
  async findAllByHospital(
    specialty: string,
    initialDate: Date,
    finalDate: Date,
  ): Promise<ObligatoryMobilityByHospitalDto[]> {
    let obligatoryMobilitiesByHospital =
      (await this.obligatoryMobilitiesModel.aggregate([
        {
          // Finds the Obligatory Mobilities between
          // the initial date and final date
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
        // Populates Rotation Services
        {
          $lookup: {
            from: 'rotationservices',
            localField: 'rotationService',
            foreignField: '_id',
            as: 'rotationService',
          },
        },
        // Populates Students
        {
          $lookup: {
            from: 'students',
            localField: 'student',
            foreignField: '_id',
            as: 'student',
          },
        },
        // Populates Hospitals
        {
          $lookup: {
            from: 'hospitals',
            localField: 'hospital',
            foreignField: '_id',
            as: 'hospital',
          },
        },
        // Deletes arrays
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
        // Groups by Hospital
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
    // For each hospital
    for (let i = 0; i < obligatoryMobilitiesByHospital.length; i++) {
      // Filters the obligatory mobilities of the specified Specialty
      obligatoryMobilitiesByHospital[i].obligatoryMobilities =
        obligatoryMobilitiesByHospital[i].obligatoryMobilities.filter(
          (obligatoryMobility) =>
            (obligatoryMobility.rotationService.specialty as unknown) ==
            specialty,
        );
      // Sorts by final date
      obligatoryMobilitiesByHospital[i].obligatoryMobilities.sort(
        (a, b) => a.finalDate.getTime() - b.finalDate.getTime(),
      );
      // Sorts by initial date
      obligatoryMobilitiesByHospital[i].obligatoryMobilities.sort(
        (a, b) => a.initialDate.getTime() - b.initialDate.getTime(),
      );
      // Gets the Attachments Obligatory Mobilities associated
      // with the Hospital and Obligatory Mobilities
      const attachmentsObligatoryMobilities =
        await this.attachmentsObligatoryMobilitiesService.findAttachments(
          initialDate,
          finalDate,
          specialty,
          obligatoryMobilitiesByHospital[i]._id,
        );
      // Sets the documents as a empty array
      obligatoryMobilitiesByHospital[i].obligatoryMobilities.map(
        (obligatoryMobility) => {
          obligatoryMobility.solicitudeDocument = [];
          obligatoryMobility.acceptanceDocument = [];
        },
      );
      // For each Attachments Obligatory Mobility
      attachmentsObligatoryMobilities.map((attachmentsObligatoryMobility) => {
        const aInitialDate =
            attachmentsObligatoryMobility.initialDate.getTime(),
          aFinalDate = attachmentsObligatoryMobility.finalDate.getTime();
        // For each Obligatory Mobility
        obligatoryMobilitiesByHospital[i].obligatoryMobilities.map(
          (obligatoryMobility) => {
            const oInitialDate = obligatoryMobility.initialDate.getTime(),
              oFinalDate = obligatoryMobility.finalDate.getTime();
            // Checks if the interval of the Obligatory Mobility is
            // inside of the interval of the Attachments Obligatory Mobility
            if (
              (oInitialDate >= aInitialDate && oInitialDate <= aFinalDate) ||
              (oFinalDate >= aInitialDate && oFinalDate <= aFinalDate)
            ) {
              // If exist a document in the Attachments Obligatory Mobility
              if (attachmentsObligatoryMobility.solicitudeDocument)
                // Inserts in the array of the document the _id of the
                // Attachments Obligatory Mobility
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
    // Deletes the Hospitals that do not have any Obligatory Mobilities
    for (let i = 0; i < obligatoryMobilitiesByHospital.length; i++)
      if (obligatoryMobilitiesByHospital[i].obligatoryMobilities.length == 0)
        obligatoryMobilitiesByHospital.splice(i, 1);
    // Sort by Hospital name
    obligatoryMobilitiesByHospital.sort((a, b) => a.name.localeCompare(b.name));
    return obligatoryMobilitiesByHospital;
  }

  /**
   * Finds all Obligatory Mobilities grouped by Student
   * based on the provided specialty, initial date and final date
   * @param specialty
   * @param initialDate
   * @param finalDate
   * @returns the found Obligatory Mobilities grouped by Student
   */
  async findAllByStudent(
    specialty: string,
    initialDate: Date,
    finalDate: Date,
  ): Promise<ObligatoryMobilityByStudentDto[]> {
    let obligatoryMobilitiesByStudent =
      (await this.obligatoryMobilitiesModel.aggregate([
        {
          // Finds all Obligatory Mobilities between
          // the initial date and final date
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
        // Populates the Rotation Services
        {
          $lookup: {
            from: 'rotationservices',
            localField: 'rotationService',
            foreignField: '_id',
            as: 'rotationService',
          },
        },
        // Populates the Students
        {
          $lookup: {
            from: 'students',
            localField: 'student',
            foreignField: '_id',
            as: 'student',
          },
        },
        // Populates the Hospitals
        {
          $lookup: {
            from: 'hospitals',
            localField: 'hospital',
            foreignField: '_id',
            as: 'hospital',
          },
        },
        // Deletes the arrays
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
        // Groups by Student
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

    // For each Student
    for (let i = 0; i < obligatoryMobilitiesByStudent.length; i++) {
      // Filters the Students that have the specified Specialty
      obligatoryMobilitiesByStudent[i].obligatoryMobilities =
        obligatoryMobilitiesByStudent[i].obligatoryMobilities.filter(
          (obligatoryMobility) =>
            (obligatoryMobility.rotationService.specialty as unknown) ==
            specialty,
        );
      // Sorts the Obligatory Mobilities by final date
      obligatoryMobilitiesByStudent[i].obligatoryMobilities.sort(
        (a, b) => a.finalDate.getTime() - b.finalDate.getTime(),
      );
      // Sorts the Obligatory Mobilities by initial date
      obligatoryMobilitiesByStudent[i].obligatoryMobilities.sort(
        (a, b) => a.initialDate.getTime() - b.initialDate.getTime(),
      );
    }
    // Deletes the Students that do not have any Obligatory Mobility
    for (let i = 0; i < obligatoryMobilitiesByStudent.length; i++)
      if (obligatoryMobilitiesByStudent[i].obligatoryMobilities.length == 0)
        obligatoryMobilitiesByStudent.splice(i, 1);
    // Sorts by second last name
    obligatoryMobilitiesByStudent.sort((a, b) =>
      a.secondLastName.localeCompare(b.secondLastName),
    );
    // Sorts by first last name
    obligatoryMobilitiesByStudent.sort((a, b) =>
      a.firstLastName.localeCompare(b.firstLastName),
    );
    await Promise.all(
      // For each Student
      obligatoryMobilitiesByStudent.map(async (obligatoryMobilityByStudent) => {
        await Promise.all(
          // For each Obligatory Mobility
          obligatoryMobilityByStudent.obligatoryMobilities.map(
            async (obligatoryMobility) => {
              // Sets the documents as a empty array
              obligatoryMobility.solicitudeDocument = [];
              obligatoryMobility.acceptanceDocument = [];
              // Finds all Attachments Obligatory Mobilities based on the
              // Obligatory Mobility and Student
              const attachmentsObligatoryMobilities =
                await this.attachmentsObligatoryMobilitiesService.findAttachments(
                  obligatoryMobility.initialDate,
                  obligatoryMobility.finalDate,
                  obligatoryMobility.rotationService
                    .specialty as unknown as string,
                  obligatoryMobility.hospital._id,
                );
              // For each Attachments Obligatory Mobility
              attachmentsObligatoryMobilities.map(
                (attachmentsObligatoryMobility) => {
                  if (attachmentsObligatoryMobility.solicitudeDocument)
                    obligatoryMobility.solicitudeDocument.push(
                      attachmentsObligatoryMobility._id,
                    );
                  if (attachmentsObligatoryMobility.acceptanceDocument)
                    obligatoryMobility.acceptanceDocument.push(
                      attachmentsObligatoryMobility._id,
                    );
                },
              );
            },
          ),
        );
      }),
    );
    return obligatoryMobilitiesByStudent;
  }

  /**
   * Finds a Obligatory Mobility in the database
   * @param _id
   * @returns the found Obligatory Mobility
   * @throws {ForbiddenException} Obligatory Mobility must exist
   */
  async findOne(_id: string): Promise<ObligatoryMobilityResponseDto> {
    const obligatoryMobility = await this.obligatoryMobilitiesModel
      .findOne({
        _id,
      })
      .populate('student');
    if (!obligatoryMobility)
      throw new ForbiddenException('obligatory mobility not found');
    // Gets the Attachments Obligatory Mobility based on the Obligatory Mobility
    const attachmentsObligatoryMobilities =
      await this.attachmentsObligatoryMobilitiesService.findAttachments(
        obligatoryMobility.initialDate,
        obligatoryMobility.finalDate,
        obligatoryMobility.student.specialty as unknown as string,
        obligatoryMobility.hospital as unknown as string,
      );
    // Inserts the _id of the Attachments Obligatory Mobilities
    // if its has the document
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

  /**
   * Updates a Obligatory Mobility in the database bases on the provided _id
   * @param _id
   * @param updateObligatoryMobility
   * @returns the updated Obligatory Mobility
   * @throws {ForbiddenException} Obligatory Mobility must exist
   * @throws {ForbiddenException} Obligatory Mobility must be modified
   */
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

  /**
   * Removes a Obligatory Mobility in the database based on the provided _id
   * @param _id
   * @param path
   * @throws {ForbiddenException} Obligatory Mobility must exist
   * @throws {ForbiddenException} Obligatory Mobility must be deleted
   */
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

  /**
   * Deletes Obligatory Mobilities in the database based on the provided Rotation Service
   * @param rotationService
   */
  async deleteByRotationService(rotationService: string): Promise<void> {
    await this.obligatoryMobilitiesModel.deleteMany({
      rotationService,
    });
  }

  /**
   * Deletes Obligatory Mobilities in the database based on the provided Student
   * @param student
   */
  async deleteByStudent(student: string): Promise<void> {
    await this.obligatoryMobilitiesModel.deleteMany({
      student,
    });
  }

  /**
   * Deletes Obligatory Mobilities in the database based on the provided Hospital
   * @param hospital
   */
  async deleteByHospital(hospital: string): Promise<void> {
    await this.obligatoryMobilitiesModel.deleteMany({
      hospital,
    });
  }

  /**
   * Gets the interval to find the Obligatory Mobilities
   * @returns the interval
   * @throws {ForbiddenException} in the database must exist at least
   * one Obligatory Mobility
   */
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

  /**
   * Cancels a Obligatory Mobility in the database bases on the provided _id
   * @param _id
   * @returns the modified Obligatory Mobility
   * @throws {ForbiddenException} Obligatory Mobility must exist
   * @throws {ForbiddenException} Obligatory Mobility must be modified
   */
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

  /**
   * Uncancels a Obligatory Mobility in the database bases on the provided _id
   * @param _id
   * @returns the modified Obligatory Mobility
   * @throws {ForbiddenException} Obligatory Mobility must exist
   * @throws {ForbiddenException} Obligatory Mobility must be modified
   */
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

  /**
   * Gets the specified document of the Obligatory Mobility of the database
   * @param _id
   * @param path
   * @param document
   * @returns the document
   * @throws {ForbiddenException} Obligatory Mobility must exist
   */
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

  /**
   * Updates the specify document of the Obligatory Mobility in the database
   * @param _id
   * @param path
   * @param file
   * @param document
   * @returns the modified Obligatory Mobility
   * @throws Obligatory Mobility must exist
   * @throws Obligatory Mobility must be modified
   */
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

  /**
   * Deletes the specify document of the Obligatory Mobility in the database
   * @param _id
   * @param path
   * @param document
   * @returns the modified Obligatory Mobility
   * @throws Obligatory Mobility must exist
   * @throws Obligatory Mobility must be modified
   */
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
