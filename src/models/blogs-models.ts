import {ObjectId} from "mongodb";


//presentations models
export type BlogInputModel = {
    name: string
    description: string
    websiteUrl: string
}
export type BlogPostInputModel = {
    title: string
    shortDescription: string
    content: string
}

export type BlogViewModel = {
    id: string
    name: string
    description: string
    websiteUrl: string
    createdAt: string
    isMembership: boolean
}

//mongo db models
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
/*
export class ViewBlogClass {
    id: string
    name: string
    description: string
    websiteUrl: string
    createdAt: string
    isMembership: boolean

    constructor(obj: BlogOutputMongoDB) {
        this.id = obj._id.toString()
        this.name = obj.name
        this.description = obj.description
        this.websiteUrl = obj.websiteUrl
        this.createdAt = obj.createdAt
        this.isMembership = obj.isMembership
    }
}
/*export class CreatBlogClass {
    name: string
    description: string
    websiteUrl: string
    createdAt: string
    isMembership: boolean
    constructor(obj: BlogInputModel) {
        this.name = obj.name
        this.description = obj.description
        this.websiteUrl = obj.websiteUrl
        this.createdAt = new Date().toISOString()
        this.isMembership = false
    }
}

export class UpdateBlogClass {
    name: string
    description: string
    websiteUrl: string
    constructor(obj: BlogInputModel) {
        this.name = obj.name
        this.description = obj.description
        this.websiteUrl = obj.websiteUrl
    }
}
*/
