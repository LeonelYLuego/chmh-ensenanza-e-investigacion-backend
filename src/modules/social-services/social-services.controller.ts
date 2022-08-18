import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { SocialServicesService } from './social-services.service';
import { CreateSocialServiceDto } from './dto/create-social-service.dto';
import { ApiBearerAuth } from '@nestjs/swagger';
import { SocialService } from './social-service.schema';

@Controller('social-services')
export class SocialServicesController {
  constructor(private readonly socialServicesService: SocialServicesService) {}

  @Post()
  @ApiBearerAuth()
  async create(@Body() createSocialServiceDto: CreateSocialServiceDto) : Promise<SocialService> {
    return await this.socialServicesService.create(createSocialServiceDto);
  }

  // @Get()
  // findAll() {
  //   return this.socialServicesService.findAll();
  // }

  // @Get(':id')
  // findOne(@Param('id') id: string) {
  //   return this.socialServicesService.findOne(+id);
  // }

  // @Patch(':id')
  // update(@Param('id') id: string, @Body() updateSocialServiceDto: UpdateSocialServiceDto) {
  //   return this.socialServicesService.update(+id, updateSocialServiceDto);
  // }

  // @Delete(':id')
  // remove(@Param('id') id: string) {
  //   return this.socialServicesService.remove(+id);
  // }
}
