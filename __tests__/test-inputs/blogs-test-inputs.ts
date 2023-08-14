import {generateString} from "./generate-string";
import {BlogInputModel} from "../../src/models/repository/blogs-models";
import {ObjectId} from "mongodb";
import {auth} from "../../src/setting";
import {ErrorType} from "../../src/midlewares/errors-format-middleware";

export const randomObjectId = new ObjectId().toString()
export const correctBodyBlog: BlogInputModel = {
    name: "Name",
    description: "Description",
    websiteUrl: "WebsiteUrl.com"
}
export const updatedCorrectBodyBlog: BlogInputModel = {
    name: "newName",
    description: "newDescription",
    websiteUrl: "newWebsiteUrl.com"
}

export const incorrectBodyBlog: BlogInputModel = {
    name: generateString(16),
    description: generateString(501),
    websiteUrl: generateString(10),
}
export const undefinedBodyBlog: BlogInputModel = {
    name: "",
    description: "",
    websiteUrl: ""
}

export const errorsIncorrectInputId: ErrorType = {
    errorsMessages: [
        {message: 'Invalid id format', field: 'id'},
    ]
}
export const errorsIncorrectInputBlog: ErrorType = {
    errorsMessages: [
        {message: 'Name length should be below 15 symbols', field: 'name'},
        {message: 'Description length should be below 500 symbols', field: 'description'},
        {message: 'WebsiteUrl should be in URL format', field: 'websiteUrl'}
    ]
}
export const errorsUndefinedInputBlog: ErrorType = {
    errorsMessages: [
        {message: 'Name is required', field: 'name'},
        {message: 'Description is required', field: 'description'},
        {message: 'WebsiteUrl is required', field: 'websiteUrl'}
    ]
}

export const incorrectLogin: string = "Basic admin:qwerty"
export const correctLogin: string = "Basic " + btoa(`${auth.login}:${auth.password}`)


