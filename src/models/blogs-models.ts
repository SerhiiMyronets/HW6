import {ObjectId} from "mongodb";

export type BlogViewModel = {
    id: string
    name: string
    description: string
    websiteUrl: string
    createdAt: string
    isMembership: boolean
}
export type BlogStructureMongoDB = {
    name: string
    description: string
    websiteUrl: string
    createdAt: string
    isMembership: boolean
}
export type BlogOutputMongoDB = {
    _id: ObjectId
    name: string
    description: string
    websiteUrl: string
    createdAt: string
    isMembership: boolean
}
export type BlogInputModel = {
    name: string
    description: string
    websiteUrl: string
}
export class BlogViewClass {
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
export class BlogCreatClass {
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

export class BlogUpdateClass {
    name: string
    description: string
    websiteUrl: string
    constructor(obj: BlogInputModel) {
        this.name = obj.name
        this.description = obj.description
        this.websiteUrl = obj.websiteUrl
    }
}