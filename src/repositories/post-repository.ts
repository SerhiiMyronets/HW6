import {generateString} from "../functions/generate-string";
import {PostInputModel, PostViewModel} from "../models/posts-models";
import {blogsRepository} from "./blogs-repository";

const posts: PostViewModel[] =[]

export const postsRepository = {
    getAllPosts() {
        return posts
    },
    creatPost(body: PostInputModel) {
        const {title, shortDescription, content, blogId} = body

        const blog = blogsRepository.getBlogById(blogId);

        const newPost: PostViewModel = {
            id: generateString(5),
            title,
            shortDescription,
            content,
            blogId,
            blogName: blog!.name
        }
        posts.push(newPost)
        return newPost;
    },
    getPostById(id: string) {
        return posts.find(post => post.id === id)
    },
    updatePost(id: string, body: PostInputModel) {
        const {title, shortDescription, content, blogId} = body
        const post = posts.find(post => post.id === id)
        const blog = blogsRepository.getBlogById(blogId);
        if (post) {
            post.title = title
            post.shortDescription = shortDescription
            post.content = content
            post.blogId = blogId
            post.blogName = blog!.name
            return true
        } else {
            return false
        }
    },
    deletePost(id: string) {
        const indexOfDeletedObject = posts.findIndex(post => post.id === id)
        if (indexOfDeletedObject > -1) {
            posts.splice(indexOfDeletedObject, 1)
            return true
        } else {
            return false
        }
    },
    deleteAllPosts() {
        posts.length = 0
        return
    }
}