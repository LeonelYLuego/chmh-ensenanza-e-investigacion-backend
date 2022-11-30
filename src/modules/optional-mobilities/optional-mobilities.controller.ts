import {
  Controller,
  Get,
  Post,
  Body,
  Put,
  Param,
  Delete,
  Query,
} from '@nestjs/common';
import { OptionalMobilitiesService } from './optional-mobilities.service';
import { CreateOptionalMobilityDto } from './dto/create-optional-mobility.dto';
import { UpdateOptionalMobilityDto } from './dto/update-optional-mobility.dto';
import {
  ApiBearerAuth,
  ApiBody,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiParam,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';
import { API_ENDPOINTS } from '@utils/constants';
import { HttpResponse } from '@utils/dtos';
import { OptionalMobility } from './optional-mobility.schema';
import { ValidateIdPipe } from '@utils/pipes';
import { OptionalMobilityIntervalInterface } from './interfaces/optional-mobility-interval.interface';
import { ValidateDatePipe } from '@utils/pipes/validate-date.pipe';
import { OptionalMobilityBySpecialtyDto } from '.';

@ApiTags('Optional Mobilities')
@Controller(API_ENDPOINTS.OPTIONAL_MOBILITIES.BASE_PATH)
export class OptionalMobilitiesController {
  constructor(
    private readonly optionalMobilitiesService: OptionalMobilitiesService,
  ) {}

  @Post()
  @ApiBearerAuth()
  @ApiCreatedResponse({ type: OptionalMobility })
  @ApiBody({ type: CreateOptionalMobilityDto })
  async create(
    @Body() createOptionalMobilityDto: CreateOptionalMobilityDto,
  ): Promise<HttpResponse<OptionalMobility>> {
    return {
      data: await this.optionalMobilitiesService.create(
        createOptionalMobilityDto,
      ),
    };
  }

  @Get(API_ENDPOINTS.OPTIONAL_MOBILITIES.INTERVAL)
  @ApiBearerAuth()
  @ApiOkResponse({
    type: OptionalMobilityIntervalInterface,
  })
  async interval(): Promise<HttpResponse<OptionalMobilityIntervalInterface>> {
    return {
      data: await this.optionalMobilitiesService.interval(),
    };
  }

  @Get()
  @ApiBearerAuth()
  @ApiQuery({ name: 'initialDate', type: Date })
  @ApiQuery({ name: 'finalDate', type: Date })
  @ApiOkResponse({ type: [OptionalMobility] })
  async findAll(
    @Query('initialDate', ValidateDatePipe) initialDate: Date,
    @Query('finalDate', ValidateDatePipe) finalDate: Date,
  ): Promise<HttpResponse<OptionalMobilityBySpecialtyDto[]>> {
    return {
      data: await this.optionalMobilitiesService.findAll(
        initialDate,
        finalDate,
      ),
    };
  }

  @Get(`:${API_ENDPOINTS.OPTIONAL_MOBILITIES.BY_ID}`)
  @ApiBearerAuth()
  @ApiOkResponse({ type: OptionalMobility })
  async findOne(
    @Param(API_ENDPOINTS.OPTIONAL_MOBILITIES.BY_ID, ValidateIdPipe) _id: string,
  ): Promise<HttpResponse<OptionalMobility>> {
    return {
      data: await this.optionalMobilitiesService.findOne(_id),
    };
  }

  @Put(`:${API_ENDPOINTS.OPTIONAL_MOBILITIES.BY_ID}`)
  @ApiBearerAuth()
  @ApiOkResponse({ type: OptionalMobility })
  @ApiBody({ type: UpdateOptionalMobilityDto })
  async update(
    @Param(API_ENDPOINTS.OPTIONAL_MOBILITIES.BY_ID, ValidateIdPipe) _id: string,
    @Body() updateOptionalMobilityDto: UpdateOptionalMobilityDto,
  ): Promise<HttpResponse<OptionalMobility>> {
    return {
      data: await this.optionalMobilitiesService.update(
        _id,
        updateOptionalMobilityDto,
      ),
    };
  }

  @Delete(`:${API_ENDPOINTS.OPTIONAL_MOBILITIES.BY_ID}`)
  @ApiBearerAuth()
  @ApiOkResponse()
  async remove(
    @Param(API_ENDPOINTS.OPTIONAL_MOBILITIES.BY_ID, ValidateIdPipe) _id: string,
  ): Promise<HttpResponse<undefined>> {
    await this.optionalMobilitiesService.remove(_id);
    return {};
  }
}
