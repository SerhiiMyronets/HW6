import {generateString} from "../../src/functions/generate-string";
import {PostInputModel} from "../../src/models/posts-models";
import {ErrorType} from "../../src/types/errors-massages-types";


export const correctBodyPost: PostInputModel = {
    title: "Title",
    shortDescription: "ShortDescription",
    content: "Content",
    blogId: "BlogId"
}
export const updatedCorrectBodyPost: PostInputModel = {
    title: "NewTitle",
    shortDescription: "NewShortDescription",
    content: "NewContent",
    blogId: "NewBlogId"
}
export const incorrectBodyPost: PostInputModel = {
    title: generateString(31),
    shortDescription: generateString(101),
    content: generateString(1001),
    blogId: ""
}
export const undefinedBodyPost: PostInputModel = {
    title: "",
    shortDescription: "",
    content: "",
    blogId: ""
}
export const errorsIncorrectInputPost: ErrorType = {
    errorsMessages: [
        {message: 'Title length should be below 30 symbols', field: 'title'},
        {message: 'ShortDescription length should be below 100 symbols', field: 'shortDescription'},
        {message: 'Content should be be below 1000 symbols', field: 'content'},
        {message: 'BlogId is required', field: 'blogId'}
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