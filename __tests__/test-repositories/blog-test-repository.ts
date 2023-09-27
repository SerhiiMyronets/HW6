// @ts-ignore
import request from 'supertest'
import {app, RouterPaths} from "../../src/setting";
import {BlogInputModel, BlogViewModel, BlogViewPaginatedModel} from "../../src/models/repository/blogs-models";
import {correctLogin} from "../test-inputs/blogs-test-inputs";
import {generateString} from "../test-inputs/generate-string";


export const blogTestRepository = {
    async get(query: object = {}): Promise<BlogViewPaginatedModel> {
        const result = await request(app)
            .get(RouterPaths.blogs)
            .query(query)
            .expect(200)
        return result.body
    },
    async getById(
        BlogId: string,
        code = 200): Promise<BlogViewModel> {
        const result = await request(app)
            .get(`${RouterPaths.blogs}/${BlogId}`)
            .expect(code)
        return result.body
    },
    async createBlog(
        body: BlogInputModel,
        code: number = 201,
        auth: string = correctLogin
    ): Promise<BlogViewModel> {
        const result = await request(app)
            .post(RouterPaths.blogs)
            .set("Authorization", auth)
            .send(body)
            .expect(code)
        return result.body
    },
    async createBlogs(count: number): Promise<BlogViewModel[]> {
        const result = []
        for (let i = 0; i < count; i++) {
            const blog = await this.createBlog(
                {
                    name: 'BlogName' + i,
                    description: (count - i) + generateString(60),
                    websiteUrl: i + generateString(5) + '.com'
                }
            )
            result.push(blog)
        }
        return result
    },
    async update(
        blogId: string,
        body: BlogInputModel,
        code: number = 204,
        auth: string = correctLogin
    ) {
        return request(app)
            .put(`${RouterPaths.blogs}/${blogId}`)
            .set("Authorization", auth)
            .send(body)
            .expect(code)
    },
    async delete(
        blogId: string,
        code = 204,
        auth: string = correctLogin) {
        return request(app)
            .delete(`${RouterPaths.blogs}/${blogId}`)
            .set("Authorization", auth)
            .expect(code)
    }
}

