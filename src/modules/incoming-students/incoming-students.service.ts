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
import * as JSZip from 'jszip';
import { Hospital } from '@hospitals/hospital.schema';
import { dateToString, getInterval, gradeToString } from '@utils/functions';
import { TemplatesService } from '@templates/templates.service';
import { TemplateHandler } from 'easy-template-x';
import { Inject } from '@nestjs/common/decorators';
import { forwardRef } from '@nestjs/common/utils';

/** Incoming Students service */
@Injectable()
export class IncomingStudentsService {
  constructor(
    @InjectModel(IncomingStudent.name)
    private incomingStudentsModel: Model<IncomingStudentDocument>,
    @Inject(forwardRef(() => RotationServicesService))
    private rotationServicesService: RotationServicesService,
    @Inject(forwardRef(() => HospitalsService))
    private hospitalsService: HospitalsService,
    @Inject(forwardRef(() => SpecialtiesService))
    private specialtiesService: SpecialtiesService,
    private filesService: FilesService,
    @Inject(forwardRef(() => TemplatesService))
    private templatesService: TemplatesService,
  ) {}

  /**
   * Creates a new Incoming Student in the database
   * @param createIncomingStudentDto
   * @returns the created Incoming Student
   * @throws {ForbiddenException} Incoming Specialty must exist
   * @throws {ForbiddenException} Rotation Service must exist
   */
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

