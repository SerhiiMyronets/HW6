import {ObjectId} from "mongodb";

//blogs db models
export type BlogInputMongoDB = {
    name: string
    description: string
    websiteUrl: string
    createdAt: string
    isMembership: boolean
}
export type BlogOutputMongoDB =  BlogInputMongoDB & {
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