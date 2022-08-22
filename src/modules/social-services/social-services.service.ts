import { ForbiddenException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { HospitalsService } from 'modules/hospitals/hospitals.service';
import { StudentsService } from 'modules/students/students.service';
import { Model } from 'mongoose';
import { CreateSocialServiceDto } from './dto/create-social-service.dto';
import { UpdateSocialServiceDto } from './dto/update-social-service.dto';
import { SocialService, SocialServiceDocument } from './social-service.schema';

@Injectable()
export class SocialServicesService {
  constructor(
    @InjectModel(SocialService.name)
    private socialServicesModel: Model<SocialServiceDocument>,
    private studentsService: StudentsService,
    private hospitalsService: HospitalsService,
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
  ): Promise<SocialService[]> {
    if (
      initialYear > finalYear ||
      (initialYear == finalYear && initialPeriod >= finalPeriod)
    )
      throw new ForbiddenException('invalid period');
    else {
      return await this.socialServicesModel
        .find({
          $or: [
            {
              year: {
                $gt: initialYear,
                $lt: finalYear,
              },
            },
            {
              year: initialYear,
              period: {
                $gte: initialPeriod,
              },
            },
            {
              year: finalYear,
              period: {
                $lte: finalPeriod,
              },
            },
          ],
        })
        .exec(); //Find period
    }
  }

  async findOne(_id: string): Promise<SocialService> {
    const ss = await this.socialServicesModel.findOne({ _id }).exec();
    if (ss) return ss;
    else throw new ForbiddenException('social service not found');
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
}