  /**
   * Finds all Incoming Students in the database
   * @param initialDate
   * @param finalDate
   * @returns the found Incoming Students
   */
  async findAll(
    initialDate: Date,
    finalDate: Date,
  ): Promise<IncomingStudentsBySpecialtyDto[]> {
    const incomingStudentsBySpecialties =
      (await this.incomingStudentsModel.aggregate([
        {
          // Finds between initial and final date
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
        // Populates Specialties
        {
          $lookup: {
            from: 'specialties',
            localField: 'incomingSpecialty',
            foreignField: '_id',
            as: 'incomingSpecialty',
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
        // Populates Rotation Services
        {
          $lookup: {
            from: 'rotationservices',
            localField: 'rotationService',
            foreignField: '_id',
            as: 'rotationService',
          },
        },
        // Populates Specialties based on the Rotation Service
        {
          $lookup: {
            from: 'specialties',
            localField: 'rotationService.specialty',
            foreignField: '_id',
            as: 'specialty',
          },
        },
        // Deletes the arrays
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
        // Groups by specialty
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
    // Orders the Incoming Students by name
    incomingStudentsBySpecialties.map((incomingStudentsBySpecialty) => {
      incomingStudentsBySpecialty.incomingStudents.sort((a, b) =>
        a.secondLastName.localeCompare(b.secondLastName),
      );
      incomingStudentsBySpecialty.incomingStudents.sort((a, b) =>
        a.firstLastName.localeCompare(b.firstLastName),
      );
    });
    // Orders the Incoming Students by specialty
    incomingStudentsBySpecialties.sort((a, b) =>
      a.value.localeCompare(b.value),
    );
    return incomingStudentsBySpecialties;
  }

  /**
   * Finds an Incoming Student in the database
   * @param _id
   * @returns the found Incoming Student
   * @throws {ForbiddenException} Incoming Student must exist
   */
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

  /**
   * Updates an Incoming Student in the database based on the provided _id
   * @param _id
   * @param updateIncomingStudentDto
   * @returns the modified Incoming Student
   * @throws {ForbiddenException} Incoming Student must exist
   * @throws {ForbiddenException} Incoming Student must be modified
   */
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

  /**
   * Deletes an Incoming Student in the database based on the provided _id
   * @param _id
   * @param path
   * @throws {ForbiddenException} Incoming Student must exist
   * @throws {ForbiddenException} Incoming Student must be deleted
   */
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

  /**
   * Deletes Incoming Students by Specialty
   * @param specialty
   */
  async deleteByIncomingSpecialty(specialty: string): Promise<void> {
    await this.incomingStudentsModel.deleteMany({
      incomingSpecialty: specialty,
    });
  }

  /**
   * Deletes Incoming Students by Rotation Service
   * @param rotationService
   */
  async deleteByRotationService(rotationService: string): Promise<void> {
    await this.incomingStudentsModel.deleteMany({
      rotationService,
    });
  }

  /**
   * Deletes Incoming Students by Hospital
   * @param hospital
   */
  async deleteByHospital(hospital: string): Promise<void> {
    await this.incomingStudentsModel.deleteMany({
      hospital,
    });
  }

  /**
   * Gets the interval to find the Incoming Students
   * @returns the interval
   * @throws {ForbiddenException} must exist at least one Incoming Student
   */
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

  /**
   * Gets a document from the database of the specified Incoming Student
   * @param _id
   * @param path
   * @param document
   * @returns the found document
   * @throws {ForbiddenException} Incoming Student must exist
   * @throws {ForbiddenException} document must exist
   */
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

  /**
   * Updates a document in the database of the specified Incoming Student
   * @param _id
   * @param path
   * @param file
   * @param document
   * @returns the modified Incoming Student
   * @throws {ForbiddenException} Incoming Student must exist
   * @throws {ForbiddenException} Incoming Student must be modified
   */
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

  /**
   * Deletes a document in the database of the specified Incoming Student
   * @param _id
   * @param path
   * @param document
   * @returns the modified Incoming Student
   * @throws {ForbiddenException} Incoming Student must exist
   * @throws {ForbiddenException} Incoming Student must be modified
   */
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

  /**
   * Sets the param VoBo to the opposite at the specified Incoming Student
   * @param _id
   * @returns the modified Incoming Student
   * @throws {ForbiddenException} Incoming Student must exist
   * @throws {ForbiddenException} Incoming Student must be modified
   */
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

  /**
   * Cancels the specified Incoming Student
   * @param _id
   * @returns the modified Incoming Student
   * @throws {ForbiddenException} Incoming Student must exist
   * @throws {ForbiddenException} Incoming Student must be modified
   */
  async cancel(_id: string): Promise<IncomingStudent> {
    await this.findOne(_id);
    if (
      (await this.incomingStudentsModel.updateOne({ _id }, { canceled: true }))
        .modifiedCount < 1
    )
      throw new ForbiddenException('incoming student not modified');
    return await this.findOne(_id);
  }

  /**
   * Uncancels the specified Incoming Student
   * @param _id
   * @returns the modified Incoming Student
   * @throws {ForbiddenException} Incoming Student must exist
   * @throws {ForbiddenException} Incoming Student must be modified
   */
  async uncancel(_id: string): Promise<IncomingStudent> {
    await this.findOne(_id);
    if (
      (await this.incomingStudentsModel.updateOne({ _id }, { canceled: false }))
        .modifiedCount < 1
    )
      throw new ForbiddenException('incoming student not modified');
    return await this.findOne(_id);
  }

  /**
   * Generates the acceptances documents of the specified Incoming Students
   * @param initialNumberOfDocuments
   * @param numberOfDocument
   * @param dateOfDocuments
   * @param dateToPresent
   * @param initialDate
   * @param finalDate
   * @param hospital
   * @param specialty
   * @returns a zip with the generated docx acceptance documents
   * @throws {ForbiddenException} template must exist
   */
  async generateDocuments(
    initialNumberOfDocuments: number,
    numberOfDocument: number,
    dateOfDocuments: Date,
    dateToPresent: Date,
    initialDate: Date,
    finalDate: Date,
    hospital?: string,
    specialty?: string,
  ): Promise<StreamableFile> {
    // Validates if the dates are valid
    if (initialDate.getTime() > finalDate.getTime())
      throw new ForbiddenException('invalid interval');
    // Starts the counter
    let counter = initialNumberOfDocuments;
    // Creates the zip object
    const zip = new JSZip();
    // Finds the hospitals to find
    let hospitals: Hospital[] = [];
    if (hospital) hospitals.push(await this.hospitalsService.findOne(hospital));
    else hospitals = await this.hospitalsService.findAll();
    for (let hospital of hospitals) {
      const incomingStudents = (await this.incomingStudentsModel.aggregate([
        {
          // Finds between the initial and final date, hospital and
          // if is not canceled
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
        // Populates Specialties
        {
          $lookup: {
            from: 'specialties',
            localField: 'incomingSpecialty',
            foreignField: '_id',
            as: 'incomingSpecialty',
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
        // Populates Rotation Services
        {
          $lookup: {
            from: 'rotationservices',
            localField: 'rotationService',
            foreignField: '_id',
            as: 'rotationService',
          },
        },
        // Populates Specialties
        {
          $lookup: {
            from: 'specialties',
            localField: 'rotationService.specialty',
            foreignField: '_id',
            as: 'specialty',
          },
        },
        // Deletes arrays
        {
          $project: {
            _id: '$_id',
            name: '$name',
            firstLastName: '$firstLastName',
            secondLastName: '$secondLastName',
            initialDate: '$initialDate',
            finalDate: '$finalDate',
            incomingSpecialty: { $arrayElemAt: ['$incomingSpecialty', 0] },
            incomingYear: '$incomingYear',
            hospital: { $arrayElemAt: ['$hospital', 0] },
            rotationService: { $arrayElemAt: ['$rotationService', 0] },
            specialty: { $arrayElemAt: ['$specialty', 0] },
          },
        },
        // Deletes the attribute specialty
        {
          $addFields: {
            rotationService: {
              specialty: '$specialty',
            },
          },
        },
        {
          $unset: ['specialty'],
        },
      ])) as IncomingStudent[];
      for (let incomingStudent of incomingStudents) {
        if (specialty)
          if (incomingStudent.rotationService.specialty._id != specialty)
            return;
        // Sets the data
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
          numeroDeOficio: numberOfDocument,
          fecha: dateToString(dateOfDocuments),
          fechaDePresentacion: dateToString(dateToPresent),
          alumno: `${incomingStudent.name} ${
            incomingStudent.firstLastName
          }${
            incomingStudent.secondLastName
              ? ' ' + incomingStudent.secondLastName
              : ''
          }`,
          especialidad: incomingStudent.rotationService.specialty.value,
          servicioARotar: incomingStudent.rotationService.value,
          especialidadExterna: incomingStudent.incomingSpecialty.value,
          año: gradeToString(incomingStudent.incomingYear),
          periodo: getInterval(
            incomingStudent.initialDate,
            incomingStudent.finalDate,
          ),
          departamento:
            incomingStudent.rotationService.specialty.headOfDepartmentPosition,
          jefeDeDepartamento:
            incomingStudent.rotationService.specialty.headOfDepartment.toUpperCase(),
          profesor:
            incomingStudent.rotationService.specialty.tenuredPostgraduateProfessor.toUpperCase(),
          jefeDeServicio:
            incomingStudent.rotationService.specialty.headOfService.toUpperCase(),
        };
        // Gets the template
        const template = await this.templatesService.getDocument(
          'incomingStudent',
          'acceptanceDocument',
        );
        const handler = new TemplateHandler();
        // Replaces the tags with the data
        const doc = await handler.process(template, data);
        // Add the document to the zip
        zip.file(
          `${counter} ${incomingStudent.rotationService.specialty.value} ${
            incomingStudent.name
          } ${incomingStudent.firstLastName} ${
            incomingStudent.secondLastName ?? ''
          }.docx`,
          doc,
        );
        counter++;
      }
    }
    const content = await zip.generateAsync({ type: 'nodebuffer' });
    // Returns the zip file with the name of the documents to generate
    return new StreamableFile(content, {
      type: 'application/zip',
      disposition: `attachment;filename=aceptaciones.zip`,
    });
  }
}
