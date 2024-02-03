import { Injectable } from '@nestjs/common';

import * as nodemailer from 'nodemailer';
import Mail from 'nodemailer/lib/mailer';
import { MailerDto } from './mailer-dto/mailer-dto';
import { ISendMailOptions, MailerService } from '@nestjs-modules/mailer';

@Injectable()
export class SmtpMailerService {

    // private mailTransport() {
    //     const transporter = nodemailer.createTransport({
    //           host: process.env.SMTP_HOST,
    //           port: parseInt(process.env.SMTP_PORT), 
    //           secure: false,
    //           auth: {
    //             user: process.env.SMTP_USER,
    //             pass: process.env.PASSWORD,
    //           },
    //     });
    //     return transporter;
    // };

    constructor(private readonly mailerService: MailerService) {}

    async sendEmail({ dto }: { dto: MailerDto }) {
        const { recipients } = dto;
        // const transport = this.mailTransport();
        const options: ISendMailOptions = {
            from: {
                name: process.env.APP_NAME,
                address: process.env.DEFAULT_MAIL_FROM
            },
            to: recipients,
            subject: 'Welcome to Cashamole',
            html: `<p><strong>Hello  ${recipients[0].name},</strong> You have registered at Cashamole.com, your username is ${recipients[0].name}</p><p>Cheers!</p>`,
        };

        this.mailerService.sendMail(options)
            .then((success) => {
                console.log('==================MAILER RESULTS - SUCCESS  ==================');
                console.log(success);
                console.log('==================MAILER RESULTS - SUCCESS  END ==================');
            })
            .catch((err: Error) => {
                console.log('==================MAILER RESULTS - ERROR  ==================');
                console.error(err)
                console.log('==================MAILER RESULTS - ERROR END  ==================');
            })


        // try {
        //     const results = await transport.sendMail(options);
        //     console.log('==================MAILER RESULTS==================');
        //     console.log(results);
        //     return results;
        // } catch (error) {
        //     console.log('Error: ', error);
        // };
        
    }






}
