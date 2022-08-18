import { Module } from '@nestjs/common';
import { HospitalsService } from './hospitals.service';
import { HospitalsController } from './hospitals.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Hospital, HospitalSchema } from './hospital.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Hospital.name, schema: HospitalSchema },
    ]),
  ],
  controllers: [HospitalsController],
  providers: [HospitalsService],
})
export class HospitalsModule {}
