
import {posts} from "../routers/posts-route";
import {generateString} from "../functions/generate-string";
import {PostInputModel, PostViewModel} from "../models/posts-models";



export const postsRepository = {
    creatBlog(body: PostInputModel) {
        const {title, shortDescription, content, blogId} = body
        const newPost: PostViewModel = {
            id: generateString(5),
            title,
            shortDescription,
            content,
            blogId,
            blogName: generateString(5)
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
        if (post) {
            post.title = title
            post.shortDescription = shortDescription
            post.content = content
            post.blogId = blogId
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
    }
}