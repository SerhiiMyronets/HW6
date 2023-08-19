// @ts-ignore
import request from 'supertest'
import {app, RouterPaths} from "../../src/setting";
import {PostInputModel, PostViewModel} from "../../src/models/repository/posts-models";
import {correctLogin} from "../test-inputs/blogs-test-inputs";
import {ErrorType} from "../../src/midlewares/errors-format-middleware";

export const postTestRepository = {
    async get(postsArray: PostViewModel[] = []) {
        await request(app)
            .get(RouterPaths.posts)
            .query({"sortDirection": "asc"})
            .expect(response => {
                expect(200)
                expect(response.body.items).toEqual(postsArray)
            })
    },
    async getById(
        postId: string,
        code = 200,
        errors: ErrorType | null = null) {
        if (!errors) {
            const result = await request(app)
                .get(`${RouterPaths.posts}/${postId}`)
                .expect(code)
            return result.body
        } else {
            const result = await request(app)
                .get(`${RouterPaths.posts}/${postId}`)
                .expect(code, errors)
            return result.body
        }
    },
    async create(
        body: PostInputModel,
        code: number = 201,
        errors: ErrorType | null = null,
        auth: string = correctLogin
    ) {
        if (!errors) {
            return request(app)
                .post(RouterPaths.posts)
                .set("Authorization", auth)
                .send(body)
                .expect(code)
        } else {
            return request(app)
                .post(RouterPaths.posts)
                .set("Authorization", auth)
                .send(body)
                .expect(code, errors)
        }
    },
    async update(
        postId: string,
        body: PostInputModel,
        code: number = 204,
        errors: ErrorType | null = null,
        auth: string = correctLogin
    ) {
        if (!errors) {
            return request(app)
                .put(`${RouterPaths.posts}/${postId}`)
                .set("Authorization", auth)
                .send(body)
                .expect(code)
        } else {
            return request(app)
                .put(`${RouterPaths.posts}/${postId}`)
                .set("Authorization", auth)
                .send(body)
                .expect(code, errors)
        }
    },
    async delete(
        postId: string,
        code = 204,
        errors: ErrorType | null = null,
        auth: string = correctLogin) {
        if (!errors) {
            return request(app)
                .delete(`${RouterPaths.posts}/${postId}`)
                .set("Authorization", auth)
                .expect(code)
        } else {
            return request(app)
                .delete(`${RouterPaths.posts}/${postId}`)
                .set("Authorization", auth)
                .expect(code)
        }
    }
}

