import { ForbiddenException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { timeStamp } from 'console';
import { Model } from 'mongoose';
import { CreateHospitalDto } from './dto/create-hospital.dto';
import { UpdateHospitalDto } from './dto/update-hospital.dto';
import { Hospital, HospitalDocument } from './hospital.schema';

@Injectable()
export class HospitalsService {
  constructor(
    @InjectModel(Hospital.name) private hospitalsModel: Model<HospitalDocument>,
  ) {}

  async findAll(): Promise<Hospital[]> {
    return this.hospitalsModel.find().exec();
  }

  async findOne(_id: string): Promise<Hospital> {
    const hospital = await this.hospitalsModel.findOne({ _id }).exec();
    if (hospital) return hospital;
    else throw new ForbiddenException('hospital not found');
  }

  async create(createHospitalDto: CreateHospitalDto): Promise<Hospital> {
    const createdHospital = new this.hospitalsModel(createHospitalDto);
    return await createdHospital.save();
  }

  async update(
    _id: string,
    updateHospitalDto: UpdateHospitalDto,
  ): Promise<Hospital> {
    const hospital = await this.findOne(_id);
    if (
      (
        await this.hospitalsModel
          .updateOne({ _id: hospital._id }, updateHospitalDto)
          .exec()
      ).modifiedCount == 1
    ) {
      return await this.findOne(_id);
    } else throw new ForbiddenException('hospital not modified');
  }

  async remove(_id: string): Promise<void> {
    const hospital = await this.findOne(_id);
    if (
      (await this.hospitalsModel.deleteOne({ _id: hospital._id }))
        .deletedCount != 1
    )
      throw new ForbiddenException('hospital not deleted');
  }
}
