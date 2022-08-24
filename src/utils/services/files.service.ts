import {
  ForbiddenException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import * as fs from 'fs';

@Injectable()
export class FilesService {
  validatePDF(file: Express.Multer.File): void {
    if (file.mimetype != 'application/pdf')
      throw new ForbiddenException('file must be a pdf');
  }

  deleteFile(path: string): void {
    try {
      if (fs.existsSync(path)) {
        fs.unlinkSync(path);
      }
    } catch (err) {
      throw new InternalServerErrorException(err);
    }
  }
}
