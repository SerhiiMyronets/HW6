import {PasswordRecoveryDBType, UsersBDType} from "../db/db-models";
import {EmailAdapter} from "../adapters/email-adapter";
import {WithId} from "mongodb";
import {EmailBodyModel} from "../models/repository/users-models";
import {inject, injectable} from "inversify";

@injectable()
export class EmailManager {
    constructor(@inject(EmailAdapter) protected emailAdapter: EmailAdapter) {
    }
    async sendEmailConfirmationCode(user: WithId<UsersBDType>) {
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
        await this.emailAdapter.sendEmail(emailBody)
    }

    async sendPasswordRecoveryCode(passwordRecoveryRequest: PasswordRecoveryDBType) {
        const emailBody: EmailBodyModel = {
            from: 'Social Media <volkamana.test@gmail.com>',
            to: passwordRecoveryRequest.email,
            subject: 'Password recovery',
            html:
                `<h1>Password recovery</h1>
<p>To finish password recovery please follow the link below:
<a href='https://hw-6-git-main-serhiimyronets.vercel.app/password-recovery?recoveryCode=${passwordRecoveryRequest.confirmationCode}'>recovery password</a>
        </p>`
        }
        await this.emailAdapter.sendEmail(emailBody)
    }
}