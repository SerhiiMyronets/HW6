// @ts-ignore
import request from 'supertest'
import {app, RouterPaths} from "../../src/setting";
import {
    correctBodyPost, errorsIncorrectInputId, errorsIncorrectInputPost, errorsUndefinedInputPost,
    incorrectBodyPost, incorrectLogin, undefinedBodyPost, updatedCorrectBodyPost
} from "../test-inputs/posts-test-inputs";
import {generateString} from "../../src/functions/generate-string";
import {blogTestRepository} from "../test-repositories/blog-test-repository";
import {correctBodyBlog, randomObjectId,} from "../test-inputs/blogs-test-inputs";
import {postTestRepository} from "../test-repositories/posts-test-repository";

describe(RouterPaths.posts, () => {
    beforeEach(async () => {
        await request(app).delete(RouterPaths.__test__).expect(204)
    })
    it(`should return 200 and empty array after get/ request`, async () => {
        await postTestRepository.get()
    })
    it(`should return 200 and array of posts after get/ request`, async () => {
        const testBlog = await blogTestRepository.create(correctBodyBlog)
        const testPostBody = {...correctBodyPost, blogId: testBlog.body.id}
        const testPost = await postTestRepository.create(testPostBody)
        const testPost1 = await postTestRepository.create(testPostBody)
        const testPost2 = await postTestRepository.create(testPostBody)
        await postTestRepository.get([testPost.body, testPost1.body, testPost2.body])
    })
    it(`should return 404 after get/id request with incorrect object id`, async () => {
        await postTestRepository.getById(randomObjectId, 404)
    })
    it(`should return 404 after get/id request with non object id`, async () => {
        await postTestRepository.getById(generateString(60), 400, errorsIncorrectInputId)
    })
    it(`should return 200 and correct post after get/id`, async () => {
        const testBlog = await blogTestRepository.create(correctBodyBlog)
        const testPost = await postTestRepository.create({...correctBodyPost, blogId: testBlog.body.id})
        expect(testPost.body).toEqual(await postTestRepository.getById(testPost.body.id))
    })
    it(`shouldn't create post with incorrect body`, async () => {
        await postTestRepository.create(incorrectBodyPost, 400, errorsIncorrectInputPost)
        await postTestRepository.get()
    })
    it(`shouldn't create post with incorrect auth`, async () => {
        await postTestRepository.create(incorrectBodyPost, 401, null, incorrectLogin)
        await postTestRepository.get()
    })
    it('should create post with correct data', async () => {
        const testBlog = await blogTestRepository.create(correctBodyBlog)
        const testPost = await postTestRepository.create({...correctBodyPost, blogId: testBlog.body.id})
        expect(testPost.body).toMatchObject(correctBodyPost)
        expect(testPost.body).toEqual(await postTestRepository.getById(testPost.body.id))
    })
    it(`shouldn't update post with incorrect data in body`, async () => {
        const testBlog = await blogTestRepository.create(correctBodyBlog)
        const testPost = await postTestRepository.create({...correctBodyPost, blogId: testBlog.body.id})
        await postTestRepository.update(testPost.body.id, incorrectBodyPost, 400, errorsIncorrectInputPost)
        expect(testPost.body).toEqual(await postTestRepository.getById(testPost.body.id))
    })
    it(`shouldn't update post with undefined data in body`, async () => {
        const testBlog = await blogTestRepository.create(correctBodyBlog)
        const testPost = await postTestRepository.create({...correctBodyPost, blogId: testBlog.body.id})
        await postTestRepository.update(testPost.body.id, undefinedBodyPost, 400, errorsUndefinedInputPost)
        expect(testPost.body).toEqual(await postTestRepository.getById(testPost.body.id))
    })
    it(`shouldn't update post with incorrect object id`, async () => {
        const testBlog = await blogTestRepository.create(correctBodyBlog)
        const testPost = await postTestRepository.create({...correctBodyPost, blogId: testBlog.body.id})
        await postTestRepository.update(
            randomObjectId,
            {...updatedCorrectBodyPost, blogId: testBlog.body.id},
            404)
        expect(testPost.body).toEqual(await postTestRepository.getById(testPost.body.id))
    })
    it(`shouldn't update post with non object id`, async () => {
        const testBlog = await blogTestRepository.create(correctBodyBlog)
        const testPost = await postTestRepository.create({...correctBodyPost, blogId: testBlog.body.id})
        await postTestRepository.update(
            generateString(60),
            {...updatedCorrectBodyPost, blogId: testBlog.body.id},
            400,
            errorsIncorrectInputId)
        expect(testPost.body).toEqual(await postTestRepository.getById(testPost.body.id))
    })
    it(`shouldn't update post with incorrect auth`, async () => {
        const testBlog = await blogTestRepository.create(correctBodyBlog)
        const testPost = await postTestRepository.create({...correctBodyPost, blogId: testBlog.body.id})
        await postTestRepository.update(
            testPost.body.id,
            {...updatedCorrectBodyPost, blogId: testBlog.body.id},
            401,
            null,
            incorrectLogin)
        expect(testPost.body).toEqual(await postTestRepository.getById(testPost.body.id))
    })
    it('should update existing post with correct data', async () => {
        const testBlog = await blogTestRepository.create(correctBodyBlog)
        const testPost = await postTestRepository.create({...correctBodyPost, blogId: testBlog.body.id})
        await postTestRepository.update(testPost.body.id, {...updatedCorrectBodyPost, blogId: testBlog.body.id})
        expect(await postTestRepository.getById(testPost.body.id)).toMatchObject(updatedCorrectBodyPost)
    })
    it(`shouldn't delete post with incorrect object id`, async () => {
        const testBlog = await blogTestRepository.create(correctBodyBlog)
        const testPost = await postTestRepository.create({...correctBodyPost, blogId: testBlog.body.id})
        await postTestRepository.delete(randomObjectId, 404)
        expect(testPost.body).toEqual(await postTestRepository.getById(testPost.body.id))
    })
    it(`shouldn't delete post with non object id`, async () => {
        const testBlog = await blogTestRepository.create(correctBodyBlog)
        const testPost = await postTestRepository.create({...correctBodyPost, blogId: testBlog.body.id})
        await postTestRepository.delete(generateString(60), 400, errorsIncorrectInputId)
        expect(testPost.body).toEqual(await postTestRepository.getById(testPost.body.id))
    })
    it(`shouldn't delete existing post with incorrect authorization`, async () => {
        const testBlog = await blogTestRepository.create(correctBodyBlog)
        const testPost = await postTestRepository.create({...correctBodyPost, blogId: testBlog.body.id})
        await postTestRepository.delete(testPost.body.id, 401, null, incorrectLogin)
        expect(testPost.body).toEqual(await postTestRepository.getById(testPost.body.id))
    })
    it(`should delete existing post`, async () => {
        const testBlog = await blogTestRepository.create(correctBodyBlog)
        const testPost = await postTestRepository.create({...correctBodyPost, blogId: testBlog.body.id})
        await postTestRepository.delete(testPost.body.id, 204)
        await postTestRepository.getById(testPost.body.id, 404)
    })
})