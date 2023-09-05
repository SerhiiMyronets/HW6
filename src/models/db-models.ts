import {ObjectId} from "mongodb";

//blogs db models
export type BlogInputMongoDB = {
    name: string
    description: string
    websiteUrl: string
    createdAt: string
    isMembership: boolean
}
export type BlogViewMongoDB = BlogInputMongoDB & {
    _id: ObjectId
}
//posts db models
export type PostInputMongoDB = {
    title: string
    shortDescription: string
    content: string
    blogId: string
    blogName: string
    createdAt: string
}
export type PostViewMongoDB = PostInputMongoDB & {
    _id: ObjectId
}
//users db models
export type UsersViewMongoDB = UsersInputMongoDB & {
    _id: ObjectId
}
export type UsersInputMongoDB = {
    accountData: AccountDataType,
    emailConfirmation: EmailConfirmation
}
export type AccountDataType = {
    login: string
    email: string
    password: string
    createdAt: string
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
export type CommentInputMongoDB = {
    postId: string
    content: string
    userId: string
    userLogin: string
    createdAt: string
}

export type CommentViewMongoDB = CommentInputMongoDB & {
    _id: ObjectId
}

// email type
export type EmailBodyType = {
    from: string
    to: string
    subject: string
    html: string
}