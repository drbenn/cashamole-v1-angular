import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {

  constructor(private readonly mailerService: MailerService) {}

  getHello()  {
    return [{duh: 'Hello World!'}];
  }

  sendMail(): void {
    this.mailerService.sendMail({
      // mailintor.com for good smtp/sms testing
      to: 'to.user.name@gmail.com',
      from: 'from.user.name@gmail.com',
      subject: 'Testing Nest MailerModule Email From Cashamole',
      text: 'welcome to cashamole',
      html: '<b>welcome to sending email via nestjs MailerModule</b>',
    })
  }
}
