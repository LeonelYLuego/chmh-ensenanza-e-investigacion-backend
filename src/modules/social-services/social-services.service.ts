import { ForbiddenException, Injectable, StreamableFile } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { HospitalsService } from 'modules/hospitals/hospitals.service';
import { StudentsService } from 'modules/students/students.service';
import { Model } from 'mongoose';
import { CreateSocialServiceDto } from './dto/create-social-service.dto';
import { UpdateSocialServiceDto } from './dto/update-social-service.dto';
import { SocialService, SocialServiceDocument } from './social-service.schema';
import * as fs from 'fs';
import * as JSZip from 'jszip';
import { FilesService } from '@utils/services/files.service';
import { SocialServiceBySpecialtyDto } from './dto/social-service-by-specialty.dto';
import { TemplatesService } from 'modules/templates/templates.service';
import Docxtemplater from 'docxtemplater';
import { SpecialtiesService } from 'modules/specialties/specialties.service';
import { Student } from 'modules/students/student.schema';
import { SocialServicesQueries } from './services/queries.service';
import { Hospital } from 'modules/hospitals/hospital.schema';

@Injectable()
export class SocialServicesService {
  constructor(
    @InjectModel(SocialService.name)
    private socialServicesModel: Model<SocialServiceDocument>,
    private socialServicesQueries: SocialServicesQueries,
    private studentsService: StudentsService,
    private hospitalsService: HospitalsService,
    private specialtiesService: SpecialtiesService,
    private filesService: FilesService,
    private templatesService: TemplatesService,
  ) {}

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

  async findAll(
    initialPeriod: number,
    initialYear: number,
    finalPeriod: number,
    finalYear: number,
  ): Promise<SocialServiceBySpecialtyDto[]> {
    if (
      initialYear > finalYear ||
      (initialYear == finalYear && initialPeriod > finalPeriod)
    )
      throw new ForbiddenException('invalid period');
    else {
      return await this.socialServicesModel
        .aggregate(
          this.socialServicesQueries.find(
            initialPeriod,
            initialYear,
            finalPeriod,
            finalYear,
          ),
        )
        .exec();
    }
  }

  async findOne(_id: string): Promise<SocialService> {
    const ss = await this.socialServicesModel.findOne({ _id }).exec();
    if (ss) return ss;
    else throw new ForbiddenException('social service not found');
  }

  async getPeriods(): Promise<{
    initialYear: number;
    finalYear: number;
  } | null> {
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

  async remove(_id: string): Promise<void> {
    const ss = await this.findOne(_id);
    if (
      (await this.socialServicesModel.deleteOne({ _id: ss._id })).deletedCount <
      1
    )
      throw new ForbiddenException('social service not deleted');
  }

  //Documents
  async getDocument(
    _id: string,
    path: string,
    document:
      | 'presentationOfficeDocument'
      | 'reportDocument'
      | 'constancyDocument',
  ): Promise<StreamableFile> {
    const ss = await this.findOne(_id);
    if (ss[document]) {
      const filePath = `${path}/${ss[document]}`;
      if (fs.existsSync(filePath)) {
        const file = fs.createReadStream(filePath);
        return new StreamableFile(file, {
          type: 'application/pdf',
        });
      }
    }
    return null;
  }

  async updateDocument(
    _id: string,
    path: string,
    file: Express.Multer.File,
    document:
      | 'presentationOfficeDocument'
      | 'reportDocument'
      | 'constancyDocument',
  ): Promise<SocialService> {
    try {
      this.filesService.validatePDF(file);
      const ss = await this.findOne(_id);
      if (ss[document]) this.filesService.deleteFile(`${path}/${ss[document]}`);
      let updateObject: object = {};
      updateObject[document] = file.filename;
      if (
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

  async deleteDocument(
    _id: string,
    path: string,
    document:
      | 'presentationOfficeDocument'
      | 'reportDocument'
      | 'constancyDocument',
  ): Promise<void> {
    const ss = await this.findOne(_id);
    if (ss[document]) this.filesService.deleteFile(`${path}/${ss[document]}`);
    let updateObject: object = {};
    updateObject[document] = null;
    if (
      (
        await this.socialServicesModel
          .updateOne({ _id: ss._id }, updateObject)
          .exec()
      ).modifiedCount < 1
    )
      throw new ForbiddenException('social service not updated');
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
  ) {
    if (
      initialYear > finalYear ||
      (initialYear == finalYear && initialPeriod > finalPeriod)
    )
      throw new ForbiddenException('invalid period');
    else {
      let counter = initialNumberOfDocuments;
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

      const zip = new JSZip();

      let hospitals: Hospital[] = [];
      if (hospital)
        hospitals.push(await this.hospitalsService.findOne(hospital));
      else hospitals = await this.hospitalsService.findBySocialService();
      await Promise.all(
        hospitals.map(async (hospital) => {
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
              if (specialty)
                if ((socialService as any).specialty._id != specialty) return;
              const template = (await this.templatesService.getTemplate(
                'socialService',
                'presentationOfficeDocument',
              )) as Docxtemplater;

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

              counter++;

              const buffer = (await template.getZip().generate({
                type: 'nodebuffer',
                compression: 'DEFLATE',
              })) as Buffer;

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
      const content = await zip.generateAsync({ type: 'nodebuffer' });
      return new StreamableFile(content, {
        type: 'application/zip',
        disposition: `attachment;filename=Oficios de Presentación.zip`,
      });
    }
  }

  getPeriod(period: number, year: number): string {
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
