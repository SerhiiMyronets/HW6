// @ts-ignore
import request from 'supertest'
import {app, RouterPaths} from "../../src/setting";
import {blogTestRepository} from "../test-repositories/blog-test-repository";
import {
    correctBodyBlog, errorsIncorrectInputBlog, errorsUndefinedInputBlog,
    incorrectBodyBlog, undefinedBodyBlog, updatedCorrectBodyBlog, incorrectLogin, randomObjectId
} from "../test-inputs/blogs-test-inputs";
import {generateString} from "../../src/functions/generate-string";

describe(RouterPaths.blogs, () => {
    beforeEach(async () => {
        await request(app).delete(RouterPaths.__test__).expect(204)
    })
    it(`should return 200 and empty array after get/ request`, async () => {
        await blogTestRepository.get()
    })
    it(`should return 200 and array of blogs after get/ request`, async () => {
        const testBlog = await blogTestRepository.create(correctBodyBlog)
        const testBlog2 = await blogTestRepository.create(correctBodyBlog)
        const testBlog3 = await blogTestRepository.create(correctBodyBlog,)
        await blogTestRepository.get([testBlog.body, testBlog2.body, testBlog3.body])
    })
    it(`should return 404 after get/id request with incorrect object id`, async () => {
        await blogTestRepository.getById(randomObjectId, 404)
    })
    it(`should return 404 after get/id request with incorrect non object id`, async () => {
        await blogTestRepository.getById(generateString(60), 404)
    })
    it(`should return 200 and correct blog after get/id`, async () => {
        const result = await blogTestRepository.create(correctBodyBlog)
        expect(result.body).toEqual(await blogTestRepository.getById(result.body.id))
    })
    it(`shouldn't create blog with incorrect body`, async () => {
        await blogTestRepository.create(
            incorrectBodyBlog,
            400,
            errorsIncorrectInputBlog)
        await blogTestRepository.get()
    })
    it(`shouldn't create blog with incorrect auth`, async () => {
        await blogTestRepository.create(
            correctBodyBlog,
            401,
            null,
            incorrectLogin)
        await blogTestRepository.get()
    })
    it('should create blog with correct data', async () => {
        const testBlog = await blogTestRepository.create(correctBodyBlog)
        expect(testBlog.body).toMatchObject(correctBodyBlog)
        expect(testBlog.body).toEqual(await blogTestRepository.getById(testBlog.body.id))
    })
    it(`shouldn't update existing blog with incorrect data in body`, async () => {
        const testBlog = await blogTestRepository.create(correctBodyBlog)
        await blogTestRepository.update(
            testBlog.body.id,
            incorrectBodyBlog,
            400,
            errorsIncorrectInputBlog)
        expect(testBlog.body).toEqual(await blogTestRepository.getById(testBlog.body.id))
    })
    it(`shouldn't update existing blog with undefined data in body`, async () => {
        const testBlog = await blogTestRepository.create(correctBodyBlog)
        await blogTestRepository.update(
            testBlog.body.id,
            undefinedBodyBlog,
            400,
            errorsUndefinedInputBlog)
        expect(testBlog.body).toEqual(await blogTestRepository.getById(testBlog.body.id))
    })
    it(`shouldn't update blog with incorrect object id`, async () => {
        const testBlog = await blogTestRepository.create(correctBodyBlog)
        await blogTestRepository.update(
            randomObjectId,
            updatedCorrectBodyBlog,
            404)
        expect(testBlog.body).toEqual(await blogTestRepository.getById(testBlog.body.id))
    })
    it(`shouldn't update blog with incorrect auth`, async () => {
        const testBlog = await blogTestRepository.create(correctBodyBlog)
        await blogTestRepository.update(
            testBlog.body.id,
            updatedCorrectBodyBlog,
            401,
            null,
            incorrectLogin)
        expect(testBlog.body).toEqual(await blogTestRepository.getById(testBlog.body.id))
    })
    it('should update existing blog with correct data', async () => {
        const testBlog = await blogTestRepository.create(correctBodyBlog)
        await blogTestRepository.update(
            testBlog.body.id,
            updatedCorrectBodyBlog,
            204)
        expect(await blogTestRepository.getById(testBlog.body.id)).toMatchObject(updatedCorrectBodyBlog)
    })
    it(`shouldn't delete blog with incorrect object id`, async () => {
        const testBlog = await blogTestRepository.create(correctBodyBlog)
        await blogTestRepository.delete(randomObjectId,404)
        expect(testBlog.body).toEqual(await blogTestRepository.getById(testBlog.body.id))
    })
    it(`shouldn't delete existing blog with incorrect authorization`, async () => {
        const testBlog = await blogTestRepository.create(correctBodyBlog)
        await blogTestRepository.delete(testBlog.body.id,401, incorrectLogin)
        expect(testBlog.body).toEqual(await blogTestRepository.getById(testBlog.body.id))
    })
    it(`should delete existing blog`, async () => {
        const testBlog = await blogTestRepository.create(correctBodyBlog)
        await blogTestRepository.delete(testBlog.body.id,204)
        await blogTestRepository.getById(testBlog.body.id, 404)
    })
})
