import { HospitalsService } from '@hospitals/hospitals.service';
import { ForbiddenException, StreamableFile } from '@nestjs/common';
import { Inject, Injectable } from '@nestjs/common/decorators';
import { InjectModel } from '@nestjs/mongoose';
import { SpecialtiesService } from '@specialties/specialties.service';
import { TemplatesService } from '@templates/templates.service';
import { FilesService } from '@utils/services';
import { Model } from 'mongoose';
import * as fs from 'fs';
import {
  AttachmentsObligatoryMobility,
  AttachmentsObligatoryMobilityDocument,
} from '../schemas/attachments-obligatory-mobility.schema';
import { AttachmentsObligatoryMobilityByHospitalDto } from '../dto/attachments-obligatory-mobility-by-hospital.dto';
import { AttachmentsObligatoryMobilityResponseDto } from '../dto/attachments-obligatory-mobility-response.dto';
import { CreateAttachmentsObligatoryMobilityDto } from '../dto/create-attachments-obligatory-mobility.dto';
import { UpdateAttachmentsObligatoryMobilityDto } from '../dto/update-attachments-obligatory-mobility.dto';
import {
  ObligatoryMobility,
  ObligatoryMobilityDocument,
} from '../schemas/obligatory-mobility.schema';
import { AttachmentsObligatoryMobilityDocumentTypes } from '../types/attachments-obligatory-mobility-document.type';
import { dateToString, getInterval } from '@utils/functions/date.function';
import { TemplateHandler } from 'easy-template-x';
import { forwardRef } from '@nestjs/common/utils';

/** Attachments Obligatory Mobilities service */
@Injectable()
export class AttachmentsObligatoryMobilitiesService {
  constructor(
    @InjectModel(AttachmentsObligatoryMobility.name)
    private attachmentsObligatoryMobilitiesModel: Model<AttachmentsObligatoryMobilityDocument>,
    @InjectModel(ObligatoryMobility.name)
    private obligatoryMobilitiesModel: Model<ObligatoryMobilityDocument>,
    @Inject(forwardRef(() => HospitalsService))
    private hospitalsService: HospitalsService,
    @Inject(forwardRef(() => SpecialtiesService))
    private specialtiesService: SpecialtiesService,
    private templatesService: TemplatesService,
    private filesService: FilesService,
  ) {}

  /**
   * Creates a Attachments Obligatory Mobility and saves in the database
   * @param createAttachmentsObligatoryMobilityDto
   * @returns the created Attachments Obligatory Mobility
   */
  async create(
    createAttachmentsObligatoryMobilityDto: CreateAttachmentsObligatoryMobilityDto,
  ): Promise<AttachmentsObligatoryMobility> {
    const createdAttachmentsObligatoryMobility =
      new this.attachmentsObligatoryMobilitiesModel(
        createAttachmentsObligatoryMobilityDto,
      );
    return await createdAttachmentsObligatoryMobility.save();
  }

