import {EmailBodyType, UsersViewMongoDB} from "../models/db-models";
import {emailAdapter} from "../adapters/email-adapter";

export const emailManager = {
    async sendEmailConfirmation(user: UsersViewMongoDB) {
        const emailBody: EmailBodyType = {
            from: 'Social Media <volkamana.test@gmail.com>',
            to: user.accountData.email,
            subject: 'Email confirmation',
            html: `<h1>Thank for your registration</h1>
 <p>To finish registration please follow the link below:
     <a href='https://hw-6-git-main-serhiimyronets.vercel.app/confirm-email?code=${user.emailConfirmation.confirmationCode}'>complete registration</a>
 </p>`
        }
        await emailAdapter.sendEmail(emailBody)
    }
}