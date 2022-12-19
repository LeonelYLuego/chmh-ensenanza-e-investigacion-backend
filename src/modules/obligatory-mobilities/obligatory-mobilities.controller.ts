import {
  Controller,
  Body,
  Query,
  Param,
  Post,
  Get,
  Put,
  Delete,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiForbiddenResponse,
  ApiOkResponse,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';
import { API_ENDPOINTS, STORAGE_PATHS } from '@utils/constants';
import { HttpResponse } from '@utils/dtos';
import { ValidateIdPipe } from '@utils/pipes';
import { ValidateDatePipe } from '@utils/pipes/validate-date.pipe';
import { CreateObligatoryMobilityDto } from './dto/create-obligatory-mobility.dto';
import { ObligatoryMobilityBySpecialtyDto } from './dto/obligatory-mobility-by-specialty.dto';
import { ObligatoryMobilityIntervalDto } from './dto/obligatory-mobility-interval.dto';
import { UpdateObligatoryMobilityDto } from './dto/update-obligatory-mobility.dto';
import { ObligatoryMobilitiesService } from './obligatory-mobilities.service';
import { ObligatoryMobility } from './obligatory-mobility.schema';

@ApiTags('Obligatory Mobilities')
@Controller(API_ENDPOINTS.OBLIGATORY_MOBILITIES.BASE_PATH)
export class ObligatoryMobilitiesController {
  constructor(
    private readonly obligatoryMobilitiesService: ObligatoryMobilitiesService,
  ) {}

  @Post()
  @ApiBearerAuth()
  @ApiBody({ type: CreateObligatoryMobilityDto })
  async create(
    @Body() createObligatoryMobilityDto: CreateObligatoryMobilityDto,
  ): Promise<HttpResponse<ObligatoryMobility>> {
    return {
      data: await this.obligatoryMobilitiesService.create(
        createObligatoryMobilityDto,
      ),
    };
  }

  @Get(API_ENDPOINTS.OBLIGATORY_MOBILITIES.INTERVAL)
  @ApiBearerAuth()
  @ApiOkResponse({ type: ObligatoryMobilityIntervalDto })
  @ApiForbiddenResponse({
    description: '`obligatory mobility interval not found`',
  })
  async interval(): Promise<HttpResponse<ObligatoryMobilityIntervalDto>> {
    return {
      data: await this.obligatoryMobilitiesService.interval(),
    };
  }

  @Get()
  @ApiBearerAuth()
  @ApiQuery({ name: 'initialDate', type: Date })
  @ApiQuery({ name: 'finalDate', type: Date })
  async findAll(
    @Query('initialDate', ValidateDatePipe) initialDate: Date,
    @Query('finalDate', ValidateDatePipe) finalDate: Date,
  ): Promise<HttpResponse<ObligatoryMobilityBySpecialtyDto[]>> {
    return {
      data: await this.obligatoryMobilitiesService.findAll(
        initialDate,
        finalDate,
      ),
    };
  }

  @Get(`:${API_ENDPOINTS.OBLIGATORY_MOBILITIES.BY_ID}`)
  @ApiBearerAuth()
  async findOne(
    @Param(API_ENDPOINTS.OPTIONAL_MOBILITIES.BY_ID, ValidateIdPipe) _id: string,
  ): Promise<HttpResponse<ObligatoryMobility>> {
    return {
      data: await this.obligatoryMobilitiesService.findOne(_id),
    };
  }

  @Put(`:${API_ENDPOINTS.OBLIGATORY_MOBILITIES.BY_ID}`)
  @ApiBearerAuth()
  @ApiBody({ type: UpdateObligatoryMobilityDto })
  async update(
    @Param(API_ENDPOINTS.OBLIGATORY_MOBILITIES.BY_ID, ValidateIdPipe)
    _id: string,
    @Body() updateObligatoryMobility: UpdateObligatoryMobilityDto,
  ): Promise<HttpResponse<ObligatoryMobility>> {
    return {
      data: await this.obligatoryMobilitiesService.update(
        _id,
        updateObligatoryMobility,
      ),
    };
  }

  @Delete(`:${API_ENDPOINTS.OBLIGATORY_MOBILITIES.BY_ID}`)
  @ApiBearerAuth()
  async remove(
    @Param(API_ENDPOINTS.OBLIGATORY_MOBILITIES.BY_ID, ValidateIdPipe)
    _id: string,
  ): Promise<HttpResponse<undefined>> {
    await this.obligatoryMobilitiesService.remove(
      _id,
      STORAGE_PATHS.OBLIGATORY_MOBILITIES,
    );
    return {};
  }
}
