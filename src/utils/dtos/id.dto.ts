import { IsDefined, IsMongoId } from 'class-validator';

/** @class Validates a Mongoose _id */
export class IdDto {
  @IsDefined()
  @IsMongoId()
  _id: string;
}
