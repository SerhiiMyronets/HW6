import {EmailBodyModel, UsersMongoDBModel} from "../db/db-models";
import {emailAdapter} from "../adapters/email-adapter";
import {WithId} from "mongodb";

export const emailManager = {
    async sendEmailConfirmationCode(user: WithId<UsersMongoDBModel>) {
        const emailBody: EmailBodyModel = {
            from: 'Social Media <volkamana.test@gmail.com>',
            to: user.accountData.email,
            subject: 'Email confirmation',
            html:
`<h1>Thank for your registration</h1>
<p>To finish registration please follow the link below:
<a href='https://hw-6-git-main-serhiimyronets.vercel.app/confirm-email?code=${user.emailConfirmation.confirmationCode}'>complete registration</a>
 </p>`
        }
        await emailAdapter.sendEmail(emailBody)
    },
    async sendPasswordRecoveryCode(user: UsersMongoDBModel) {
        const emailBody: EmailBodyModel = {
            from: 'Social Media <volkamana.test@gmail.com>',
            to: user.accountData.email,
            subject: 'Password recovery',
            html:
`<h1>Password recovery</h1>
<p>To finish password recovery please follow the link below:
<a href='https://hw-6-git-main-serhiimyronets.vercel.app/password-recovery?recoveryCode=${user.passwordRecovery.confirmationCode}'>recovery password</a>
        </p>`
        }
        await emailAdapter.sendEmail(emailBody)
    }
}