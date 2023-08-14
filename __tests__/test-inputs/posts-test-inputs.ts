import {generateString} from "./generate-string";
import {PostInputModel} from "../../src/models/repository/posts-models";
import {randomObjectId} from "./blogs-test-inputs";
import {ErrorType} from "../../src/midlewares/errors-format-middleware";




export const correctBodyPost: PostInputModel = {
    title: "Title",
    shortDescription: "ShortDescription",
    content: "Content",
    blogId: ""
}
export const updatedCorrectBodyPost: PostInputModel = {
    title: "NewTitle",
    shortDescription: "NewShortDescription",
    content: "NewContent",
    blogId: ""
}
export const incorrectBodyPost: PostInputModel = {
    title: generateString(31),
    shortDescription: generateString(101),
    content: generateString(1001),
    blogId: randomObjectId
}
export const undefinedBodyPost: PostInputModel = {
    title: "",
    shortDescription: "",
    content: "",
    blogId: ""
}

export const errorsIncorrectInputId: ErrorType = {
    errorsMessages: [
        {message: 'Invalid id format', field: 'id'},
    ]
}
export const errorsIncorrectInputPost: ErrorType = {
    errorsMessages: [
        {message: 'Title length should be below 30 symbols', field: 'title'},
        {message: 'ShortDescription length should be below 100 symbols', field: 'shortDescription'},
        {message: 'Content should be be below 1000 symbols', field: 'content'},
        {message: 'Blog not found', field: 'blogId'}
    ]
}
export const errorsUndefinedInputPost: ErrorType = {
    errorsMessages: [
        {message: 'Title is required', field: 'title'},
        {message: 'ShortDescription is required', field: 'shortDescription'},
        {message: 'Content is required', field: 'content'},
        {message: 'BlogId is required', field: 'blogId'}
    ]
}

export const incorrectLogin: string = "Basic admin:qwerty"