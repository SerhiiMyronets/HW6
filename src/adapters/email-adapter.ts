import nodemailer from 'nodemailer'
import {EmailBodyModel} from "../models/db-models";

export const emailAdapter = {
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