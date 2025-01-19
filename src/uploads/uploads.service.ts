import { Injectable } from '@nestjs/common';
import * as fs from "node:fs";
import * as PDFParser from "pdf-parse";

@Injectable()
export class UploadsService {
    async fileUpload(file: Express.Multer.File) {
        const result = await this.exportGojek(file);

        return {
            message: 'File uploaded successfully', filePath: file.path, result: result
        }
    }

    async exportGojek(file: Express.Multer.File) {
        const pdfBuffer = fs.readFileSync(file.path);
        const data = await PDFParser(pdfBuffer);

        const text = data.text.split('\n');

        let totalPaid = '';
        let order = {};
        let orderDetails: Order[] = [];

        const firstRegex = /^(\d+)([^\@]+)@Rp([\d\.]+)Rp/
        const secondRegex = /^(\d+)(.*)(?!.*%).*$/
        const priceRegex = /Rp\d+\.\d+/
        const biayaRegex = /^(.*?)(-?Rp[\d\.]+)$/;
        for (let i = 0; i < text.length; i++) {
            if (text[i].toLowerCase().includes("paid with")) {
                break;
            } else if (text[i].toLowerCase().includes("total paid")) {
                totalPaid = text[i].substring(text[i].indexOf("Rp"), text[i].length);
            } else if (text[i].match(firstRegex)) {
                const match = text[i].match(firstRegex);

                const qty = parseInt(match[1], 10);
                const name = match[2].trim();
                const price = `Rp${match[3]}`;

                orderDetails.push({ qty, name, price });
            } else if (text[i].match(secondRegex) && !text[i].includes('%')) {
                const match = text[i].match(secondRegex);

                const qty = parseInt(match[1], 10);
                const name = match[2].trim();
                let price = ''


                for (let j = i + 1; j < text.length; j++) {
                    if (text[j].match(priceRegex)) {
                        price = text[j].match(priceRegex)[0];
                        break;
                    }
                }
                orderDetails.push({ qty, name, price });
            }
            else if (text[i].match(biayaRegex) && !text[i].substring(0, 1).includes("@")) {
                const match = text[i].match(biayaRegex);

                order[match[1].trim()] = match[2];
                order["orders"] = orderDetails;

            }
        }

        return order;
    }
}
