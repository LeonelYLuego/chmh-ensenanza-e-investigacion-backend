import * as fs from 'fs';
import * as JSZip from 'jszip';
import Docxtemplater from 'docxtemplater';
import {
  ForbiddenException,
  forwardRef,
  Inject,
  Injectable,
  StreamableFile,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { SocialService, SocialServiceDocument } from './social-service.schema';
import { Model } from 'mongoose';
import { SocialServicesQueries } from './services/queries.service';
import { StudentsService } from '@students/students.service';
import { HospitalsService } from '@hospitals/hospitals.service';
import { SpecialtiesService } from '@specialties/specialties.service';
import { FilesService } from '@utils/services';
import { TemplatesService } from '@templates/templates.service';
import { CreateSocialServiceDto } from './dto/create-social-service.dto';
import { FromPeriodToPeriodInterface } from './interfaces/from-period-to-period.interface';
import { SocialServiceBySpecialtyDto } from './dto/social-service-by-specialty.dto';
import { FromYearToYearDto } from './dto/from-year-to-year.dto';
import { UpdateSocialServiceDto } from './dto/update-social-service.dto';
import { SocialServiceDocumentTypes } from './types/document.types';
import { Hospital } from '@hospitals/hospital.schema';
import { Student } from '@students/student.schema';

/** Social Service service */
@Injectable()
export class SocialServicesService {
  constructor(
    @InjectModel(SocialService.name)
    private socialServicesModel: Model<SocialServiceDocument>,
    @Inject(forwardRef(() => HospitalsService))
    private hospitalsService: HospitalsService,
    private socialServicesQueries: SocialServicesQueries,
    @Inject(forwardRef(() => StudentsService))
    private studentsService: StudentsService,
    private specialtiesService: SpecialtiesService,
    private filesService: FilesService,
    private templatesService: TemplatesService,
  ) {}

  /**
   * Creates a new Social Service
   * @async
   * @param {CreateSocialServiceDto} createSocialServiceDto the Social Service to create
   * @returns {SocialService} the created Social Service
   */
  async create(
    createSocialServiceDto: CreateSocialServiceDto,
  ): Promise<SocialService> {
    await this.studentsService.findOne(createSocialServiceDto.student);
    await this.hospitalsService.findOne(createSocialServiceDto.hospital);
    const createdSocialService = new this.socialServicesModel(
      createSocialServiceDto,
    );
    return await createdSocialService.save();
  }

  /**
   * Finds all Social Services between a period to other
   * @async
   * @param {FromPeriodToPeriodInterface} periods periods to find
   * @returns {SocialServiceBySpecialtyDto[]} the found Social Services
   * @throws {ForbiddenException} the period must be valid
   */
  async findAll(
    periods: FromPeriodToPeriodInterface,
  ): Promise<SocialServiceBySpecialtyDto[]> {
    if (
      periods.initialYear > periods.finalYear ||
      (periods.initialYear == periods.finalYear &&
        periods.initialPeriod > periods.finalPeriod)
    )
      throw new ForbiddenException('invalid period');
    else {
      return await this.socialServicesModel
        .aggregate(this.socialServicesQueries.find(periods))
        .exec();
    }
  }

  /**
   * Finds a Social Service by id
   * @async
   * @param {string} _id Social Service primary key
   * @returns {SocialService} the found Social Service
   * @throws {ForbiddenException} Social Service must exist
   */
  async findOne(_id: string): Promise<SocialService> {
    const ss = await this.socialServicesModel.findOne({ _id }).exec();
    if (ss) return ss;
    else throw new ForbiddenException('social service not found');
  }

  /**
   * Gets the initial and final year of the period
   * @async
   * @returns {FromYearToYearDto} the initial and final year
   */
  async getPeriods(): Promise<FromYearToYearDto> {
    const min = await this.socialServicesModel.findOne().sort('year').exec();
    const max = await this.socialServicesModel.findOne().sort('-year').exec();
    if (min && max) {
      return {
        initialYear: min.year,
        finalYear: max.year,
      };
    }
    return null;
  }

  /**
   * Updates a Social Service
   * @param {string} _id Social Service primary key
   * @param {UpdateSocialServiceDto} updateSocialServiceDto Social Service values to update
   * @returns {SocialService} the updated Social Service
   * @throws {ForbiddenException} Social Service must exist
   * @throws {ForbiddenException} Social Service must be modified
   */
  async update(
    _id: string,
    updateSocialServiceDto: UpdateSocialServiceDto,
  ): Promise<SocialService> {
    const ss = await this.findOne(_id);
    if (
      (
        await this.socialServicesModel.updateOne(
          { _id: ss._id },
          updateSocialServiceDto,
        )
      ).modifiedCount < 1
    )
      throw new ForbiddenException('social service not updated');
    return await this.findOne(ss._id);
  }

  /**
   * Deletes a Social Service
   * @async
   * @param {string} _id
   * @throws {ForbiddenException} Social Service must exist
   * @throws {ForbiddenException} Social Service must be deleted
   */
  async delete(_id: string): Promise<void> {
    const ss = await this.findOne(_id);
    if (
      (await this.socialServicesModel.deleteOne({ _id: ss._id })).deletedCount <
      1
    )
      throw new ForbiddenException('social service not deleted');
  }

  async deleteByHospital(hospital: string): Promise<void> {
    await this.socialServicesModel.deleteMany({ hospital });
  }

  async deleteByStudent(student: string): Promise<void> {
    await this.socialServicesModel.deleteMany({ student });
  }

  //Documents
  /**
   * Returns a Social Service document
   * @param {string} _id Social Service primary key
   * @param {string} path document path
   * @param {SocialServiceDocumentTypes} document
   * @returns {StreamableFile} the found document
   * @throws {ForbiddenException} document must exist
   */
  async getDocument(
    _id: string,
    path: string,
    document: SocialServiceDocumentTypes,
  ): Promise<StreamableFile> {
    const ss = await this.findOne(_id);
    //Checks if the Social Service has a document
    if (ss[document]) {
      const filePath = `${path}/${ss[document]}`;
      //Checks if the document is stored in the server
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
   * Update a Social Service document
   * @param {string} _id Social Service primary key
   * @param {string} path document path
   * @param {Express.Multer.File} file the file to update
   * @param {SocialServiceDocumentTypes} document document type
   * @returns The modified Social Service
   * @throws {ForbiddenException} Social Service must be updated
   */
  async updateDocument(
    _id: string,
    path: string,
    file: Express.Multer.File,
    document: SocialServiceDocumentTypes,
  ): Promise<SocialService> {
    try {
      //Validates if the file is a PDF
      this.filesService.validatePDF(file);
      const ss = await this.findOne(_id);
      //Delete the pdf
      if (ss[document]) this.filesService.deleteFile(`${path}/${ss[document]}`);
      let updateObject: object = {};
      updateObject[document] = file.filename;
      if (
        //Updated the Social Service with the new document
        (
          await this.socialServicesModel.updateOne(
            { _id: ss._id },
            updateObject,
          )
        ).modifiedCount < 1
      )
        throw new ForbiddenException('social service not updated');
      return await this.findOne(_id);
    } catch (err) {
      this.filesService.deleteFile(`${path}/${file.filename}`);
      throw new ForbiddenException(err);
    }
  }

  /**
   * Deletes a Social Service document
   * @param {string} _id Social Service primary key
   * @param {string} path document path
   * @param {SocialServiceDocumentTypes} document document type
   * @throws {ForbiddenException} Social Service must be updated
   */
  async deleteDocument(
    _id: string,
    path: string,
    document: SocialServiceDocumentTypes,
  ): Promise<SocialService> {
    const ss = await this.findOne(_id);
    //Delete the file of the server
    if (ss[document]) this.filesService.deleteFile(`${path}/${ss[document]}`);
    let updateObject: object = {};
    updateObject[document] = null;
    if (
      //Updates the Social Service
      (
        await this.socialServicesModel
          .updateOne({ _id: ss._id }, updateObject)
          .exec()
      ).modifiedCount < 1
    )
      throw new ForbiddenException('social service not updated');
    return await this.findOne(_id);
  }

  async generateDocuments(
    initialNumberOfDocuments: number,
    dateOfDocuments: Date,
    initialPeriod: number,
    initialYear: number,
    finalPeriod: number,
    finalYear: number,
    hospital: string | undefined,
    specialty: string | undefined,
  ): Promise<StreamableFile> {
    if (
      initialYear > finalYear ||
      (initialYear == finalYear && initialPeriod > finalPeriod)
    )
      throw new ForbiddenException('invalid period');
    else {
      let counter = initialNumberOfDocuments;
      //Gets the current date
      const date = new Date(dateOfDocuments);
      const months = [
        'enero',
        'febrero',
        'marzo',
        'abril',
        'mayo',
        'junio',
        'julio',
        'agosto',
        'septiembre',
        'octubre',
        'noviembre',
        'diciembre',
      ];
      const grades = [
        'primer',
        'segundo',
        'tercer',
        'cuarto',
        'quinto',
        'sexto',
      ];

      //Creates a new zip object
      const zip = new JSZip();

      let hospitals: Hospital[] = [];
      if (hospital)
        //Gets the hospital
        hospitals.push(await this.hospitalsService.findOne(hospital));
      //Gets all Social Service Hospitals
      else hospitals = await this.hospitalsService.findBySocialService();
      await Promise.all(
        hospitals.map(async (hospital) => {
          //Gets Social Services of each Hospital in the period
          const socialServices = (await this.socialServicesModel
            .aggregate(
              this.socialServicesQueries.generateDocuments(
                initialPeriod,
                initialYear,
                finalPeriod,
                finalYear,
                hospital,
              ),
            )
            .exec()) as SocialService[];
          await Promise.all(
            socialServices.map(async (socialService) => {
              //If a Specialty parameter was provided checks if the social service is of that Specialty
              if (specialty)
                if ((socialService as any).specialty._id != specialty) return;
              //Gets the template
              const template = (await this.templatesService.getTemplate(
                'socialService',
                'presentationOfficeDocument',
              )) as Docxtemplater;

              //Replaces tags in the template document with the information
              template.render({
                hospital: hospital.name.toUpperCase(),
                numero: counter.toString(),
                fecha: `${date.getDate()} de ${
                  months[date.getMonth()]
                } de ${date.getFullYear()}`,
                'principal.nombre': hospital.firstReceiver
                  ? hospital.firstReceiver.name.toUpperCase()
                  : '',
                'principal.cargo': hospital.firstReceiver
                  ? hospital.firstReceiver.position.toUpperCase()
                  : '',
                'secundario.nombre': hospital.secondReceiver
                  ? `AT'N ${hospital.secondReceiver.name.toUpperCase()}`
                  : '',
                'secundario.cargo': hospital.secondReceiver
                  ? hospital.secondReceiver.position.toUpperCase()
                  : '',
                estudiante: `${socialService.student.name} ${
                  socialService.student.firstLastName
                }${
                  socialService.student.secondLastName
                    ? ' ' + socialService.student.secondLastName
                    : ''
                }`.toUpperCase(),
                especialidad: (socialService as any).specialty.value,
                año: grades[
                  this.specialtiesService.getGrade(
                    (socialService as any).specialty,
                    (socialService.student as any).lastYearGeneration,
                  ) - 1
                ],
                periodo: this.getPeriod(
                  socialService.period,
                  socialService.year,
                ),
              });

              //Increments the document number
              counter++;

              //Converts the document to binary
              const buffer = (await template.getZip().generate({
                type: 'nodebuffer',
                compression: 'DEFLATE',
              })) as Buffer;

              //Adds the generated document to the zip and saves it with the name of the student
              zip.file(
                `${(socialService as any).specialty.value} ${
                  (socialService.student as Student).name
                } ${(socialService.student as Student).firstLastName} ${
                  (socialService.student as Student).secondLastName ?? ''
                }.docx`,
                buffer,
              );
            }),
          );
        }),
      );

      //Generates the zip file
      const content = await zip.generateAsync({ type: 'nodebuffer' });

      //Returns the zip file as StreamableFile and with the specified name
      return new StreamableFile(content, {
        type: 'application/zip',
        disposition: `attachment;filename=Oficios de Presentación.zip`,
      });
    }
  }

  /**
   * Converts the period tag to string
   * @param {number} period
   * @param {number} year
   * @returns The period as string
   */
  private getPeriod(period: number, year: number): string {
    switch (period) {
      case 0:
        return `1° de marzo al 31 de junio de ${year}`;
      case 1:
        return `1° de julio al 31 de octubre de ${year}`;
      case 2:
        const lastDay =
          (year % 4 == 0 && year % 100 != 0) || year % 400 == 0 ? 29 : 28;
        return `1° de noviembre de ${year} al ${lastDay} de febrero de ${
          year + 1
        }`;
      default:
        return '';
    }
  }
}
