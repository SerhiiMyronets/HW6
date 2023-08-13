import {ObjectId} from "mongodb";

//presentation models
export type PostInputModel = {
    title: string
    shortDescription: string
    content: string
    blogId: string
}
export type PostViewModel = {
    id: string
    title: string
    shortDescription: string
    content: string
    blogId: string
    blogName: string
    createdAt: string
}

//mongo db models
export type PostInputMongoDB = {
    title: string
    shortDescription: string
    content: string
    blogId: string
    blogName: string
    createdAt: string
}
export type PostOutputMongoDB = PostInputMongoDB & {
    _id: ObjectId
}
/*
export class PostViewClass {
    id: string
    title: string
    shortDescription: string
    content: string
    blogId: string
    blogName: string
    createdAt: string

    constructor(obj: PostOutputMongoDB) {
        this.id = obj._id.toString()
        this.title = obj.title
        this.shortDescription = obj.shortDescription
        this.content = obj.content
        this.blogId = obj.blogId
        this.blogName = obj.blogName
        this.createdAt = obj.createdAt
    }
}

export class PostCreatClass {
    title: string
    shortDescription: string
    content: string
    blogId: string
    blogName: string
    createdAt: string

    constructor(obj: PostInputModel, blogName: string) {
        this.title = obj.title
        this.shortDescription = obj.shortDescription
        this.content = obj.content
        this.blogId = obj.blogId
        this.blogName = blogName
        this.createdAt = new Date().toISOString()
    }
}

export class PostUpdateClass {
    title: string
    shortDescription: string
    content: string
    blogId: string
    blogName: string

    constructor(obj: PostInputModel, blogName: string) {
        this.title = obj.title
        this.shortDescription = obj.shortDescription
        this.content = obj.content
        this.blogId = obj.blogId
        this.blogName = blogName
    }
}
*/
