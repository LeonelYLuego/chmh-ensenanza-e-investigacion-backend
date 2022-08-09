import { ForbiddenException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CurrentUserDto, UpdateUserDto } from './dtos';
import { CreateUserDto } from './dtos/create-user.dto';
import { User, UserDocument } from './user.schema';
import * as bcrypt from 'bcryptjs';

@Injectable()
/** @class Users Service */
export class UsersService {
  constructor(
    @InjectModel(User.name) private usersModel: Model<UserDocument>,
  ) {}

  /**
   * Finds all Users in the database
   * @async
   * @function find
   * @returns {Promise<User[]>} The user found
   */
  async find(): Promise<User[]> {
    return await this.usersModel.find().exec();
  }

  /**
   * Finds one User in the database based on the _id
   * @async
   * @function findOne
   * @param {string} _id The User's _id
   * @returns {Promise<User | null>} The found User or if it doesn't find a User it returns Null
   */
  async findOne(_id: string): Promise<User | null> {
    return await this.usersModel.findById(_id).exec();
  }

  /**
   * Finds one User in the database based on the username
   * @async
   * @function findOneByUsername
   * @param {string} username The user's name
   * @returns {Promise<User | null>} The found User or if it doesn't find a User it returns Null
   */
  async findOneByUsername(username: string): Promise<null | User> {
    return await this.usersModel
      .findOne({
        username: username,
      })
      .select('+password')
      .exec();
  }

  /**
   * Creates a new User in the database
   * @async
   * @function create
   * @param {CreateUserDto} createUserDto The user's data
   * @return {Promise<User>} The created user
   * @throws {ForbiddenException} Argument createUserDto.username must not exist in the database
   */
  async create(createUserDto: CreateUserDto): Promise<User> {
    const findUser = await this.findOneByUsername(createUserDto.username);
    if (findUser) throw new ForbiddenException('user already exists');
    else {
      const hashPassword = bcrypt.hashSync(createUserDto.password, 10);
      const createdUser = new this.usersModel({
        username: createUserDto.username,
        password: hashPassword,
        administrator: createUserDto.administrator,
      });
      const newUser = await createdUser.save();
      return {
        _id: newUser._id,
        username: newUser.username,
        administrator: newUser.administrator,
        __v: newUser.__v,
      };
    }
  }

  /**
   * Update one User in the database based on the _id
   * @async
   * @function updateOne
   * @param {string} _id The User's _id
   * @param {UpdateUserDto} updateUserDto The User's data
   * @returns {Promise<User>} The updated User
   * @throws {ForbiddenException} Argument _id must exists in the database
   * @throws {ForbiddenException} User must be modified
   */
  async updateOne(_id: string, updateUserDto: UpdateUserDto): Promise<User> {
    const user = await this.findOne(_id);
    if (user) {
      const hashPassword = bcrypt.hashSync(updateUserDto.password, 10);
      if (
        (
          await this.usersModel
            .updateOne(
              { _id },
              {
                username: updateUserDto.username,
                password: hashPassword,
                administrator:
                  updateUserDto.administrator ?? user.administrator,
              },
            )
            .exec()
        ).modifiedCount == 1
      ) {
        return await this.findOne(_id);
      } else throw new ForbiddenException('user not modified');
    } else throw new ForbiddenException('user not found');
  }

  async deleteOne(_id: string, currentUser: CurrentUserDto): Promise<void> {
    const user = await this.findOne(_id);
    if (user) {
      if (user._id != currentUser._id) {
        if ((await this.usersModel.deleteOne({ _id }).exec()).deletedCount != 1)
          throw new ForbiddenException('user not deleted');
      } else
        throw new ForbiddenException('the current user can not be deleted');
    } else throw new ForbiddenException('user not found');
  }
}
