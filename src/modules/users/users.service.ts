import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateUserDto } from './dtos/create-user.dto';
import { User, UserDocument } from './user.schema';

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  //Check if user already exists
  async create(createUserDto: CreateUserDto): Promise<User> {
    const createdUser = new this.userModel(createUserDto);
    return createdUser.save();
  }

  async find(): Promise<User[]> {
    return await this.userModel.find().exec();
  }

  async findOneByUsername(username: string): Promise<null | User> {
    return await this.userModel
      .findOne({
        username: username,
      })
      .select('+password')
      .exec();
  }
}
