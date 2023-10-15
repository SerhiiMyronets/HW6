import nodemailer from 'nodemailer'
import {EmailBodyModel} from "../models/repository/users-models";
import {injectable} from "inversify";

@injectable()
export class EmailAdapter  {
    async sendEmail(emailBody: EmailBodyModel) {
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: 'volkamana.test@gmail.com',
                pass: 'wlfvxkegwsypfasg'
            }
        })
        return await transporter.sendMail(emailBody)
    }
}