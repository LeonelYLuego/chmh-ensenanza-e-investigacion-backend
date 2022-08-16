import { ForbiddenException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { SpecialtiesService } from 'modules/specialties/specialties.service';
import { Model } from 'mongoose';
import { CreateStudentDto } from './dto/create-student.dto';
import { UpdateStudentDto } from './dto/update-student.dto';
import { Student, StudentDocument } from './student.schema';

@Injectable()
export class StudentsService {
  constructor(
    @InjectModel(Student.name) private studentsModel: Model<StudentDocument>,
    private specialtiesService: SpecialtiesService,
  ) {}

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
      .sort('name')
      .exec();
  }

  async findOne(_id: string): Promise<Student> {
    const student = await this.studentsModel
      .findOne({ _id })
      .populate('specialty')
      .exec();
    if (student) return student;
    else throw new ForbiddenException('student not found');
  }

  async create(createStudentDto: CreateStudentDto): Promise<Student> {
    const createdStudent = new this.studentsModel(createStudentDto);
    return await createdStudent.save();
  }

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

  async delete(_id: string): Promise<void> {
    const student = await this.findOne(_id);
    if (student) {
      if ((await this.studentsModel.deleteOne({ _id })).deletedCount != 1)
        throw new ForbiddenException('student not deleted');
    } else throw new ForbiddenException('student not found');
  }
}
