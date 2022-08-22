import { ForbiddenException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateHospitalDto } from './dto/create-hospital.dto';
import { UpdateHospitalDto } from './dto/update-hospital.dto';
import { Hospital, HospitalDocument } from './hospital.schema';

@Injectable()
export class HospitalsService {
  constructor(
    @InjectModel(Hospital.name) private hospitalsModel: Model<HospitalDocument>,
  ) {}

  /**
   * Finds in the database all the Hospitals
   * @async
   * @returns {Promise<Hospital[]>} the found Hospitals
   */
  async findAll(): Promise<Hospital[]> {
    return this.hospitalsModel.find().exec();
  }

  /**
   * Finds a Hospital in the database based on the provided _id
   * @async
   * @param {string} _id _id of the Hospital
   * @returns {Promise<Hospital>} the found Hospital
   * @throws {ForbiddenException} Hospital must exists
   */
  async findOne(_id: string): Promise<Hospital> {
    const hospital = await this.hospitalsModel.findOne({ _id }).exec();
    if (hospital) return hospital;
    else throw new ForbiddenException('hospital not found');
  }

  /**
   * Adds a Hospital in the database
   * @async
   * @param {CreateHospitalDto} createHospitalDto Hospital data
   * @returns {Promise<Hospital>}
   */
  async create(createHospitalDto: CreateHospitalDto): Promise<Hospital> {
    const createdHospital = new this.hospitalsModel(createHospitalDto);
    return await createdHospital.save();
  }

  /**
   * Updates a Hospital in the database based on the provided _id
   * @async
   * @param {string} _id _id of the Hospital
   * @param {UpdateHospitalDto} updateHospitalDto Hospital data
   * @returns {Promise<Hospital>} the updated Hospital
   * @throws {ForbiddenException} Hospital must exists
   * @throws {ForbiddenException} Hopsital must be modified
   */
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

  /**
   * Deletes a Hospital in the database
   * @async
   * @param {string} _id _id of the Hospital
   */
  async remove(_id: string): Promise<void> {
    const hospital = await this.findOne(_id);
    if (
      (await this.hospitalsModel.deleteOne({ _id: hospital._id }))
        .deletedCount != 1
    )
      throw new ForbiddenException('hospital not deleted');
  }
}
