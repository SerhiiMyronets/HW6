// @ts-ignore
import request from "supertest";
import {app, RouterPaths} from "../../src/setting";
import {BlogInputModel} from "../../src/models/blogs-models";
import {PostInputModel} from "../../src/models/posts-models";



export const testRepository = {
    async checkBlogExisting(BlogId: string, BodyBlog: BlogInputModel) {
        await request(app)
            .get(`${RouterPaths.blogs}/${BlogId}`)
            .expect(response => {
                expect(response.status).toBe(200)
                expect(response.body.id).toBe(BlogId)
                expect(response.body.createdAt).toBeDefined()
                expect(response.body.isMembership).toBeDefined()
                expect(Object.keys(response.body).length).toBe(7)
                expect(response.body).toMatchObject(BodyBlog)
            })
    },
    async checkPostExisting(PostId: string, BodyBlog: PostInputModel) {
        await request(app)
            .get(`${RouterPaths.posts}/${PostId}`)
            .expect(response => {
                expect(response.status).toBe(200)
                expect(response.body.id).toBe(PostId)
                expect(response.body.blogName).toBeDefined()
                expect(response.body.createdAt).toBeDefined()
                expect(Object.keys(response.body).length).toBe(8)
                expect(response.body).toMatchObject(BodyBlog)
            })
    }
}
