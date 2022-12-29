import { Injectable, ForbiddenException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { SpecialtiesService } from '@specialties/specialties.service';
import { Specialty } from '@specialties/specialty.schema';
import { Model } from 'mongoose';
import { RotationServiceDto } from './dtos/rotation-service.dto';
import {
  RotationService,
  RotationServiceDocument,
} from './rotation-service.schema';

@Injectable()
export class RotationServicesService {
  constructor(
    @InjectModel(RotationService.name)
    private rotationServicesModel: Model<RotationServiceDocument>,
    private specialtiesService: SpecialtiesService,
  ) {}

  /**
   * Finds all Rotation Services in the database by Specialty
   * @param specialty Specialty primary key
   * @returns {RotationService[]} The found Rotation Services
   */
  async find(specialty: string): Promise<RotationService[]> {
    await this.specialtiesService.findOne(specialty);
    return await this.rotationServicesModel.find({ specialty });
  }

  /**
   * Finds a Rotation Service in the database by Id
   * @param _id
   * @returns {RotationService} The found Rotation Service
   * @throws {ForbiddenException} Rotation Service must exist
   */
  async findOne(_id: string): Promise<RotationService> {
    const rotationService = await this.rotationServicesModel
      .findOne({
        _id,
      })
      .populate('specialty');
    if (rotationService && !rotationService.specialty.incoming) {
      rotationService.specialty = rotationService.specialty
        ._id as unknown as Specialty;
      return rotationService;
    }
    throw new ForbiddenException('rotation service not found');
  }

  /**
   * Creates a new Rotation Service in the database
   * @param rotationServiceDto
   * @returns {RotationService} The created Rotation Service
   * @throws {ForbiddenException} Specialty must exist
   */
  async create(
    rotationServiceDto: RotationServiceDto,
  ): Promise<RotationService> {
    await this.specialtiesService.findOne(rotationServiceDto.specialty);
    const rotationService = new this.rotationServicesModel(rotationServiceDto);
    return await rotationService.save();
  }

  /**
   * Updates a Rotation Service by Id
   * @param _id
   * @param rotationServiceDto
   * @returns {RotationService} The modified Rotation Service
   * @throws {ForbiddenException} Specialty must exist
   * @throws {ForbiddenException} Rotation Service must exist
   */
  async update(
    _id: string,
    rotationServiceDto: RotationServiceDto,
  ): Promise<RotationService> {
    const rotationService = await this.findOne(_id);
    await this.specialtiesService.findOne(rotationServiceDto.specialty);
    if (
      (
        await this.rotationServicesModel.updateOne(
          { _id: rotationService._id },
          rotationServiceDto,
        )
      ).modifiedCount == 0
    )
      throw new ForbiddenException('rotation service not modified');
    else return await this.findOne(_id);
  }

  /**
   * Deletes a Rotation Service by Id
   * @param _id
   * @throws {ForbiddenException} Rotation Service must exist
   * @throws {ForbiddenException} Rotation Service must be deleted
   */
  async delete(_id: string): Promise<void> {
    const rotationService = await this.findOne(_id);
    if (
      (await this.rotationServicesModel.deleteOne({ _id: rotationService._id }))
        .deletedCount == 0
    )
      throw new ForbiddenException('rotation service not deleted');
  }

  /**
   * Deletes Rotation Services by Specialty
   * @param specialty Specialty primary key
   */
  async deleteBySpecialty(specialty: string): Promise<void> {
    await this.rotationServicesModel.deleteMany({
      specialty,
    });
  }

  async findIncoming(specialty: string): Promise<RotationService[]> {
    await this.specialtiesService.findIncoming();
    return await this.rotationServicesModel.find({ specialty });
  }

  async findOneIncoming(_id: string): Promise<RotationService> {
    const rotationService = await this.rotationServicesModel
      .findOne({
        _id,
      })
      .populate('specialty');
    if (rotationService && rotationService.specialty.incoming) {
      rotationService.specialty = rotationService.specialty
        ._id as unknown as Specialty;
      return rotationService;
    }
    throw new ForbiddenException('rotation service not found');
  }

  async createIncoming(
    rotationServiceDto: RotationServiceDto,
  ): Promise<RotationService> {
    await this.specialtiesService.findOneIncoming(rotationServiceDto.specialty);
    const rotationService = new this.rotationServicesModel(rotationServiceDto);
    return await rotationService.save();
  }

  async updateIncoming(
    _id: string,
    rotationServiceDto: RotationServiceDto,
  ): Promise<RotationService> {
    const rotationService = await this.findOneIncoming(_id);
    await this.specialtiesService.findOneIncoming(rotationServiceDto.specialty);
    if (
      (
        await this.rotationServicesModel.updateOne(
          { _id: rotationService._id },
          rotationServiceDto,
        )
      ).modifiedCount == 0
    )
      throw new ForbiddenException('rotation service not modified');
    else return await this.findOneIncoming(_id);
  }

  async deleteIncoming(_id: string): Promise<void> {
    const rotationService = await this.findOneIncoming(_id);
    if (
      (await this.rotationServicesModel.deleteOne({ _id: rotationService._id }))
        .deletedCount == 0
    )
      throw new ForbiddenException('rotation service not deleted');
  }
}
