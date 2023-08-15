import {ObjectId} from "mongodb";

//blogs db models
export type BlogInputMongoDB = {
    name: string
    description: string
    websiteUrl: string
    createdAt: string
    isMembership: boolean
}
export type BlogViewMongoDB =  BlogInputMongoDB & {
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

export type UsersInputMongoDB = {
    login: string
    email: string
    password: string
    createdAt: string
}

export type UsersViewMongoDB = {
    _id: ObjectId
    login: string
    email: string
    password: string
    createdAt: string
}