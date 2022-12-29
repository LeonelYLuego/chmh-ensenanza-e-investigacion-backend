import { Injectable } from '@nestjs/common';
import { ForbiddenException } from '@nestjs/common/exceptions';
import { InjectModel } from '@nestjs/mongoose';
import { SpecialtiesService } from '@specialties/specialties.service';
import { FilesService } from '@utils/services';
import { Model } from 'mongoose';
import { CreateObligatoryMobilityDto } from './dto/create-obligatory-mobility.dto';
import { ObligatoryMobilityByHospitalDto } from './dto/obligatory-mobility-by-hospital.dto';
import { ObligatoryMobilityIntervalDto } from './dto/obligatory-mobility-interval.dto';
import { UpdateObligatoryMobilityDto } from './dto/update-obligatory-mobility.dto';
import {
  ObligatoryMobility,
  ObligatoryMobilityDocument,
} from './obligatory-mobility.schema';

@Injectable()
export class ObligatoryMobilitiesService {
  constructor(
    @InjectModel(ObligatoryMobility.name)
    private obligatoryMobilitiesModel: Model<ObligatoryMobilityDocument>,
    private filesService: FilesService,
    private specialtiesService: SpecialtiesService,
  ) {}

  async create(
    createObligatoryMobilityDto: CreateObligatoryMobilityDto,
  ): Promise<ObligatoryMobility> {
    const obligatoryMobility = new this.obligatoryMobilitiesModel(
      createObligatoryMobilityDto,
    );
    return await obligatoryMobility.save();
  }

  async findAll(
    initialDate: Date,
    finalDate: Date,
  ): Promise<ObligatoryMobilityByHospitalDto[]> {
    let obligatoryMobilitiesByHospitalDto: ObligatoryMobilityByHospitalDto[] =
      [];
    const data = await this.obligatoryMobilitiesModel
      .find({
        date: {
          $gte: initialDate,
          $lte: finalDate,
        },
      })
      .populate('student rotationService hospital');
    const specialties = await this.specialtiesService.find();
    data.map((obligatoryMobility) => {
      let hospitalIndex = obligatoryMobilitiesByHospitalDto.findIndex(
        (hospital) => hospital._id == obligatoryMobility.hospital._id,
      );
      if (hospitalIndex == -1) {
        obligatoryMobilitiesByHospitalDto.push({
          _id: obligatoryMobility.hospital._id,
          name: obligatoryMobility.hospital.name,
          specialties: [],
        });
        hospitalIndex = obligatoryMobilitiesByHospitalDto.length - 1;
      }
      let specialtyIndex = obligatoryMobilitiesByHospitalDto[
        hospitalIndex
      ].specialties.findIndex(
        (specialty) =>
          specialty._id.toString() ==
          (obligatoryMobility.student.specialty as unknown).toString(),
      );
      if (specialtyIndex == -1) {
        const specialty = specialties.find(
          (specialty) =>
            specialty._id.toString() ==
            (obligatoryMobility.student.specialty as unknown).toString(),
        );
        if (specialty) {
          obligatoryMobilitiesByHospitalDto[hospitalIndex].specialties.push({
            _id: specialty._id,
            value: specialty.value,
            obligatoryMobilities: [],
          });
          specialtyIndex =
            obligatoryMobilitiesByHospitalDto[hospitalIndex].specialties
              .length - 1;
        } else {
          throw new ForbiddenException('specialty not found');
        }
      }
      obligatoryMobility['hospital'] = undefined;
      obligatoryMobilitiesByHospitalDto[hospitalIndex].specialties[
        specialtyIndex
      ].obligatoryMobilities.push(obligatoryMobility);
    });
    obligatoryMobilitiesByHospitalDto.sort((a, b) =>
      a.name.localeCompare(b.name),
    );
    obligatoryMobilitiesByHospitalDto.map((hospital) => {
      hospital.specialties.sort((a, b) => a.value.localeCompare(b.value));
      hospital.specialties.map((specialty) => {
        specialty.obligatoryMobilities.sort((a, b) =>
          a.student.firstLastName.localeCompare(b.student.firstLastName),
        );
      });
    });
    return obligatoryMobilitiesByHospitalDto;
  }

  async findOne(_id: string): Promise<ObligatoryMobility> {
    const obligatoryMobility = await this.obligatoryMobilitiesModel.findOne({
      _id,
    });
    if (!obligatoryMobility)
      throw new ForbiddenException('obligatory mobility not found');
    return obligatoryMobility;
  }

  async update(
    _id: string,
    updateObligatoryMobility: UpdateObligatoryMobilityDto,
  ): Promise<ObligatoryMobility> {
    await this.findOne(_id);
    if (
      (
        await this.obligatoryMobilitiesModel.updateOne(
          { _id },
          updateObligatoryMobility,
        )
      ).modifiedCount == 0
    )
      throw new ForbiddenException('obligatory mobility not modified');
    return await this.findOne(_id);
  }

  async remove(_id: string, path: string): Promise<void> {
    const obligatoryMobility = await this.findOne(_id);
    if (obligatoryMobility.evaluationDocument)
      this.filesService.deleteFile(
        `${path}/${obligatoryMobility.evaluationDocument}`,
      );
    if (obligatoryMobility.presentationOfficeDocument)
      this.filesService.deleteFile(
        `${path}/${obligatoryMobility.presentationOfficeDocument}`,
      );
    await this.obligatoryMobilitiesModel.findOneAndDelete({ _id });
    if (await this.obligatoryMobilitiesModel.findOne({ _id }))
      throw new ForbiddenException('obligatory mobility not deleted');
  }

  async interval(): Promise<ObligatoryMobilityIntervalDto> {
    const min = await this.obligatoryMobilitiesModel.findOne().sort('date');
    const max = await this.obligatoryMobilitiesModel.findOne().sort('-date');
    if (min && max) {
      return {
        initialYear: min.date.getFullYear(),
        finalYear: max.date.getFullYear(),
      };
    }
    throw new ForbiddenException('obligatory mobility interval not found');
  }
}
