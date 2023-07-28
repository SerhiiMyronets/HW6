// @ts-ignore
import request from 'supertest'
import {app, RouterPaths} from "../../src/setting";
import {
    correctBodyPost, errorsIncorrectInputPost, errorsUndefinedInputPost,
    incorrectBodyPost, undefinedBodyPost, updatedCorrectBodyPost
} from "./test-repositories/posts-test-repositories";
import {generateString} from "../../src/library/generate-string";

let newPostId: string = ''


describe(RouterPaths.posts, () => {
    beforeAll(async () => {
        await request(app).delete(RouterPaths.__test__)
    })
    it(`should return 200 and empty array after get/`, async () => {
        await request(app)
            .get(RouterPaths.posts)
            .expect(200, [])
    })
    it(`should return 400 after get with incorrect id`, async () => {
        await request(app)
            .get(`${RouterPaths.posts}/${generateString(5)}`)
            .expect(404)
    })
    it(`shouldn't create post with incorrect data`, async () => {
        await request(app)
            .post(RouterPaths.posts)
            .set("Authorization", "basic " + btoa("admin:qwerty"))
            .send(incorrectBodyPost)
            .expect(400, errorsIncorrectInputPost)

        await request(app)
            .get(RouterPaths.posts)
            .expect(200, [])
    })
    it('should create post with correct data', async () => {
        await request(app)
            .post(RouterPaths.posts)
            .set("Authorization", "basic " + btoa("admin:qwerty"))
            .send(correctBodyPost)
            .expect(response => {
                expect(response.status).toBe(201)
                expect(response.body.id).toBeDefined()
                expect(response.body.blogName).toBeDefined()
                expect(Object.keys(response.body).length).toBe(6)
                expect(response.body).toMatchObject(correctBodyPost)
                newPostId = response.body.id
            })

        await request(app)
            .get(`${RouterPaths.posts}/${newPostId}`)
            .expect(response => {
                expect(response.status).toBe(200)
                expect(response.body.id).toBe(newPostId)
                expect(Object.keys(response.body).length).toBe(6)
                expect(response.body).toMatchObject(correctBodyPost)
            })
    })
    it(`should return 200 and correct post after get/id`, async () => {
        await request(app)
            .get(`${RouterPaths.posts}/${newPostId}`)
            .expect(response => {
                expect(response.status).toBe(200)
                expect(response.body.id).toBeDefined()
                expect(response.body.blogName).toBeDefined()
                expect(Object.keys(response.body).length).toBe(6)
                expect(response.body).toMatchObject(correctBodyPost)
            })
    })
    it('should update existing post with correct data', async () => {
        await request(app)
            .put(`${RouterPaths.posts}/${newPostId}`)
            .set("Authorization", "basic " + btoa("admin:qwerty"))
            .send(updatedCorrectBodyPost)
            .expect(204)

        await request(app)
            .get(`${RouterPaths.posts}/${newPostId}`)
            .expect(response => {
                expect(response.status).toBe(200)
                expect(response.body.id).toBeDefined()
                expect(response.body.blogName).toBeDefined()
                expect(Object.keys(response.body).length).toBe(6)
                expect(response.body).toMatchObject(updatedCorrectBodyPost)
            })
    })
    it(`shouldn't update existing post with incorrect data in body`, async () => {
        await request(app)
            .put(`${RouterPaths.posts}/${newPostId}`)
            .set("Authorization", "basic " + btoa("admin:qwerty"))
            .send(incorrectBodyPost)
            .expect(400, errorsIncorrectInputPost)

        await request(app)
            .get(`${RouterPaths.posts}/${newPostId}`)
            .expect(response => {
                expect(response.status).toBe(200)
                expect(response.body.id).toBeDefined()
                expect(response.body.blogName).toBeDefined()
                expect(Object.keys(response.body).length).toBe(6)
                expect(response.body).toMatchObject(updatedCorrectBodyPost)
            })
    })
    it(`shouldn't update existing post with undefined data in body`, async () => {
        await request(app)
            .put(`${RouterPaths.posts}/${newPostId}`)
            .set("Authorization", "basic " + btoa("admin:qwerty"))
            .send(undefinedBodyPost)
            .expect(400, errorsUndefinedInputPost)

        await request(app)
            .get(`${RouterPaths.posts}/${newPostId}`)
            .expect(response => {
                expect(response.status).toBe(200)
                expect(response.body.id).toBeDefined()
                expect(response.body.blogName).toBeDefined()
                expect(Object.keys(response.body).length).toBe(6)
                expect(response.body).toMatchObject(updatedCorrectBodyPost)
            })
    })
    it(`shouldn't update post with incorrect id`, async () => {
        await request(app)
            .put(`${RouterPaths.posts}/${generateString(5)}`)
            .set("Authorization", "basic " + btoa("admin:qwerty"))
            .send(correctBodyPost)
            .expect(404)

        await request(app)
            .get(`${RouterPaths.posts}/${newPostId}`)
            .expect(response => {
                expect(response.status).toBe(200)
                expect(response.body.id).toBeDefined()
                expect(response.body.blogName).toBeDefined()
                expect(Object.keys(response.body).length).toBe(6)
                expect(response.body).toMatchObject(updatedCorrectBodyPost)
            })
    })
    it(`shouldn't delete not existing post`, async () => {
        await request(app)
            .delete(`${RouterPaths.posts}/${generateString(5)}`)
            .set("Authorization", "basic " + btoa("admin:qwerty"))
            .expect(404)
        await request(app)
            .get(`${RouterPaths.posts}/${newPostId}`)
            .expect(response => {
                expect(response.status).toBe(200)
                expect(response.body.id).toBeDefined()
                expect(response.body.blogName).toBeDefined()
                expect(Object.keys(response.body).length).toBe(6)
                expect(response.body).toMatchObject(updatedCorrectBodyPost)
            })
    })
    it(`should delete existing post`, async () => {
        await request(app)
            .delete(`${RouterPaths.posts}/${newPostId}`)
            .set("Authorization", "basic " + btoa("admin:qwerty"))
            .expect(204)
        await request(app)
            .get(RouterPaths.posts)
            .expect(200, [])
    })
})