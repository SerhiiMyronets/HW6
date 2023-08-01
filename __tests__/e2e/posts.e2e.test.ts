// @ts-ignore
import request from 'supertest'
import {app, auth, RouterPaths} from "../../src/setting";
import {
    correctBodyPost, errorsIncorrectInputPost, errorsUndefinedInputPost,
    incorrectBodyPost, undefinedBodyPost, updatedCorrectBodyPost
} from "../test-repositories/posts-test-inputs";
import {generateString} from "../../src/functions/generate-string";
import {testRepository} from "../test-repositories/test-repository";

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
            .set("Authorization", "Basic " + btoa(`${auth.login}:${auth.password}`))
            .send(incorrectBodyPost)
            .expect(400, errorsIncorrectInputPost)


        await request(app)
            .get(RouterPaths.posts)
            .expect(200, [])
    })
    it('should create post with correct data', async () => {
        await request(app)
            .post(RouterPaths.posts)
            .set("Authorization", "Basic " + btoa(`${auth.login}:${auth.password}`))
            .send(correctBodyPost)
            .expect(response => {
                expect(response.status).toBe(201)
                expect(response.body.id).toBeDefined()
                expect(response.body.blogName).toBeDefined()
                expect(Object.keys(response.body).length).toBe(6)
                expect(response.body).toMatchObject(correctBodyPost)
                newPostId = response.body.id
            })
        await testRepository.checkPostExisting(newPostId, correctBodyPost)

    })
    it(`should return 200 and correct post after get/id`, async () => {
        await testRepository.checkPostExisting(newPostId, correctBodyPost)
    })
    it('should update existing post with correct data', async () => {
        await request(app)
            .put(`${RouterPaths.posts}/${newPostId}`)
            .set("Authorization", "Basic " + btoa(`${auth.login}:${auth.password}`))
            .send(updatedCorrectBodyPost)
            .expect(204)
        await testRepository.checkPostExisting(newPostId, updatedCorrectBodyPost)

    })
    it(`shouldn't update existing post with incorrect data in body`, async () => {
        await request(app)
            .put(`${RouterPaths.posts}/${newPostId}`)
            .set("Authorization", "Basic " + btoa(`${auth.login}:${auth.password}`))
            .send(incorrectBodyPost)
            .expect(400, errorsIncorrectInputPost)
        await testRepository.checkPostExisting(newPostId, updatedCorrectBodyPost)

    })
    it(`shouldn't update existing post with undefined data in body`, async () => {
        await request(app)
            .put(`${RouterPaths.posts}/${newPostId}`)
            .set("Authorization", "Basic " + btoa(`${auth.login}:${auth.password}`))
            .send(undefinedBodyPost)
            .expect(400, errorsUndefinedInputPost)
        await testRepository.checkPostExisting(newPostId, updatedCorrectBodyPost)

    })
    it(`shouldn't update post with incorrect id`, async () => {
        await request(app)
            .put(`${RouterPaths.posts}/${generateString(5)}`)
            .set("Authorization", "Basic " + btoa(`${auth.login}:${auth.password}`))
            .send(correctBodyPost)
            .expect(404)
        await testRepository.checkPostExisting(newPostId, updatedCorrectBodyPost)

    })
    it(`shouldn't delete not existing post`, async () => {
        await request(app)
            .delete(`${RouterPaths.posts}/${generateString(5)}`)
            .set("Authorization", "Basic " + btoa(`${auth.login}:${auth.password}`))
            .expect(404)
        await testRepository.checkPostExisting(newPostId, updatedCorrectBodyPost)

    })
    it(`should delete existing post`, async () => {
        await request(app)
            .delete(`${RouterPaths.posts}/${newPostId}`)
            .set("Authorization", "Basic " + btoa(`${auth.login}:${auth.password}`))
            .expect(204)
        await request(app)
            .get(RouterPaths.posts)
            .expect(200, [])
    })
})