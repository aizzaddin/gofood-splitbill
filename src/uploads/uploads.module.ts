import { Module } from '@nestjs/common';
import { UploadsService } from './uploads.service';
import { UploadsController } from './uploads.controller';
import {MulterModule} from "@nestjs/platform-express";
import {diskStorage} from "multer";

@Module({
  providers: [UploadsService],
  controllers: [UploadsController],
  imports: [
      MulterModule.register({
        storage: diskStorage({
          destination: './public',
          filename: (req, file, cb) => {
              const filename = `${Date.now()}-${file.originalname}`;
              cb(null, filename);
          }
        })
      })
  ]
})
export class UploadsModule {}
