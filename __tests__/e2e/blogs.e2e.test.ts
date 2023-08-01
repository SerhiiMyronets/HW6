// @ts-ignore
import request from 'supertest'
import {app, auth, RouterPaths} from "../../src/setting";

import {generateString} from "../../src/functions/generate-string";
import {testRepository} from "../test-repositories/test-repository";
import {
    correctBodyBlog, errorsIncorrectInputBlog, errorsUndefinedInputBlog,
    incorrectBodyBlog, undefinedBodyBlog, updatedCorrectBodyBlog, incorrectLogin
} from "../test-repositories/blogs-test-inputs";


let newBlogId = ''

describe(RouterPaths.blogs, () => {
    beforeAll(async () => {
        await request(app).delete(RouterPaths.__test__)
    })
    it(`should return 200 and empty array after get/`, async () => {
        await request(app)
            .get(RouterPaths.blogs)
            .expect(200, [])
    })
    it(`should return 400 after get with incorrect id`, async () => {
        await request(app)
            .get(`${RouterPaths.blogs}/${generateString(5)}`)
            .expect(404)
    })
    it(`shouldn't create blog with incorrect data`, async () => {
        await request(app)
            .post(RouterPaths.blogs)
            .set("Authorization", "Basic " + btoa(`${auth.login}:${auth.password}`))
            .send(incorrectBodyBlog)
            .expect(400, errorsIncorrectInputBlog)

        await request(app)
            .get(RouterPaths.blogs)
            .expect(200, [])
    })
    it('should create blog with correct data', async () => {
        await request(app)
            .post(RouterPaths.blogs)
            .set("Authorization", "Basic " + btoa(`${auth.login}:${auth.password}`))
            .send(correctBodyBlog)
            .expect(response => {
                expect(response.status).toBe(201)
                expect(response.body.id).toBeDefined()
                expect(Object.keys(response.body).length).toBe(4)
                expect(response.body).toMatchObject(correctBodyBlog)
                newBlogId = response.body.id
            })
        await testRepository.checkBlogExisting(newBlogId, correctBodyBlog)

    })
    it(`should return 200 and correct blog after get/id`, async () => {
        await testRepository.checkBlogExisting(newBlogId, correctBodyBlog)
    })

    it('should update existing blog with correct data', async () => {
        await request(app)
            .put(`${RouterPaths.blogs}/${newBlogId}`)
            .set("Authorization", "Basic " + btoa(`${auth.login}:${auth.password}`))
            .send(updatedCorrectBodyBlog)
            .expect(204)
        await testRepository.checkBlogExisting(newBlogId, updatedCorrectBodyBlog)

    })
    it(`shouldn't update existing blog with incorrect data in body`, async () => {
        await request(app)
            .put(`${RouterPaths.blogs}/${newBlogId}`)
            .set("Authorization", "Basic " + btoa(`${auth.login}:${auth.password}`))
            .send(incorrectBodyBlog)
            .expect(400, errorsIncorrectInputBlog)

        await testRepository.checkBlogExisting(newBlogId, updatedCorrectBodyBlog)
    })
    it(`shouldn't update existing blog with undefined data in body`, async () => {
        await request(app)
            .put(`${RouterPaths.blogs}/${newBlogId}`)
            .set("Authorization", "Basic " + btoa(`${auth.login}:${auth.password}`))
            .send(undefinedBodyBlog)
            .expect(400, errorsUndefinedInputBlog)
        await testRepository.checkBlogExisting(newBlogId, updatedCorrectBodyBlog)

    })
    it(`shouldn't update blog with incorrect id`, async () => {
        await request(app)
            .put(`${RouterPaths.blogs}/${generateString(5)}`)
            .set("Authorization", "Basic " + btoa(`${auth.login}:${auth.password}`))
            .send(correctBodyBlog)
            .expect(404)
        await testRepository.checkBlogExisting(newBlogId, updatedCorrectBodyBlog)

    })
    it(`shouldn't delete existing blog with incorrect authorization`, async () => {
        await request(app)
            .delete(`${RouterPaths.blogs}/${newBlogId}`)
            .set("Authorization", incorrectLogin)
            .expect(401)
        await testRepository.checkBlogExisting(newBlogId, updatedCorrectBodyBlog)
    })
    it(`shouldn't delete not existing blog`, async () => {
        await request(app)
            .delete(`${RouterPaths.blogs}/${generateString(5)}`)
            .set("Authorization", "Basic " + btoa(`${auth.login}:${auth.password}`))
            .expect(404)
        await testRepository.checkBlogExisting(newBlogId, updatedCorrectBodyBlog)
    })
    it(`shouldn delete existing blog`, async () => {
        await request(app)
            .delete(`${RouterPaths.blogs}/${newBlogId}`)
            .set("Authorization", "Basic " + btoa(`${auth.login}:${auth.password}`))
            .expect(204)
        await request(app)
            .get(RouterPaths.blogs)
            .expect(200, [])
    })
})
