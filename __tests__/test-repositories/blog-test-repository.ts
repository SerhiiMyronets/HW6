// @ts-ignore
import request from 'supertest'
import {app, RouterPaths} from "../../src/setting";
import {BlogInputModel} from "../../src/models/repository/blogs-models";
import {correctLogin} from "../test-inputs/blogs-test-inputs";
import {ErrorType} from "../../src/midlewares/errors-format-middleware";

export const blogTestRepository = {
    async get(blogsArray: BlogInputModel[] = []) {
        await request(app)
            .get(RouterPaths.blogs)
            .query({"sortDirection": "asc"})
            .expect(response => {
                expect(200)
                expect(response.body.items).toEqual(blogsArray)
            })
    },
    async getById(
        BlogId: string,
        code = 200,
        errors: ErrorType | null = null) {
        if (!errors) {
            const result = await request(app)
                .get(`${RouterPaths.blogs}/${BlogId}`)
                .expect(code)
            return result.body
        } else {
            const result = await request(app)
                .get(`${RouterPaths.blogs}/${BlogId}`)
                .expect(code, errors)
            return result.body
        }
    },
    async create(
        body: BlogInputModel,
        code: number = 201,
        errors: ErrorType | null = null,
        auth: string = correctLogin
    ) {
        if (!errors) {
            return request(app)
                .post(RouterPaths.blogs)
                .set("Authorization", auth)
                .send(body)
                .expect(code)
        } else {
            return request(app)
                .post(RouterPaths.blogs)
                .set("Authorization", auth)
                .send(body)
                .expect(code, errors)
        }
    },
    async update(
        blogId: string,
        body: BlogInputModel,
        code: number = 204,
        errors: ErrorType | null = null,
        auth: string = correctLogin
    ) {
        if (!errors) {
            return request(app)
                .put(`${RouterPaths.blogs}/${blogId}`)
                .set("Authorization", auth)
                .send(body)
                .expect(code)
        } else {
            return request(app)
                .put(`${RouterPaths.blogs}/${blogId}`)
                .set("Authorization", auth)
                .send(body)
                .expect(code, errors)
        }
    },
    async delete(
        blogId: string,
        code = 204,
        errors: ErrorType | null = null,
        auth: string = correctLogin) {
        if (!errors) {
            return request(app)
                .delete(`${RouterPaths.blogs}/${blogId}`)
                .set("Authorization", auth)
                .expect(code)
        } else {
            return request(app)
                .delete(`${RouterPaths.blogs}/${blogId}`)
                .set("Authorization", auth)
                .expect(code, errors)
        }
    }
}

