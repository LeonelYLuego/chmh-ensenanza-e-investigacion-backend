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

  async find(specialty: string): Promise<RotationService[]> {
    return await this.rotationServicesModel.find({ specialty });
  }

  async findOne(_id: string): Promise<RotationService> {
    const rotationService = await this.rotationServicesModel.findOne({ _id });
    if (!rotationService)
      throw new ForbiddenException('rotation service not found');
    return rotationService;
  }

  /**
   *
   * @param rotationServiceDto
   * @returns
   * @throws {ForbiddenException} specialty must exist
   */
  async create(
    rotationServiceDto: RotationServiceDto,
  ): Promise<RotationService> {
    await this.specialtiesService.findOne(rotationServiceDto.specialty);
    const rotationService = new this.rotationServicesModel(rotationServiceDto);
    return await rotationService.save();
  }

  /**
   * 
   * @param _id 
   * @param rotationServiceDto 
   * @returns 
   * @throws {ForbiddenException} specialty must exist
   */
  async update(
    _id: string,
    rotationServiceDto: RotationServiceDto,
  ): Promise<RotationService> {
    const rotationService = await this.rotationServicesModel.findOne({ _id });
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

  async delete(_id: string): Promise<void> {
    const rotationService = await this.rotationServicesModel.findOne({ _id });
    if (
      (await this.rotationServicesModel.deleteOne({ _id: rotationService._id }))
        .deletedCount == 0
    )
      throw new ForbiddenException('rotation service not deleted');
  }
}
