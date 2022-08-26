import { ForbiddenException, Injectable, StreamableFile } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { HospitalsService } from 'modules/hospitals/hospitals.service';
import { StudentsService } from 'modules/students/students.service';
import { Model } from 'mongoose';
import { CreateSocialServiceDto } from './dto/create-social-service.dto';
import { UpdateSocialServiceDto } from './dto/update-social-service.dto';
import { SocialService, SocialServiceDocument } from './social-service.schema';
import * as fs from 'fs';
import { STORAGE_PATHS } from '@utils/constants/storage.constant';
import { FilesService } from '@utils/services/files.service';
import { SocialServiceBySpecialtyDto } from './dto/social-service-by-specialty.dto';

@Injectable()
export class SocialServicesService {
  constructor(
    @InjectModel(SocialService.name)
    private socialServicesModel: Model<SocialServiceDocument>,
    private studentsService: StudentsService,
    private hospitalsService: HospitalsService,
    private filesService: FilesService,
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
      (initialYear == finalYear && initialPeriod >= finalPeriod)
    )
      throw new ForbiddenException('invalid period');
    else {
      return await this.socialServicesModel
        .aggregate([
          {
            $match: {
              $or: [
                {
                  year: {
                    $gt: +initialYear,
                    $lt: +finalYear,
                  },
                },
                {
                  year: +initialYear,
                  period: {
                    $gte: +initialPeriod,
                  },
                },
                {
                  year: +finalYear,
                  period: {
                    $lte: +finalPeriod,
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
              period: '$period',
              year: '$year',
              hospital: '$hospital',
              presentationOfficeDocument: '$presentationOfficeDocument',
              reportDocument: '$reportDocument',
              constancyDocument: '$constancyDocument',
              student: { $arrayElemAt: ['$student', 0] },
              __v: '$__v',
            },
          },
          {
            $group: {
              _id: '$specialty._id',
              value: { $first: '$specialty.value' },
              socialServices: {
                $push: {
                  _id: '$_id',
                  period: '$period',
                  year: '$year',
                  hospital: '$hospital',
                  presentationOfficeDocument: '$presentationOfficeDocument',
                  reportDocument: '$reportDocument',
                  constancyDocument: '$constancyDocument',
                  student: {
                    _id: '$student._id',
                    name: '$student.name',
                    firstLastName: '$student.firstLastName',
                    secondLastName: '$student.secondLastName',
                  },
                  __v: '$__v',
                },
              },
            },
          },
        ])
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
    const min = await this.socialServicesModel.findOne().sort('-year').exec();
    const max = await this.socialServicesModel.findOne().sort('year').exec();
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
  private async getDocument(
    _id: string,
    path: string,
    document:
      | 'presentationOfficeDocument'
      | 'reportDocument'
      | 'constancyDocument',
  ) {
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

  private async updateDocument(
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

  private async deleteDocument(
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
          .updateOne({ _id: ss._id }, { presentationOfficeDocument: null })
          .exec()
      ).modifiedCount < 1
    )
      throw new ForbiddenException('social service not updated');
  }

  //Presentation Office Document
  async getPresentationOffice(_id: string): Promise<StreamableFile | null> {
    return await this.getDocument(
      _id,
      STORAGE_PATHS.SOCIAL_SERVICES.PRESENTATION_OFFICES,
      'presentationOfficeDocument',
    );
  }

  async updatePresentationOffice(
    _id: string,
    file: Express.Multer.File,
  ): Promise<SocialService> {
    return await this.updateDocument(
      _id,
      STORAGE_PATHS.SOCIAL_SERVICES.PRESENTATION_OFFICES,
      file,
      'presentationOfficeDocument',
    );
  }

  async deletePresentationOffice(_id: string): Promise<void> {
    return this.deleteDocument(
      _id,
      STORAGE_PATHS.SOCIAL_SERVICES.PRESENTATION_OFFICES,
      'presentationOfficeDocument',
    );
  }

  //Report Document
  async getReport(_id: string): Promise<StreamableFile | null> {
    return await this.getDocument(
      _id,
      STORAGE_PATHS.SOCIAL_SERVICES.REPORTS,
      'reportDocument',
    );
  }

  async updateReport(
    _id: string,
    file: Express.Multer.File,
  ): Promise<SocialService> {
    return await this.updateDocument(
      _id,
      STORAGE_PATHS.SOCIAL_SERVICES.REPORTS,
      file,
      'reportDocument',
    );
  }

  async deleteReport(_id: string) {
    return this.deleteDocument(
      _id,
      STORAGE_PATHS.SOCIAL_SERVICES.REPORTS,
      'reportDocument',
    );
  }

  //Constancy Document
  async getConstancy(_id: string): Promise<StreamableFile | null> {
    return await this.getDocument(
      _id,
      STORAGE_PATHS.SOCIAL_SERVICES.CONSTANCIES,
      'constancyDocument',
    );
  }

  async updateConstancy(
    _id: string,
    file: Express.Multer.File,
  ): Promise<SocialService> {
    return await this.updateDocument(
      _id,
      STORAGE_PATHS.SOCIAL_SERVICES.CONSTANCIES,
      file,
      'constancyDocument',
    );
  }

  async deleteConstancy(_id: string) {
    return this.deleteDocument(
      _id,
      STORAGE_PATHS.SOCIAL_SERVICES.CONSTANCIES,
      'constancyDocument',
    );
  }
}

/*
db.socialservices.aggregate([
	{$lookup: {
		from: 'students',
		localField: 'student',
		foreignField: '_id',
		as: 'student',
		}
	},
	{$project: {
		"student": { "$arrayElemAt": [ "$student", 0 ] } 
	}},
	{$group: {
		"_id": "$student.specialty",
		field: "$_id"
	}}
]).pretty();
*/
