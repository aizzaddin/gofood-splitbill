import {Controller, Post, UploadedFile, UseInterceptors} from '@nestjs/common';
import {UploadsService} from "./uploads.service";
import {FileInterceptor} from "@nestjs/platform-express";
import {ApiBody, ApiConsumes} from "@nestjs/swagger";

@Controller('uploads')
export class UploadsController {
    constructor(private readonly uploadsService: UploadsService) {}

    @Post()
    @ApiConsumes('multipart/form-data')
    @ApiBody({
        schema: {
            type: 'object',
            properties: {
                file: {
                    type: 'string',
                    format: 'binary',
                },
            },
        },
    })
    @UseInterceptors(FileInterceptor('file'))
    uploadFile(@UploadedFile() file: Express.Multer.File) {
        return this.uploadsService.fileUpload(file);
    }
}
