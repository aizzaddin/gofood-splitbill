import { Injectable } from '@nestjs/common';

@Injectable()
export class UploadsService {
    fileUpload(file: Express.Multer.File) {
        return {
            message: 'File uploaded successfully', filePath: file.path
        }
    }
}
