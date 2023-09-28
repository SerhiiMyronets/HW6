// type BlogsViewModel = Omit<BlogMongoDBModel, 'createdAt' | 'isMembership'>
// type PostInputModel = Omit<PostMongoDBModel, 'blogName'> & Pick<UsersMongoDBModel, 'emailConfirmation'>

//blogs db models
export type BlogMongoDBModel = {
    name: string
    description: string
    websiteUrl: string
    createdAt: Date
    isMembership: boolean
}

//posts db models
export type PostMongoDBModel = {
    title: string
    shortDescription: string
    content: string
    blogId: string
    blogName: string
    createdAt: Date
}

//users db models
export type UsersMongoDBModel = {
    accountData: AccountDataModel,
    emailConfirmation: EmailConfirmationModel
}
export type AccountDataModel = {
    login: string
    email: string
    password: string
    createdAt: Date
}
export type EmailConfirmationModel = {
    confirmationCode: string
    expirationDate: Date
    isConfirmed: boolean
}
export type PasswordRecoveryMongoDBModel = {
    userId: string
    email: string
    confirmationCode: string
    expirationDate: Date
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
    createdAt: Date
}

// email smtp models
export type EmailBodyModel = {
    from: string
    to: string
    subject: string
    html: string
}

// refresh token db models
export type DeviceAuthSessionMongoDBModel = {
    userId: string
    deviceId: string
    deviceName: string
    IP: string
    issuedAt: Date
    expiredAt: Date
}

export type ApiRequestDatabaseMongoDBModel = {
    IP: string
    URL: string
    date: Date
}