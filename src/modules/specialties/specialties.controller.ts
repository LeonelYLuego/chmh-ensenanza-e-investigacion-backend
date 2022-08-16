import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  UsePipes,
} from '@nestjs/common';
import { ApiBearerAuth, ApiParam, ApiTags } from '@nestjs/swagger';
import {
  API_RESOURCES,
  DEFAULT_API_PATHS,
} from '@utils/constants/api-routes.constant';
import { ValidateIdPipe } from '@utils/pipes/validate-id.pipe';
import { SpecialtyDto } from './dtos/specialty.dto';
import { SpecialtiesService } from './specialties.service';
import { Specialty } from './specialty.schema';

@ApiTags('Specialties')
@Controller(API_RESOURCES.SPECIALTIES)
export class SpecialtiesController {
  constructor(private readonly specialtiesService: SpecialtiesService) {}

  @Get()
  @ApiBearerAuth()
  async find(): Promise<Specialty[]> {
    return await this.specialtiesService.find();
  }

  @Post()
  @ApiBearerAuth()
  async create(@Body() specialtyDto: SpecialtyDto): Promise<Specialty> {
    return await this.specialtiesService.create(specialtyDto);
  }

  @Put(DEFAULT_API_PATHS.BY_ID)
  @ApiBearerAuth()
  @ApiParam({ type: String, name: '_id' })
  async update(
    @Param('_id', ValidateIdPipe) _id: string,
    @Body() specialtyDto: SpecialtyDto,
  ): Promise<Specialty> {
    return await this.specialtiesService.update(_id, specialtyDto);
  }

  @Delete(DEFAULT_API_PATHS.BY_ID)
  @ApiBearerAuth()
  @ApiParam({ type: String, name: '_id' })
  async delete(@Param('_id', ValidateIdPipe) _id: string): Promise<void> {
    await this.specialtiesService.delete(_id);
  }
}
