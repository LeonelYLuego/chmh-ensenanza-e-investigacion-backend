import { Injectable } from '@nestjs/common';
import { InjectConnection } from '@nestjs/mongoose';
import { Connection } from 'mongoose';
import { createModel } from 'mongoose-gridfs';

@Injectable()
export class FilesService {
    upload(file: Express.Multer.File): any {
        const response = {
            originalname: file.originalname,
            filename: file.filename
        }
        return response;
    }
}
