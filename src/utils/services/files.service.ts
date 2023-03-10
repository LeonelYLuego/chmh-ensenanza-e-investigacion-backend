import {
  ForbiddenException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import * as fs from 'fs';

/** Files service */
@Injectable()
export class FilesService {
  /** Validates if the extension of the file is a pdf */
  validatePDF(file: Express.Multer.File): void {
    if (file.mimetype != 'application/pdf')
      throw new ForbiddenException('file must be a pdf');
  }

  /** Validates if the extension of the file is a pdf */
  validateDOCX(file: Express.Multer.File): void {
    if (
      file.mimetype !=
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    )
      throw new ForbiddenException('file must be a docx');
  }

  /** Deletes a file from the server */
  deleteFile(path: string): void {
    try {
      //Checks if the file to delete exits
      if (fs.existsSync(path)) {
        fs.unlinkSync(path);
      }
    } catch (err) {
      throw new InternalServerErrorException(err);
    }
  }
}
