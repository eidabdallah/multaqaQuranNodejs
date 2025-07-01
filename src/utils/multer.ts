import multer, { StorageEngine, FileFilterCallback } from 'multer';
import { Request } from 'express';
import { ApiError } from './ApiError';

export const fileMimeTypes = {
    image: ['image/png', 'image/jpeg', 'image/gif', 'image/ico', 'image/svg+xml'],
    pdf: ['application/pdf'],
    excel: ['application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'],
};

export class FileUploader {
    private allowedTypes: string[];
    private storage: StorageEngine;

    constructor(customTypes: string[] = []) {
        this.allowedTypes = customTypes;
        this.storage = multer.diskStorage({});
    }

    private fileFilter(req: Request, file: Express.Multer.File, cb: FileFilterCallback) {
        if (this.allowedTypes.includes(file.mimetype)) {
            cb(null, true);
        } else {
            cb(new ApiError('Invalid file format', 400) as any, false);
        }
    }

    getUploader() {
        return multer({
            storage: this.storage,
            fileFilter: this.fileFilter.bind(this),
        });
    }
}
