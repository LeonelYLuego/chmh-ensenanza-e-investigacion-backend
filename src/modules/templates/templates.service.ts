import { ForbiddenException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { STORAGE_PATHS } from '@utils/constants';
import { FilesService } from '@utils/services';
import * as fs from 'fs';
import { Model } from 'mongoose';
import { join } from 'path';
import { Templates, TemplatesDocument } from './template.schema';

/** Template service */
@Injectable()
export class TemplatesService {
  constructor(
    @InjectModel(Templates.name)
    private templatesModel: Model<TemplatesDocument>,
    private filesService: FilesService,
  ) {}

  /** Creates a new template */
  private async createTemplates(): Promise<Templates> {
    const createdTemplates = new this.templatesModel({
      socialService: {},
      optionalMobility: {},
      obligatoryMobility: {},
      incomingStudent: {},
    });
    return await createdTemplates.save();
  }

  /**
   * Gets a document template from the database
   * @param document
   * @param type
   * @returns the found document
   * @throws {ForbiddenException} template must exist
   */
  async getDocument(
    document:
      | 'socialService'
      | 'optionalMobility'
      | 'obligatoryMobility'
      | 'incomingStudent',
    type:
      | 'solicitudeDocument'
      | 'presentationOfficeDocument'
      | 'acceptanceDocument',
  ): Promise<Buffer> {
    const templates = await this.templatesModel.findOne();
    if (templates) {
      //Gets the path of the template
      const documentPath = templates[document][type];
      if (documentPath) {
        const documentBytes = fs.readFileSync(
          join(STORAGE_PATHS.TEMPLATES, documentPath),
        );
        if (documentBytes) return documentBytes;
      }
    }
    throw new ForbiddenException('not template found');
  }

  /**
   * Updates a document template
   * @param {'socialService'} document
   * @param {SocialServiceDocumentTypes} type document type
   * @param {Express.Multer.File} file
   * @throws
   */
  async updateTemplates(
    document:
      | 'socialService'
      | 'optionalMobility'
      | 'obligatoryMobility'
      | 'incomingStudent',
    type:
      | 'solicitudeDocument'
      | 'presentationOfficeDocument'
      | 'acceptanceDocument',
    file: Express.Multer.File,
  ) {
    //Finds the template object
    try {
      this.filesService.validateDOCX(file);
      let templates: Templates = await this.templatesModel.findOne();
      if (!templates) templates = await this.createTemplates();
      //If a template already exist, deletes it
      if (templates[document][type]) {
        this.filesService.deleteFile(
          join(STORAGE_PATHS.TEMPLATES, templates[document][type]),
        );
      }
      //Updates the template name
      templates[document][type] = file.filename;
      await this.templatesModel.updateOne({ _id: templates._id }, templates);
    } catch (ex) {
      this.filesService.deleteFile(
        join(STORAGE_PATHS.TEMPLATES, file.filename),
      );
      throw ex;
    }
  }
}
