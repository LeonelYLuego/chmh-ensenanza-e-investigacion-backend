import { Injectable } from '@nestjs/common';
import { Hospital } from 'modules/hospitals/hospital.schema';
import { PipelineStage } from 'mongoose';
import { FromPeriodToPeriodInterface } from '../interfaces/from-period-to-period.interface';

/** Social Service queries */
@Injectable()
export class SocialServicesQueries {
  /**
   * Returns the query to find social services
   * @param {FromPeriodToPeriodInterface} periods periods to find
   * @returns {PipelineStage[]} the query
   */
  find(periods: FromPeriodToPeriodInterface): PipelineStage[] {
    return [
      {
        $match: {
          $or: [
            {
              year: {
                $gt: +periods.initialYear,
                $lt: +periods.finalYear,
              },
            },
            {
              $and: [
                {
                  year: +periods.finalYear,
                },
                {
                  year: +periods.initialYear,
                },
                {
                  period: {
                    $gte: +periods.initialPeriod,
                  },
                },
                {
                  period: {
                    $lte: +periods.finalPeriod,
                  },
                },
              ],
            },
            {
              $and: [
                {
                  year: +periods.initialYear,
                },
                {
                  year: {
                    $not: { $eq: +periods.finalYear },
                  },
                },
                {
                  period: {
                    $gte: +periods.initialPeriod,
                  },
                },
              ],
            },
            {
              $and: [
                {
                  year: +periods.finalYear,
                },
                {
                  year: {
                    $not: { $eq: +periods.initialYear },
                  },
                },
                {
                  period: {
                    $lte: +periods.finalPeriod,
                  },
                },
              ],
            },
          ],
        },
      },
      {
        $lookup: {
          from: 'students',
          localField: 'student',
          foreignField: '_id',
          as: 'student',
        },
      },
      {
        $lookup: {
          from: 'specialties',
          localField: 'student.specialty',
          foreignField: '_id',
          as: 'specialty',
        },
      },
      {
        $project: {
          _id: '$_id',
          specialty: { $arrayElemAt: ['$specialty', 0] },
          period: '$period',
          year: '$year',
          hospital: '$hospital',
          presentationOfficeDocument: '$presentationOfficeDocument',
          reportDocument: '$reportDocument',
          constancyDocument: '$constancyDocument',
          student: { $arrayElemAt: ['$student', 0] },
          __v: '$__v',
        },
      },
      {
        $group: {
          _id: '$specialty._id',
          value: { $first: '$specialty.value' },
          socialServices: {
            $push: {
              _id: '$_id',
              period: '$period',
              year: '$year',
              hospital: '$hospital',
              presentationOfficeDocument: '$presentationOfficeDocument',
              reportDocument: '$reportDocument',
              constancyDocument: '$constancyDocument',
              student: {
                _id: '$student._id',
                name: '$student.name',
                firstLastName: '$student.firstLastName',
                secondLastName: '$student.secondLastName',
              },
              __v: '$__v',
            },
          },
        },
      },
    ];
  }

  /**
   * Returns the query to find the social services to generates the documents
   * @param {number} initialPeriod initial period to find
   * @param {number} initialYear initial year to find
   * @param {number} finalPeriod final year to find
   * @param {number} finalYear final year to find
   * @param {number} hospital hospital to find
   * @returns {PipelineStage[]} the query
   */
  generateDocuments(
    initialPeriod: number,
    initialYear: number,
    finalPeriod: number,
    finalYear: number,
    hospital: Hospital,
  ): PipelineStage[] {
    return [
      {
        $match: {
          $or: [
            {
              year: {
                $gt: +initialYear,
                $lt: +finalYear,
              },
            },
            {
              $and: [
                {
                  year: +finalYear,
                },
                {
                  year: +initialYear,
                },
                {
                  period: {
                    $gte: +initialPeriod,
                  },
                },
                {
                  period: {
                    $lte: +finalPeriod,
                  },
                },
              ],
            },
            {
              $and: [
                {
                  year: +initialYear,
                },
                {
                  year: {
                    $not: { $eq: +finalYear },
                  },
                },
                {
                  period: {
                    $gte: +initialPeriod,
                  },
                },
              ],
            },
            {
              $and: [
                {
                  year: +finalYear,
                },
                {
                  year: {
                    $not: { $eq: +initialYear },
                  },
                },
                {
                  period: {
                    $lte: +finalPeriod,
                  },
                },
              ],
            },
          ],
          hospital: hospital._id,
          //Aquí va el de especialidades
        },
      },
      {
        $lookup: {
          from: 'students',
          localField: 'student',
          foreignField: '_id',
          as: 'student',
        },
      },
      {
        $lookup: {
          from: 'specialties',
          localField: 'student.specialty',
          foreignField: '_id',
          as: 'specialty',
        },
      },
      {
        $project: {
          _id: '$_id',
          specialty: { $arrayElemAt: ['$specialty', 0] },
          period: '$period',
          year: '$year',
          hospital: '$hospital',
          presentationOfficeDocument: '$presentationOfficeDocument',
          reportDocument: '$reportDocument',
          constancyDocument: '$constancyDocument',
          student: { $arrayElemAt: ['$student', 0] },
          __v: '$__v',
        },
      },
    ];
  }
}
