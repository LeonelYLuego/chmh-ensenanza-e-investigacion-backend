import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { STORAGE_PATHS } from '@utils/constants/storage.constant';
import * as fs from 'fs';
import { Model } from 'mongoose';
import { join } from 'path';
import { TemplatesDocument, Templates } from './template.schema';
import { FilesService } from '@utils/services/files.service';
import * as PizZip from 'pizzip';
const Docxtemplater = require('docxtemplater');

@Injectable()
export class TemplatesService {
  constructor(
    @InjectModel(Templates.name)
    private templatesModel: Model<TemplatesDocument>,
    private filesService: FilesService,
  ) {}

  private async createTemplates(): Promise<Templates> {
    const createdTemplates = new this.templatesModel({
      socialService: {},
    });
    return await createdTemplates.save();
  }

  async updateTemplates(
    document: string,
    type: string,
    file: Express.Multer.File,
  ) {
    let templates: Templates = await this.templatesModel.findOne();
    if (!templates) templates = await this.createTemplates();
    if (templates[document][type]) {
      this.filesService.deleteFile(
        join(STORAGE_PATHS.TEMPLATES, templates[document][type]),
      );
    }
    templates[document][type] = file.filename;
    await this.templatesModel.updateOne({ _id: templates._id }, templates);
  }

  async getDocument(document: string, type: string) {
    const templates = await this.templatesModel.findOne();
    const documentPath = templates[document][type];
    const documentBytes = fs.readFileSync(
      join(STORAGE_PATHS.TEMPLATES, documentPath),
    );
    const zip = new PizZip(documentBytes);
    const doc = new Docxtemplater(zip, {
      paragraphLoop: true,
      linebreaks: true,
    });
    doc.render({
      text: 'John',
      juan: 'Juan',
    });
    const buf = doc.getZip().generate({
      type: 'nodebuffer',
      compression: 'DEFLATE',
    });
    fs.writeFileSync(join(STORAGE_PATHS.TEMPLATES, 'test.docx'), buf);
  }
}