  /**
   * Finds all Attachments Obligatory Mobilities by Hospital in the database based
   * between the provided initial and final date, and specialty
   * @param initialDate
   * @param finalDate
   * @param specialty
   * @returns the found Attachments Obligatory Mobilities group by Hospital
   */
  async findAll(
    initialDate: Date,
    finalDate: Date,
    specialty: string,
  ): Promise<AttachmentsObligatoryMobilityByHospitalDto[]> {
    var ObjectId = require('mongoose').Types.ObjectId;
    const attachmentsObligatoryMobilitiesByHospital =
      (await this.attachmentsObligatoryMobilitiesModel.aggregate([
        {
          // Finds between initial and final date, and Specialty
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
            specialty: new ObjectId(specialty),
          },
        },
        // Populates hospitals
        {
          $lookup: {
            from: 'hospitals',
            localField: 'hospital',
            foreignField: '_id',
            as: 'hospital',
          },
        },
        // Deletes array
        {
          $project: {
            _id: '$_id',
            initialDate: '$initialDate',
            finalDate: '$finalDate',
            hospital: { $arrayElemAt: ['$hospital', 0] },
            specialty: '$specialty',
            solicitudeDocument: '$solicitudeDocument',
            acceptanceDocument: '$acceptanceDocument',
          },
        },
        // Groups by hospital
        {
          $group: {
            _id: '$hospital._id',
            name: { $first: '$hospital.name' },
            attachmentsObligatoryMobilities: {
              $push: {
                _id: '$_id',
                initialDate: '$initialDate',
                finalDate: '$finalDate',
                specialty: '$specialty',
                solicitudeDocument: '$solicitudeDocument',
                acceptanceDocument: '$acceptanceDocument',
              },
            },
          },
        },
      ])) as AttachmentsObligatoryMobilityByHospitalDto[];
    // Sorts by final date
    attachmentsObligatoryMobilitiesByHospital.map(
      (attachmentsObligatoryMobilityByHospital) =>
        attachmentsObligatoryMobilityByHospital.attachmentsObligatoryMobilities.sort(
          (a, b) => a.finalDate.getTime() - b.finalDate.getTime(),
        ),
    );
    // Sorts by initial date
    attachmentsObligatoryMobilitiesByHospital.map(
      (attachmentsObligatoryMobilityByHospital) =>
        attachmentsObligatoryMobilityByHospital.attachmentsObligatoryMobilities.sort(
          (a, b) => a.initialDate.getTime() - b.initialDate.getTime(),
        ),
    );
    // Sorts by hospital
    attachmentsObligatoryMobilitiesByHospital.sort((a, b) =>
      a.name.localeCompare(b.name),
    );
    return attachmentsObligatoryMobilitiesByHospital;
  }

  /**
   * Finds a Attachments Obligatory Mobility in the database
   * without add more data or group
   * @param _id
   * @returns the found Attachments Obligatory Mobility
   * @throws {ForbiddenException} Attachments Obligatory Mobility must exist
   */
  async findRaw(_id: string): Promise<AttachmentsObligatoryMobility> {
    const attachmentsObligatoryMobility =
      await this.attachmentsObligatoryMobilitiesModel.findOne({ _id });
    if (!attachmentsObligatoryMobility)
      throw new ForbiddenException('attachments obligatory mobility not found');
    return attachmentsObligatoryMobility;
  }

  /**
   * Finds a Attachments Obligatory Mobility in the database
   * and adds Obligatory Mobilities
   * @param _id
   * @returns the found Attachments Obligatory Mobility
   * @throws {ForbiddenException} Attachments Obligatory Mobility must exist
   */
  async findOne(
    _id: string,
  ): Promise<AttachmentsObligatoryMobilityResponseDto> {
    const attachmentsObligatoryMobility =
      await this.attachmentsObligatoryMobilitiesModel.findOne({ _id });
    if (attachmentsObligatoryMobility) {
      // Finds Obligatory Mobilities that are associated with it
      const obligatoryMobilities = (
        await this.obligatoryMobilitiesModel
          .find({
            $or: [
              {
                initialDate: {
                  $gte: attachmentsObligatoryMobility.initialDate,
                  $lte: attachmentsObligatoryMobility.finalDate,
                },
              },
              {
                finalDate: {
                  $gte: attachmentsObligatoryMobility.initialDate,
                  $lte: attachmentsObligatoryMobility.finalDate,
                },
              },
            ],
            hospital: attachmentsObligatoryMobility.hospital,
          })
          .populate('student rotationService')
      ).filter(
        (obligatoryMobility) =>
          JSON.stringify(obligatoryMobility.student.specialty) ==
          JSON.stringify(attachmentsObligatoryMobility.specialty),
      );
      return {
        _id: attachmentsObligatoryMobility._id,
        initialDate: attachmentsObligatoryMobility.initialDate,
        finalDate: attachmentsObligatoryMobility.finalDate,
        hospital: attachmentsObligatoryMobility.hospital,
        specialty: attachmentsObligatoryMobility.specialty,
        solicitudeDocument: attachmentsObligatoryMobility.solicitudeDocument,
        acceptanceDocument: attachmentsObligatoryMobility.acceptanceDocument,
        obligatoryMobilities,
      };
    } else
      throw new ForbiddenException('attachments obligatory mobility not found');
  }

  /**
   * Updates a Attachments Obligatory Mobility in the database based on the provided _id
   * @param _id
   * @param updateAttachmentsObligatoryMobilityDto
   * @returns the modified Attachments Obligatory Mobility
   * @throws {ForbiddenException} Attachments Obligatory Mobility must exit
   * @throws {ForbiddenException} Attachments Obligatory Mobility must be modified
   */
  async update(
    _id: string,
    updateAttachmentsObligatoryMobilityDto: UpdateAttachmentsObligatoryMobilityDto,
  ): Promise<AttachmentsObligatoryMobility> {
    await this.findOne(_id);
    if (
      (
        await this.attachmentsObligatoryMobilitiesModel.updateOne(
          { _id },
          updateAttachmentsObligatoryMobilityDto,
        )
      ).modifiedCount == 0
    )
      throw new ForbiddenException(
        'attachments obligatory mobility not modified',
      );
    return await this.findRaw(_id);
  }

  /**
   * Deletes a Attachments Obligatory Mobility in the database based on the provided _id
   * @param _id
   * @param path
   * @throws {ForbiddenException} Attachments Obligatory Mobility must exist
   * @throws {ForbiddenException} Attachments Obligatory Mobility must be deleted
   */
  async delete(_id: string, path: string): Promise<void> {
    const attachmentsObligatoryMobility = await this.findOne(_id);
    if (attachmentsObligatoryMobility.solicitudeDocument)
      this.filesService.deleteFile(
        `${path}/${attachmentsObligatoryMobility.solicitudeDocument}`,
      );
    if (attachmentsObligatoryMobility.acceptanceDocument)
      this.filesService.deleteFile(
        `${path}/${attachmentsObligatoryMobility.acceptanceDocument}`,
      );
    if (
      (await this.attachmentsObligatoryMobilitiesModel.deleteOne({ _id }))
        .deletedCount == 0
    )
      throw new ForbiddenException(
        'attachments obligatory mobility not deleted',
      );
  }

  /**
   * Gets a document of the database of the specified Attachments Obligatory Mobility
   * @param _id
   * @param path
   * @param document
   * @returns the found document
   * @throws {ForbiddenException} Attachments Obligatory Mobility must exist
   * @throws {ForbiddenException} Document must exist
   */
  async getDocument(
    _id: string,
    path: string,
    document: AttachmentsObligatoryMobilityDocumentTypes,
  ): Promise<StreamableFile> {
    const attachmentsObligatoryMobility = await this.findRaw(_id);
    if (attachmentsObligatoryMobility[document]) {
      const filePath = `${path}/${attachmentsObligatoryMobility[document]}`;
      if (fs.existsSync(filePath)) {
        const file = fs.createReadStream(filePath);
        return new StreamableFile(file, {
          type: 'application/pdf',
        });
      }
    } else throw new ForbiddenException('document not found');
  }

  /**
   * Updates a document in the database of the specified
   * Attachments Obligatory Mobility
   * @param _id
   * @param path
   * @param file
   * @param document
   * @returns the modified Attachments Obligatory Mobility
   * @throws {ForbiddenException} Attachments Obligatory Mobility must exist
   * @throws {ForbiddenException} Attachments Obligatory Mobility must be modified
   */
  async updateDocument(
    _id: string,
    path: string,
    file: Express.Multer.File,
    document: AttachmentsObligatoryMobilityDocumentTypes,
  ): Promise<AttachmentsObligatoryMobility> {
    try {
      this.filesService.validatePDF(file);
      const attachmentsObligatoryMobility = await this.findRaw(_id);
      if (attachmentsObligatoryMobility[document])
        this.filesService.deleteFile(
          `${path}/${attachmentsObligatoryMobility[document]}`,
        );
      let updateObject: object = {};
      updateObject[document] = file.filename;
      if (
        (
          await this.attachmentsObligatoryMobilitiesModel.updateOne(
            { _id: attachmentsObligatoryMobility._id },
            updateObject,
          )
        ).modifiedCount < 1
      )
        throw new ForbiddenException(
          'attachments obligatory mobility not modified',
        );
      return await this.findRaw(_id);
    } catch (err) {
      this.filesService.deleteFile(`${path}/${file.filename}`);
    }
  }

  /**
   * Deletes a document in the database of the specified
   * Attachments Obligatory Mobility
   * @param _id
   * @param path
   * @param document
   * @returns the modified Attachments Obligatory Mobility
   * @throws {ForbiddenException} Attachments Obligatory Mobility must exist
   * @throws {ForbiddenException} Attachments Obligatory Mobility must be modified
   */
  async deleteDocument(
    _id: string,
    path: string,
    document: AttachmentsObligatoryMobilityDocumentTypes,
  ): Promise<AttachmentsObligatoryMobility> {
    const attachmentsObligatoryMobility = await this.findRaw(_id);
    if (attachmentsObligatoryMobility[document])
      this.filesService.deleteFile(
        `${path}/${attachmentsObligatoryMobility[document]}`,
      );
    let updateObject: object = {};
    updateObject[document] = null;
    if (
      (
        await this.attachmentsObligatoryMobilitiesModel.updateOne(
          { _id: attachmentsObligatoryMobility._id },
          updateObject,
        )
      ).modifiedCount < 1
    )
      throw new ForbiddenException('obligatory mobility not modified');
    return await this.findRaw(_id);
  }

  /**
   * Generates a solicitude docx document of the specified
   * Attachments Obligatory Mobilities
   * @param _id
   * @param numberOfDocument
   * @param date
   * @returns {ForbiddenException} the generated docx document
   * @throws {ForbiddenException} Template must exist
   */
  async generateDocument(
    _id: string,
    numberOfDocument: number,
    date: Date,
  ): Promise<StreamableFile> {
    const attachmentsObligatoryMobility = await this.findOne(_id);

    const hospital = await this.hospitalsService.findOne(
      attachmentsObligatoryMobility.hospital as string,
    );
    const specialty = await this.specialtiesService.findOne(
      attachmentsObligatoryMobility.specialty as string,
    );

    // Creates an array of objects to fill the students information
    const students: {
      nombre: string;
      servicioARotar: string;
      periodo: string;
    }[] = [];
    attachmentsObligatoryMobility.obligatoryMobilities.map(
      (obligatoryMobility) => {
        students.push({
          nombre: `${obligatoryMobility.student.name} ${
            obligatoryMobility.student.firstLastName
          }${
            obligatoryMobility.student.secondLastName
              ? ' ' + obligatoryMobility.student.secondLastName
              : ''
          }`,
          servicioARotar: obligatoryMobility.rotationService.value,
          periodo: getInterval(
            obligatoryMobility.initialDate,
            obligatoryMobility.finalDate,
          ),
        });
      },
    );

    // The data to fill
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
      numero: numberOfDocument,
      fecha: dateToString(date),
      especialidad: specialty.value,
      especialidadMayusculas: specialty.value.toUpperCase(),
      departamento: specialty.headOfDepartmentPosition,
      jefeDeDepartamento: specialty.headOfDepartment.toUpperCase(),
      profesor: specialty.tenuredPostgraduateProfessor.toUpperCase(),
      jefeDeServicio: specialty.headOfService.toUpperCase(),
      estudiante: students,
    };

    // Gets the template
    const template = await this.templatesService.getDocument(
      'obligatoryMobility',
      'solicitudeDocument',
    );

    const handler = new TemplateHandler();
    // Replaces the data at the tags
    const doc = await handler.process(template, data);

    return new StreamableFile(doc, {
      disposition: 'attachment:filename=Solicitud.docx',
    });
  }

  /**
   * Finds Attachments Obligatory Mobilities bases on the provided initial and
   * final date, specialty and hospital
   * @param initialDate
   * @param finalDate
   * @param specialty
   * @param hospital
   * @returns the found Attachments Obligatory Mobilities
   */
  async findAttachments(
    initialDate: Date,
    finalDate: Date,
    specialty: string,
    hospital: string,
  ): Promise<AttachmentsObligatoryMobility[]> {
    var ObjectId = require('mongoose').Types.ObjectId;
    return (await this.attachmentsObligatoryMobilitiesModel.aggregate([
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
            {
              initialDate: {
                $lte: initialDate,
              },
              finalDate: {
                $gte: finalDate,
              },
            },
          ],
          hospital: new ObjectId(hospital),
          specialty: new ObjectId(specialty),
        },
      },
    ])) as AttachmentsObligatoryMobility[];
  }
}
