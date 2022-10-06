import { Injectable } from '@nestjs/common';
import { Hospital } from 'modules/hospitals/hospital.schema';

@Injectable()
export class SocialServicesQueries {
  find(
    initialPeriod: number,
    initialYear: number,
    finalPeriod: number,
    finalYear: number,
  ): any {
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

  generateDocuments(
    initialPeriod: number,
    initialYear: number,
    finalPeriod: number,
    finalYear: number,
    hospital: Hospital,
  ): any {
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
            //Aquí va el de especialties
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
