// @ts-ignore
import request from 'supertest'
import {app, RouterPaths} from "../../src/setting";
import {PostInputModel, PostViewModel, PostViewModelPaginated} from "../../src/models/repository/posts-models";
import {correctLogin} from "../test-inputs/blogs-test-inputs";
import {generateString} from "../test-inputs/generate-string";

export const postTestRepository = {
    async get(query: object = {}): Promise<PostViewModelPaginated> {
        const result = await request(app)
            .get(RouterPaths.posts)
            .query(query)
            .expect(200)
        return result.body
    },
    async getById(
        postId: string,
        code = 200): Promise<PostViewModel> {
        const result = await request(app)
            .get(`${RouterPaths.posts}/${postId}`)
            .expect(code)
        return result.body
    },
    async createPost(
        body: PostInputModel,
        code: number = 201,
        auth: string = correctLogin
    ) : Promise<PostViewModel> {
            const result = await request(app)
                .post(RouterPaths.posts)
                .set("Authorization", auth)
                .send(body)
                .expect(code)
        return result.body
    },
    async createPosts(blogId: string, count: number): Promise<PostViewModel[]> {
        const result = []
        for (let i = 0; i < count; i++) {
            const post = await this.createPost(
                {
                    title: "PostTitle" + i,
                    shortDescription: (count - i) + generateString(20),
                    content: i + generateString(20),
                    blogId
                }
            )
            result.push(post)
        }
        return result
    },
    async getByBlogId(blogId: string,query: object = {}, code = 200): Promise<PostViewModelPaginated> {
        const result = await request(app)
            .get(`${RouterPaths.blogs}/${blogId}/Posts`)
            .query(query)
            .expect(code)
        return result.body
    },
    async createPostByBlogId(
        body: PostInputModel,
        code: number = 201,
        auth: string = correctLogin
    ) : Promise<PostViewModel> {
        let {blogId, ...newBody} = body
        const result = await request(app)
            .post(`${RouterPaths.blogs}/${blogId}/Posts`)
            .set("Authorization", auth)
            .send(newBody)
            .expect(code)
        return result.body
    },
    async createPostsByBlogId(blogId: string, count: number): Promise<PostViewModel[]> {
        const result = []
        for (let i = 0; i < count; i++) {
            const post = await this.createPostByBlogId(
                {
                    title: "PostTitle" + i,
                    shortDescription: (count - i) + generateString(20),
                    content: i + generateString(20),
                    blogId
                }
            )
            result.push(post)
        }
        return result
    },
    async update(
        postId: string,
        body: PostInputModel,
        code: number = 204,
        auth: string = correctLogin
    ) {
            return request(app)
                .put(`${RouterPaths.posts}/${postId}`)
                .set("Authorization", auth)
                .send(body)
                .expect(code)
    },
    async delete(
        postId: string,
        code = 204,
        auth: string = correctLogin) {
            return request(app)
                .delete(`${RouterPaths.posts}/${postId}`)
                .set("Authorization", auth)
                .expect(code)
    }
}

