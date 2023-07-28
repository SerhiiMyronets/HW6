import {Request} from "express";

//general
export type RequestWithParams<P> = Request<P, {}, {}, {}>
export type RequestWithBody<B> = Request<{}, {}, B, {}>
export type RequestWithParamsBody<P, B> = Request<P, {}, B, {}>
export type ErrorMessageType = {
    message: string,
    field: string
}
export type ErrorType = {
    errorsMessages: ErrorMessageType[]
}

//blog
export type BlogViewModel = {
    id: string
    name: string
    description: string
    websiteUrl: string
}
export type BlogInputModel = {
    name: string
    description: string
    websiteUrl: string
}

export type PostViewModel = {
    id: string
    title: string
    shortDescription: string
    content: string
    blogId: string
    blogName: string
}
export type PostInputModel = {
    title: string
    shortDescription: string
    content: string
    blogId: string
}