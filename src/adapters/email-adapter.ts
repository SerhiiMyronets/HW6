import nodemailer from 'nodemailer'

export const emailAdapter = {
    async sendEmail(email: string, message: string, subject: string) {

        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: 'volkamana.test@gmail.com',
                pass: 'wlfvxkegwsypfasg'
            }
        })
        const info = await transporter.sendMail({
            from: '"Me" <volkamana.test@gmail.com>',
            to: email,
            subject: subject,
            html: message
        })
        return info
    }
}