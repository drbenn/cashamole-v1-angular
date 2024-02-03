import { Address } from "nodemailer/lib/mailer"

export class MailerDto {
    from?: Address;
    recipients?: Address[];
    subject?: string;
    html?: string;
    text?: string;
}
