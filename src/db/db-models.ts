import {ObjectId} from "mongodb";

type BlogsViewModel = Omit<BlogMongoDBModel, 'createdAt' | 'isMembership'>
type PostInputModel = Omit<PostMongoDBModel, 'blogName'> & Pick<UsersMongoDBModel, 'emailConfirmation'>

//blogs db models
export type BlogMongoDBModel = {
    name: string
    description: string
    websiteUrl: string
    createdAt: string
    isMembership: boolean
}

//posts db models
export type PostMongoDBModel = {
    title: string
    shortDescription: string
    content: string
    blogId: string
    blogName: string
    createdAt: string
}

//users db models
export type UsersMongoDBModel = {
    accountData: AccountDataType,
    emailConfirmation: EmailConfirmation
}
export type AccountDataType = {
    login: string
    email: string
    password: string
    createdAt: Date
}
export type EmailConfirmation = {
    confirmationCode: string
    expirationDate: Date
    isConfirmed: boolean
}
export type ConfirmationCodeUpdateType = {
    'emailConfirmation.confirmationCode': string
    'emailConfirmation.expirationDate': Date
}

//comments db models
export type CommentMongoDBModel = {
    postId: string
    content: string
    userId: string
    userLogin: string
    createdAt: string
}

// email smtp models
export type EmailBodyModel = {
    from: string
    to: string
    subject: string
    html: string
}

// refresh token db models
export type DeviceAuthSessionsModel = {
    userId: string
    deviceId: string
    deviceName: string
    IP: string
    issuedAt: Date
    expiredAt: Date
}

export type ApiRequestDatabaseModel = {
    IP: string
    URL: string
    date: Date
}