import { Injectable, ForbiddenException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { SpecialtiesService } from '@specialties/specialties.service';
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
    return await this.rotationServicesModel.find({ specialty });
  }

  /**
   * Finds a Rotation Service in the database by Id
   * @param _id
   * @returns {RotationService} The found Rotation Service
   * @throws {ForbiddenException} Rotation Service must exist
   */
  async findOne(_id: string): Promise<RotationService> {
    const rotationService = await this.rotationServicesModel.findOne({ _id });
    if (!rotationService)
      throw new ForbiddenException('rotation service not found');
    return rotationService;
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
}
