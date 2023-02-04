import { ForbiddenException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { SpecialtyDto } from './dtos/specialty.dto';
import { Specialty, SpecialtyDocument } from './specialty.schema';

/** Specialties service */
@Injectable()
export class SpecialtiesService {
  constructor(
    @InjectModel(Specialty.name)
    private specialtiesModel: Model<SpecialtyDocument>,
  ) {}

  /**
   * Finds all Specialties in the database
   * @async
   * @returns {Promise<Specialty[]>} the found Specialties
   */
  async find(): Promise<Specialty[]> {
    return await this.specialtiesModel.find({ incoming: false }).exec();
  }

  /**
   * Finds a Specialty in the database based on the provided _id
   * @async
   * @param {string} _id _id of the Specialty
   * @returns {Promise<Specialty>} the found Specialty
   */
  async findOne(_id: string): Promise<Specialty> {
    const result = await this.specialtiesModel
      .findOne({ _id, incoming: false })
      .exec();
    if (result) return result;
    else throw new ForbiddenException('specialty not found');
  }

  /**
   * Creates a Specialty in the database
   * @async
   * @param {SpecialtyDto} specialtyDto Specialty data
   * @returns {Promise<Specialty>} the created Specialty
   * @throws {ForbiddenException} Specialty value must not already exists in the database
   */
  async create(specialtyDto: SpecialtyDto): Promise<Specialty> {
    const specialty = {
      incoming: false,
      ...specialtyDto,
    };
    const createdSpecialty = new this.specialtiesModel(specialty);
    return await createdSpecialty.save();
  }

  /**
   * Updates a Specialty in the databases based on the provided _id
   * @async
   * @param {string} _id _id of the Specialty
   * @param {SpecialtyDto} specialtyDto Specialty data
   * @returns {Promise<Specialty>} the modified Specialty
   * @throws {ForbiddenException} Specialty must be modified
   * @throws {ForbiddenException} Specialty must exists
   */
  async update(_id: string, specialtyDto: SpecialtyDto): Promise<Specialty> {
    const specialty = await this.findOne(_id);
    if (specialty) {
      const res = await this.specialtiesModel
        .updateOne({ _id }, specialtyDto)
        .exec();
      if (res.modifiedCount == 1) return await this.findOne(_id);
      else throw new ForbiddenException('specialty not modified');
    } else throw new ForbiddenException('specialty not found');
  }

  /**
   * Deletes a Specialty in the database bases on the provided _id
   * @async
   * @param {string} _id _id of the Specialty
   */
  async delete(_id: string): Promise<void> {
    const specialty = await this.findOne(_id);
    if (specialty) {
      await this.specialtiesModel.findOneAndDelete({ _id });
      if (await this.specialtiesModel.findOne({ _id }))
        throw new ForbiddenException('specialty not deleted');
    } else throw new ForbiddenException('specialty not found');
  }

  /**
   * Gets a grade by specialty
   * @param {Specialty} specialty
   * @param {number} lastYearGeneration
   * @returns {number} the grade
   */
  getGrade(specialty: Specialty, lastYearGeneration: number): number {
    const today = new Date();
    let month = today.getMonth() + 1,
      year = today.getFullYear();
    //If the month is January or February
    if (month == 1 || month == 2) year -= 1;
    return -(lastYearGeneration - specialty.duration - year - 1);
  }

  /**
   * Finds all Incoming Specialties in the database
   * @returns the found Incoming Specialties
   */
  async findIncoming(): Promise<Specialty[]> {
    return await this.specialtiesModel.find({ incoming: true }).exec();
  }

  /**
   * Finds one Incoming Specialty in the database based on the provided _id
   * @param _id
   * @returns the found Incoming Specialty
   */
  async findOneIncoming(_id: string): Promise<Specialty> {
    const result = await this.specialtiesModel
      .findOne({ _id, incoming: true })
      .exec();
    if (result) return result;
    else throw new ForbiddenException('specialty not found');
  }

  /**
   * Creates a Incoming Specialty and saves it in the database
   * @param specialtyDto
   * @returns the created Incoming Specialty
   */
  async createIncoming(specialtyDto: SpecialtyDto): Promise<Specialty> {
    const specialty = {
      incoming: true,
      ...specialtyDto,
    };
    const createdSpecialty = new this.specialtiesModel(specialty);
    return await createdSpecialty.save();
  }

  /**
   * Updates a Incoming Specialty in the database bases on the provided _id
   * @param _id
   * @param specialtyDto
   * @returns the updated Incoming Specialty
   */
  async updateIncoming(
    _id: string,
    specialtyDto: SpecialtyDto,
  ): Promise<Specialty> {
    const specialty = await this.findOneIncoming(_id);
    if (specialty) {
      const res = await this.specialtiesModel
        .updateOne({ _id }, specialtyDto)
        .exec();
      // Checks if the Incoming Specialty was updated
      if (res.modifiedCount == 1) return await this.findOneIncoming(_id);
      else throw new ForbiddenException('specialty not modified');
    } else throw new ForbiddenException('specialty not found');
  }

  /**
   * Deletes a Incoming Specialty in the database based on the provided _id
   * @param _id
   */
  async deleteIncoming(_id: string): Promise<void> {
    const specialty = await this.findOneIncoming(_id);
    if (specialty) {
      await this.specialtiesModel.findOneAndDelete({ _id });
      if (await this.specialtiesModel.findOne({ _id }))
        throw new ForbiddenException('specialty not deleted');
    } else throw new ForbiddenException('specialty not found');
  }
}
