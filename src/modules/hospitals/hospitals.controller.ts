import {
  Controller,
  Get,
  Post,
  Body,
  Put,
  Param,
  Delete,
} from '@nestjs/common';
import { HospitalsService } from './hospitals.service';
import { CreateHospitalDto } from './dto/create-hospital.dto';
import { UpdateHospitalDto } from './dto/update-hospital.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import {
  API_RESOURCES,
  DEFAULT_API_PATHS,
} from '@utils/constants/api-routes.constant';
import { Hospital } from './hospital.schema';
import { ValidateIdPipe } from '@utils/pipes/validate-id.pipe';

@ApiTags('Hospitals')
@Controller(API_RESOURCES.HOSPITALS)
export class HospitalsController {
  constructor(private readonly hospitalsService: HospitalsService) {}

  @Post()
  @ApiBearerAuth()
  async create(
    @Body() createHospitalDto: CreateHospitalDto,
  ): Promise<Hospital> {
    return await this.hospitalsService.create(createHospitalDto);
  }

  @Get()
  @ApiBearerAuth()
  async findAll(): Promise<Hospital[]> {
    return await this.hospitalsService.findAll();
  }

  @Get(DEFAULT_API_PATHS.BY_ID)
  @ApiBearerAuth()
  async findOne(@Param('_id', ValidateIdPipe) _id: string): Promise<Hospital> {
    return await this.hospitalsService.findOne(_id);
  }

  @Put(DEFAULT_API_PATHS.BY_ID)
  @ApiBearerAuth()
  async update(
    @Param('_id', ValidateIdPipe) _id: string,
    @Body() updateHospitalDto: UpdateHospitalDto,
  ): Promise<Hospital> {
    return await this.hospitalsService.update(_id, updateHospitalDto);
  }

  @Delete(DEFAULT_API_PATHS.BY_ID)
  @ApiBearerAuth()
  async remove(@Param('_id', ValidateIdPipe) _id: string): Promise<void> {
    await this.hospitalsService.remove(_id);
  }
}
