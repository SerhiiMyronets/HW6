import {blogs} from "../routers/blogs-route";
import {generateString} from "../functions/generate-string";
import {BlogInputModel, BlogViewModel} from "../models/blogs-models";


export const blogsRepository = {
    creatBlog(body: BlogInputModel) {
        const {name, description, websiteUrl} = body
        const newBlog: BlogViewModel = {
            id: generateString(5),
            name,
            description,
            websiteUrl
        }
        blogs.push(newBlog)
        return newBlog;
    },
    getBlogById(id: string) {
        return blogs.find(blog => blog.id === id)
    },
    updateBlog(id: string, body: BlogInputModel) {
        const {name, description, websiteUrl} = body
        const blog = blogs.find(blog => blog.id === id)
        if (blog) {
            blog.name = name
            blog.description = description
            blog.websiteUrl = websiteUrl
            return true
        } else {
            return false
        }
    },
    deleteBlog(id: string) {
        const indexOfDeletedObject = blogs.findIndex(blog => blog.id === id)
        if (indexOfDeletedObject > -1) {
            blogs.splice(indexOfDeletedObject, 1)
            return true
        } else {
            return false
        }
    }
}