import { ForbiddenException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { SpecialtyDto } from './dtos/specialty.dto';
import { Specialty, SpecialtyDocument } from './specialty.schema';

@Injectable()
export class SpecialtiesService {
  constructor(
    @InjectModel(Specialty.name)
    private specialtiesModel: Model<SpecialtyDocument>,
  ) {}

  async find(): Promise<Specialty[]> {
    return await this.specialtiesModel.find().exec();
  }

  async findOne(_id: string): Promise<Specialty | null> {
    return await this.specialtiesModel.findOne({ _id }).exec();
  }

  async findOneByValue(value: string): Promise<Specialty | null> {
    return await this.specialtiesModel
      .findOne({
        value: {
          $regex: new RegExp(`^${value.toLowerCase()}`, 'i'),
        },
      })
      .exec();
  }

  async createOne(specialtyDto: SpecialtyDto): Promise<Specialty> {
    const specialty = await this.findOneByValue(specialtyDto.value);
    if (!specialty) {
      const createdSpecialty = new this.specialtiesModel(specialtyDto);
      return await createdSpecialty.save();
    } else throw new ForbiddenException('specialty already exists');
  }

  async updateOne(_id: string, specialtyDto: SpecialtyDto): Promise<Specialty> {
    const specialty = await this.findOne(_id);
    if (specialty) {
      const res = await this.specialtiesModel
        .updateOne({ _id }, specialtyDto)
        .exec();
      if (res.modifiedCount == 1) return await this.findOne(_id);
      else throw new ForbiddenException('specialty not modified');
    } else throw new ForbiddenException('specialty not found');
  }

  async deleteOne(_id: string): Promise<void> {
    const specialty = await this.findOne(_id);
    if (specialty) {
      const res = await this.specialtiesModel.deleteOne({ _id });
      if (res.deletedCount != 1)
        throw new ForbiddenException('specialty not deleted');
    } else throw new ForbiddenException('specialty not found');
  }
}
