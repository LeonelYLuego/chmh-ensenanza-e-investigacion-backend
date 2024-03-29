import { Hospital } from '@hospitals/hospital.schema';
import { HospitalsService } from '@hospitals/hospitals.service';
import { forwardRef } from '@nestjs/common';
import { ForbiddenException } from '@nestjs/common';
import { StreamableFile } from '@nestjs/common';
import { Inject } from '@nestjs/common';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { SpecialtiesService } from '@specialties/specialties.service';
import { TemplatesService } from '@templates/templates.service';
import { dateToString, getInterval, gradeToString } from '@utils/functions';
import { FilesService } from '@utils/services';
import { TemplateHandler } from 'easy-template-x';
import * as fs from 'fs';
import * as JSZip from 'jszip';
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
    @Inject(forwardRef(() => HospitalsService))
    private hospitalsService: HospitalsService,
    @Inject(forwardRef(() => SpecialtiesService))
    private specialtiesService: SpecialtiesService,
    private templatesService: TemplatesService,
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
    const optionalMobilitiesBySpecialties =
      (await this.optionalMobilitiesModel.aggregate([
        {
          //Find all Optional Mobility between the provided dates
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
            canceled: '$canceled',
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
                canceled: '$canceled',
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
      ])) as OptionalMobilityBySpecialtyDto[];
    optionalMobilitiesBySpecialties.map((optionalMobilitiesBySpecialty) => {
      optionalMobilitiesBySpecialty.optionalMobilities.sort((a, b) =>
        a.student.secondLastName.localeCompare(b.student.secondLastName),
      );
      optionalMobilitiesBySpecialty.optionalMobilities.sort((a, b) =>
        a.student.firstLastName.localeCompare(b.student.firstLastName),
      );
    });
    optionalMobilitiesBySpecialties.sort((a, b) =>
      a.value.localeCompare(b.value),
    );
    return optionalMobilitiesBySpecialties;
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
   * Cancels a Optional Mobility in the database based on the provided _id
   * @param _id
   * @returns the canceled Optional Mobility
   * @throws {ForbiddenException} Optional Mobility must be modified
   */
  async cancel(_id: string): Promise<OptionalMobility> {
    await this.findOne(_id);
    if (
      (
        await this.optionalMobilitiesModel.updateOne(
          { _id },
          { canceled: true },
        )
      ).modifiedCount == 0
    )
      throw new ForbiddenException('optional mobility not modified');
    return await this.findOne(_id);
  }

  /**
   * Uncancels a Optional Mobility in the databases based on the provided _id
   * @param _id
   * @returns the uncanceled Optional Mobility
   * @throws {ForbiddenException} Optional Mobility must be modified
   */
  async uncancel(_id: string): Promise<OptionalMobility> {
    await this.findOne(_id);
    if (
      (
        await this.optionalMobilitiesModel.updateOne(
          { _id },
          { canceled: false },
        )
      ).modifiedCount == 0
    )
      throw new ForbiddenException('optional mobility not modified');
    return await this.findOne(_id);
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
   * Deletes an Optional Mobility by Id in the database
   * @param _id
   * @param path
   * @throws {ForbiddenException} Optional Mobility must be deleted
   * @throws {ForbiddenException} Optional Mobility must exist
   */
  async delete(_id: string, path: string): Promise<void> {
    const optionalMobility =
      await this.optionalMobilitiesModel.findOneAndDelete({ _id });
    // Deletes the documents that are associated with the Optional Mobility
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
   * Deletes Optional Mobilities in the database based on the provided Rotation Service
   * @param rotationService
   */
  async deleteByRotationService(rotationService: string): Promise<void> {
    await this.optionalMobilitiesModel.deleteMany({
      rotationService,
    });
  }

  /**
   * Deletes Optional Mobilities in the database based on the provided Student
   * @param student
   */
  async deleteByStudent(student: string): Promise<void> {
    await this.optionalMobilitiesModel.deleteMany({
      student,
    });
  }

  /**
   * Deletes Optional Mobilities in the database based on the provided Hospital
   * @param hospital
   */
  async deleteByHospital(hospital: string): Promise<void> {
    await this.optionalMobilitiesModel.deleteMany({
      hospital,
    });
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
    // Checks if the document exist in the Optional Mobility
    if (optionalMobility[document]) {
      // Gets the path of the document
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
      // If a file exits, it deletes it
      if (optionalMobility[document])
        this.filesService.deleteFile(`${path}/${optionalMobility[document]}`);
      let updateObject: object = {};
      // Adds the document name to the Optional Mobility
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

  /**
   * Generate presentation office or solicitude documents of the specified Optional Mobilities
   * @param document
   * @param initialNumberOfDocuments
   * @param dateOfDocuments
   * @param initialDate
   * @param finalDate
   * @param hospital
   * @param specialty
   * @returns a zip file with the documents
   * @throws template must exist
   */
  async generateDocuments(
    document: 'presentationOfficeDocument' | 'solicitudeDocument',
    initialNumberOfDocuments: number,
    dateOfDocuments: Date,
    initialDate: Date,
    finalDate: Date,
    hospital?: string,
    specialty?: string,
  ): Promise<StreamableFile> {
    // Checks if the initial date and final date are valid
    if (initialDate.getTime() > finalDate.getTime())
      throw new ForbiddenException('invalid interval');
    let counter = initialNumberOfDocuments;
    const date = new Date(dateOfDocuments);
    const zip = new JSZip();
    let hospitals: Hospital[] = [];
    // Gets the hospitals to find the Optional Mobilities
    if (hospital) hospitals.push(await this.hospitalsService.findOne(hospital));
    else hospitals = await this.hospitalsService.findAll();
    await Promise.all(
      // For each hospital
      hospitals.map(async (hospital) => {
        const optionalMobilities =
          (await this.optionalMobilitiesModel.aggregate([
            {
              // Finds the Optional Mobilities between the initial and final date
              // and with the hospital that are not canceled
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
                hospital: hospital._id,
                canceled: false,
              },
            },
            // Populates the students
            {
              $lookup: {
                from: 'students',
                localField: 'student',
                foreignField: '_id',
                as: 'student',
              },
            },
            // Populates the specialties
            {
              $lookup: {
                from: 'specialties',
                localField: 'student.specialty',
                foreignField: '_id',
                as: 'specialty',
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
            // Deletes the array objects
            {
              $project: {
                _id: '$_id',
                student: { $arrayElemAt: ['$student', 0] },
                specialty: { $arrayElemAt: ['$specialty', 0] },
                initialDate: '$initialDate',
                finalDate: '$finalDate',
                rotationService: { $arrayElemAt: ['$rotationService', 0] },
              },
            },
            // Deletes the specialty attribute
            {
              $addFields: {
                student: {
                  specialty: '$specialty',
                },
              },
            },
            {
              $unset: ['specialty'],
            },
          ])) as OptionalMobility[];
        for (let optionalMobility of optionalMobilities) {
          if (specialty)
            if (optionalMobility.student.specialty._id != specialty) return;
          // Data to replace in the document in the place of the tags
          const data = {
            hospital: hospital.name.toUpperCase(),
            'principal.nombre': hospital.firstReceiver
              ? hospital.firstReceiver.name.toUpperCase()
              : '',
            'principal.cargo': hospital.firstReceiver
              ? hospital.firstReceiver.position.toUpperCase()
              : '',
            'secundario.nombre': hospital.secondReceiver
              ? `${hospital.secondReceiver.name.toUpperCase()}`
              : '',
            'secundario.cargo': hospital.secondReceiver
              ? hospital.secondReceiver.position.toUpperCase()
              : '',
            'terciario.nombre': hospital.thirdReceiver
              ? `${hospital.thirdReceiver.name.toUpperCase()}`
              : '',
            'terciario.cargo': hospital.thirdReceiver
              ? hospital.thirdReceiver.position.toUpperCase()
              : '',
            numero: counter.toString(),
            fecha: dateToString(date),
            alumno: `${optionalMobility.student.name} ${
              optionalMobility.student.firstLastName
            }${
              optionalMobility.student.secondLastName
                ? ' ' + optionalMobility.student.secondLastName
                : ''
            }`.toUpperCase(),
            especialidad: optionalMobility.student.specialty.value,
            servicioARotar: optionalMobility.rotationService.value,
            año: gradeToString(
              this.specialtiesService.getGrade(
                optionalMobility.student.specialty,
                optionalMobility.student.lastYearGeneration,
              ) - 1,
            ),
            periodo: getInterval(
              optionalMobility.initialDate,
              optionalMobility.finalDate,
            ),
            departamento:
              optionalMobility.student.specialty.headOfDepartmentPosition,
            jefeDeDepartamento:
              optionalMobility.student.specialty.headOfDepartment.toUpperCase(),
            profesor:
              optionalMobility.student.specialty.tenuredPostgraduateProfessor.toUpperCase(),
            jefeDeServicio:
              optionalMobility.student.specialty.headOfService.toUpperCase(),
          };
          // Gets the template
          const template = await this.templatesService.getDocument(
            'optionalMobility',
            document,
          );
          const handler = new TemplateHandler();
          // Replaces the tags with the data and gets the final document
          const doc = await handler.process(template, data);
          //Adds the document to the zip file with the name of the student
          zip.file(
            `${counter} ${optionalMobility.student.specialty.value} ${
              optionalMobility.student.name
            } ${optionalMobility.student.firstLastName} ${
              optionalMobility.student.secondLastName ?? ''
            }.docx`,
            doc,
          );
          // Increments the number of the document
          counter++;
        }
      }),
    );
    const content = await zip.generateAsync({ type: 'nodebuffer' });
    // Returns the zip file with the name of the documents to generate
    return new StreamableFile(content, {
      type: 'application/zip',
      disposition: `attachment;filename=${
        document == 'presentationOfficeDocument'
          ? 'Oficios de Presentación'
          : 'Solicitudes'
      }.zip`,
    });
  }
}
