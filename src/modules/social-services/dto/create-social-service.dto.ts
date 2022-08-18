import { ApiProperty } from '@nestjs/swagger';
import { IsDefined, IsMongoId, IsNumber, Max, Min } from 'class-validator';

export class CreateSocialServiceDto {
  @ApiProperty({
    type: String,
    description: 'Social Service student _id',
  })
  @IsDefined()
  @IsMongoId()
  student: string;

  @ApiProperty({
    type: String,
    description: 'Social Service hospital _id',
  })
  @IsDefined()
  @IsMongoId()
  hospital: string;

  @ApiProperty({
    type: Number,
    enum: [0, 1, 2],
    description:
      'Social Service period: `0` = March - June, `1` = July - October, `2` = November - February',
  })
  @IsDefined()
  @IsNumber()
  @Min(0)
  @Max(2)
  period: 0 | 1 | 2;

  @ApiProperty({
    type: Number,
    minimum: 1990,
    maximum: 2100,
    description: 'Social Service period year',
  })
  @IsDefined()
  @IsNumber()
  @Min(1990)
  @Max(2100)
  year: Number;
}
