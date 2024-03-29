import { ForbiddenException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateStudentDto } from './dto/create-student.dto';
import { UpdateStudentDto } from './dto/update-student.dto';
import { Student, StudentDocument } from './student.schema';

@Injectable()
export class StudentsService {
  constructor(
    @InjectModel(Student.name) private studentsModel: Model<StudentDocument>,
  ) {}

  /**
   * Finds all Students in the database based on the specialty and generation
   * @async
   * @param {string} specialtyId _id of the specialty
   * @param {number} lastYearGeneration last year generation
   * @returns {Promise<Student[]>} the found Students
   */
  async findAll(
    specialtyId: string,
    lastYearGeneration: number,
  ): Promise<Student[]> {
    return await this.studentsModel
      .find({
        specialty: specialtyId,
        lastYearGeneration,
      })
      .populate('specialty')
      .collation({ locale: 'es' })
      .sort('firstLastName')
      .exec();
  }

  /**
   * Finds a User in the database based on the provided _id
   * @async
   * @param {string} _id _id of the Student
   * @returns {Promise<Student>} the created Student
   * @throws {ForbiddenException} Student must exists
   */
  async findOne(_id: string): Promise<Student> {
    const student = await this.studentsModel
      .findOne({ _id })
      .populate('specialty')
      .exec();
    if (student) return student;
    else throw new ForbiddenException('student not found');
  }

  /**
   * Creates a Student in the database
   * @async
   * @param {CreateStudentDto} createStudentDto Student data
   * @returns {Promise<Student>} the created Student
   */
  async create(createStudentDto: CreateStudentDto): Promise<Student> {
    const createdStudent = new this.studentsModel(createStudentDto);
    return await createdStudent.save();
  }

  /**
   * Updates a Student in the database based on the provided _id
   * @async
   * @param {string} _id _id of the Student
   * @param {UpdateStudentDto} updateStudentDto Student data
   * @returns {Promise<Student>} the modified Student
   * @throws {ForbiddenException} Student must exists
   * @throws {ForbiddenException} Student must be modified
   */
  async update(
    _id: string,
    updateStudentDto: UpdateStudentDto,
  ): Promise<Student> {
    const student = await this.findOne(_id);
    if (student) {
      if (
        (await this.studentsModel.updateOne({ _id }, updateStudentDto))
          .modifiedCount == 1
      ) {
        return await this.findOne(_id);
      } else throw new ForbiddenException('student not modified');
    } else throw new ForbiddenException('student not found');
  }

  /**
   * Deletes a Student bases on the provided _id
   * @async
   * @param {string} _id _id of the Student
   * @throws {ForbiddenException} Student must exits
   * @throws {ForbiddenException} Student must be deleted
   */
  async delete(_id: string): Promise<void> {
    const student = await this.findOne(_id);
    if (student) {
      await this.studentsModel.findOneAndDelete({ _id });
      if (await this.studentsModel.findOne({ _id }))
        throw new ForbiddenException('student not deleted');
    } else throw new ForbiddenException('student not found');
  }

  /**
   * Deletes Students bases on the provide specialty
   * @param specialty
   */
  async deleteBySpecialty(specialty: string): Promise<void> {
    const students = await this.studentsModel.find({ specialty });
    await Promise.all(
      students.map(async (student) => {
        await this.studentsModel.findOneAndDelete({ _id: student._id });
      }),
    );
  }
}
