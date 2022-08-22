import { ApiProperty } from '@nestjs/swagger';
import { IsMongoId, IsNumber, IsOptional, Max, Min } from 'class-validator';

export class UpdateSocialServiceDto {
  @ApiProperty({
    type: String,
    description: 'Social Service hospital _id',
  })
  @IsOptional()
  @IsMongoId()
  hospital?: string;

  @ApiProperty({
    type: Number,
    enum: [0, 1, 2],
    description:
      'Social Service period: `0` = March - June, `1` = July - October, `2` = November - February',
  })
  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(2)
  period?: 0 | 1 | 2;

  @ApiProperty({
    type: Number,
    minimum: 1990,
    maximum: 2100,
    description: 'Social Service period year',
  })
  @IsOptional()
  @IsNumber()
  @Min(1990)
  @Max(2100)
  year: Number;
}
