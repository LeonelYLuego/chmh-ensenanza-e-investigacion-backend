import { ForbiddenException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { STORAGE_PATHS } from '@utils/constants';
import { FilesService } from '@utils/services';
import * as fs from 'fs';
import { ObligatoryMobilityDocumentTypes } from 'modules/obligatory-mobilities/types/obligatory-mobility-document.type';
import { OptionalMobilityDocumentTypes } from 'modules/optional-mobilities/types/optional-mobility-document.type';
import { SocialServiceDocumentTypes } from 'modules/social-services';
import { Model } from 'mongoose';
import { join } from 'path';
import * as PizZip from 'pizzip';
import { Templates, TemplatesDocument } from './template.schema';
const Docxtemplater = require('docxtemplater');

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
    });
    return await createdTemplates.save();
  }

  /**
   * Gets a template document
   * @param {'socialService'} document
   * @param {SocialServiceDocumentTypes} type document type
   * @returns
   * @throws {ForbiddenException} template must exist
   */
  async getTemplate(
    document: 'socialService' | 'optionalMobility' | 'obligatoryMobility',
    type:
      | SocialServiceDocumentTypes
      | OptionalMobilityDocumentTypes
      | ObligatoryMobilityDocumentTypes,
    table = false,
  ): Promise<any> {
    //Finds the template object
    const templates = await this.templatesModel.findOne();
    if (templates) {
      //Gets the path of the template in the server
      const documentPath = templates[document][type];
      if (documentPath) {
        //Checks if the template exists
        const documentBytes = fs.readFileSync(
          join(STORAGE_PATHS.TEMPLATES, documentPath),
        );
        if (documentBytes) {
          const zip = new PizZip(documentBytes);
          const doc = new Docxtemplater(zip, {
            paragraphLoop: true,
            linebreaks: true,
          });
          return doc;
        }
      }
    }
    throw new ForbiddenException('not template found');
  }

  /**
   * Updates a document template
   * @param {'socialService'} document
   * @param {SocialServiceDocumentTypes} type document type
   * @param {Express.Multer.File} file
   */
  async updateTemplates(
    document: string,
    type: string,
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
