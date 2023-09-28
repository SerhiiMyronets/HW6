// @ts-ignore
import request from 'supertest'
import {app, RouterPaths} from "../../src/setting";
import {blogTestRepository} from "../test-repositories/blog-test-repository";
import {correctBodyBlog, randomObjectId,} from "../test-inputs/blogs-test-inputs";
import {postTestRepository} from "../test-repositories/posts-test-repository";
import {BlogViewModel} from "../../src/models/repository/blogs-models";
import {
    correctBodyPost,
    errorsIncorrectInputPost,
    errorsIncorrectInputPostByBlog,
    incorrectBodyPost,
    incorrectLogin,
    updatedCorrectBodyPost
} from "../test-inputs/posts-test-inputs";
import {postsService} from "../../src/domain/posts-service";
import {MongoMemoryServer} from "mongodb-memory-server";
import mongoose from "mongoose";

describe("PostTest", () => {
    let mongoMemoryServer: any
    let testBlog: BlogViewModel
    beforeAll(async () => {
        mongoMemoryServer = new MongoMemoryServer()
        await mongoMemoryServer.start();
        const uri = await mongoMemoryServer.getUri();
        await mongoose.connect(uri);
        await request(app).delete(RouterPaths.__test__).expect(204)
        testBlog = await blogTestRepository.createBlog(correctBodyBlog)
        correctBodyPost.blogId = testBlog.id
        updatedCorrectBodyPost.blogId = testBlog.id
    })
    beforeEach(async () => {
        await postsService.deleteAllPosts()
    })
    afterAll(async () => {
        await request(app).delete(RouterPaths.__test__).expect(204)
        await mongoose.connection.close()
    })
    it(`should return 200 and empty array after get/ request`, async () => {
        const getResult = await postTestRepository.get()
        expect(getResult.items).toEqual([])
    })
    it(`should return 200 and array of posts after get/ request`, async () => {
        const testPosts = await postTestRepository.createPosts(testBlog.id, 3)
        const getResult = await postTestRepository.get({"sortDirection": "asc"})
        expect(getResult.items).toEqual(testPosts)
    })
    it('should return correct posts list on page with sortBy', async () => {
        const posts = await postTestRepository.createPosts(testBlog.id, 5)
        let getResult = await postTestRepository
            .get({"sortBy": "shortDescription", "sortDirection": "desc"})
        expect(getResult.items).toEqual(posts
            .sort((a, b) =>
                b.shortDescription.localeCompare(a.shortDescription)))
        getResult = await postTestRepository
            .get({"sortBy": "shortDescription", "sortDirection": "asc"})
        expect(getResult.items).toEqual(posts
            .sort((a, b) =>
                a.shortDescription.localeCompare(b.shortDescription)))
        getResult = await postTestRepository
            .get({"sortBy": "content", "sortDirection": "desc"})
        expect(getResult.items).toEqual(posts
            .sort((a, b) =>
                b.content.localeCompare(a.content)))
        getResult = await postTestRepository
            .get({"sortBy": "content", "sortDirection": "asc"})
        expect(getResult.items).toEqual(posts
            .sort((a, b) =>
                a.content.localeCompare(b.content)))
    })
    it('should return correct posts list on page with sortDirection', async () => {
        const posts = await postTestRepository.createPosts(testBlog.id, 5)
        let getResult = await postTestRepository
            .get({"sortDirection": "asc"})
        expect(getResult.items).toEqual(posts)
        getResult = await postTestRepository.get()
        expect(getResult.items).toEqual(posts
            .sort((a, b) =>
                new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()))
        getResult = await postTestRepository
            .get({"sortDirection": "desc"})
        expect(getResult.items).toEqual(posts)
    })
    it('should return correct posts list on page with pageNumber/pageSize', async () => {
        await postTestRepository.createPosts(testBlog.id, 10)
        let getResult = await postTestRepository
            .get({"pageNumber": "1", "pageSize": "3"})
        expect(getResult.items.length).toEqual(3)
        getResult = await postTestRepository
            .get({"pageNumber": "4", "pageSize": "3"})
        expect(getResult.items.length).toEqual(1)
        getResult = await postTestRepository
            .get({"pageNumber": "2", "pageSize": "10"})
        expect(getResult.items.length).toEqual(0)
        getResult = await postTestRepository
            .get({"pageNumber": "1", "pageSize": "20"})
        expect(getResult.items.length).toEqual(10)
    })
    it(`should return 404 after get/id request with incorrect id`, async () => {
        await postTestRepository.getById(randomObjectId, 404)
    })
    it(`should return 200 and correct post after get/id`, async () => {
        const testPost = await postTestRepository.createPost(correctBodyPost)
        const getResult = await postTestRepository.getById(testPost.id)
        expect(getResult).toEqual(testPost)
    })
    it(`shouldn't create post with incorrect body`, async () => {
        const error = await postTestRepository.createPost(incorrectBodyPost, 400)
        expect(error).toEqual(errorsIncorrectInputPost)
        const getResult = await postTestRepository.get()
        expect(getResult.items).toEqual([])
    })
    it(`shouldn't create post with incorrect auth`, async () => {
        await postTestRepository.createPost(correctBodyPost, 401, incorrectLogin)
        const getResult = await postTestRepository.get()
        expect(getResult.items).toEqual([])
    })
    it('should create post with correct data', async () => {
        const testPost = await postTestRepository.createPost(correctBodyPost)
        expect(testPost).toMatchObject(correctBodyPost)
        const getResult = await postTestRepository.getById(testPost.id)
        expect(getResult).toEqual(testPost)
    })
    it(`shouldn't update post with incorrect data in body`, async () => {
        const testPost = await postTestRepository.createPost(correctBodyPost)
        const error = await postTestRepository.update(testPost.id, incorrectBodyPost, 400)
        expect(error.body).toEqual(errorsIncorrectInputPost)
        const getResult = await postTestRepository.getById(testPost.id)
        expect(getResult).toEqual(testPost)
    })
    it(`shouldn't update post with incorrect id`, async () => {
        const testPost = await postTestRepository.createPost(correctBodyPost)
        await postTestRepository.update(randomObjectId, updatedCorrectBodyPost, 404)
        const getResult = await postTestRepository.getById(testPost.id)
        expect(getResult).toEqual(testPost)
    })
    it(`shouldn't update post with incorrect auth`, async () => {
        const testPost = await postTestRepository.createPost(correctBodyPost)
        await postTestRepository.update(testPost.id, updatedCorrectBodyPost, 401, incorrectLogin)
        const getResult = await postTestRepository.getById(testPost.id)
        expect(getResult).toEqual(testPost)
    })
    it('should update existing post with correct data', async () => {
        const testPost = await postTestRepository.createPost(correctBodyPost)
        await postTestRepository.update(testPost.id, updatedCorrectBodyPost)
        const getResult = await postTestRepository.getById(testPost.id)
        expect(getResult).toMatchObject(updatedCorrectBodyPost)
    })
    it(`shouldn't delete post with incorrect id`, async () => {
        const testPost = await postTestRepository.createPost(correctBodyPost)
        await postTestRepository.delete(randomObjectId, 404)
        const getResult = await postTestRepository.getById(testPost.id)
        expect(getResult).toEqual(testPost)
    })
    it(`shouldn't delete existing post with incorrect authorization`, async () => {
        const testPost = await postTestRepository.createPost(correctBodyPost)
        await postTestRepository.delete(testPost.id, 401, incorrectLogin)
        const getResult = await postTestRepository.getById(testPost.id)
        expect(getResult).toEqual(testPost)
    })
    it(`should delete existing post`, async () => {
        const testPost = await postTestRepository.createPost(correctBodyPost)
        await postTestRepository.delete(testPost.id, 204)
        await postTestRepository.getById(testPost.id, 404)
    })
    it(`should return 200 and empty array after get/blogs/:id/posts request`, async () => {
        const anotherBlog = await blogTestRepository.createBlog(correctBodyBlog)
        await postTestRepository.createPost({...correctBodyPost, blogId: anotherBlog.id})
        const getResult = await postTestRepository.getByBlogId(testBlog.id)
        expect(getResult.items).toEqual([])
    })
    it(`should return 200 and array of posts after get/blogs/:id/posts request`, async () => {
        const anotherBlog = await blogTestRepository.createBlog(correctBodyBlog)
        await postTestRepository.createPost({...correctBodyPost, blogId: anotherBlog.id})
        const testPosts = await postTestRepository.createPostsByBlogId(testBlog.id, 3)
        const getResult = await postTestRepository.getByBlogId(testBlog.id,{"sortDirection": "asc"})
        expect(getResult.items).toEqual(testPosts)
    })
    it(`should return 404 after get/blogs/:id/posts request with incorrect id`, async () => {
        await postTestRepository.getByBlogId(randomObjectId, {},404)
    })
    it(`shouldn't create post with incorrect body (/blogs/:id/posts)`, async () => {
        const error = await postTestRepository.createPostByBlogId(incorrectBodyPost, 400)
        expect(error).toEqual(errorsIncorrectInputPostByBlog)
        const getResult = await postTestRepository.getByBlogId(testBlog.id)
        expect(getResult.items).toEqual([])
    })
    it(`shouldn't create post with incorrect auth (/blogs/:id/posts)`, async () => {
        await postTestRepository.createPostByBlogId(correctBodyPost, 401, incorrectLogin)
        const getResult = await postTestRepository.getByBlogId(testBlog.id)
        expect(getResult.items).toEqual([])
    })
    it('should create post with correct data (/blogs/:id/posts)', async () => {
        const testPost = await postTestRepository.createPostByBlogId(correctBodyPost)
        expect(testPost).toMatchObject(correctBodyPost)
        const getResult = await postTestRepository.getByBlogId(testBlog.id)
        expect(getResult.items).toEqual([testPost])
    })
    it('should return correct posts list on page with sortBy (/blogs/:id/posts)', async () => {
        const anotherBlog = await blogTestRepository.createBlog(correctBodyBlog)
        await postTestRepository.createPost({...correctBodyPost, blogId: anotherBlog.id})
        const posts = await postTestRepository.createPostsByBlogId(testBlog.id, 5)
        let getResult = await postTestRepository
            .getByBlogId(testBlog.id,{"sortBy": "shortDescription", "sortDirection": "desc"})
        expect(getResult.items).toEqual(posts
            .sort((a, b) =>
                b.shortDescription.localeCompare(a.shortDescription)))
        getResult = await postTestRepository
            .getByBlogId(testBlog.id,{"sortBy": "shortDescription", "sortDirection": "asc"})
        expect(getResult.items).toEqual(posts
            .sort((a, b) =>
                a.shortDescription.localeCompare(b.shortDescription)))
        getResult = await postTestRepository
            .getByBlogId(testBlog.id,{"sortBy": "content", "sortDirection": "desc"})
        expect(getResult.items).toEqual(posts
            .sort((a, b) =>
                b.content.localeCompare(a.content)))
        getResult = await postTestRepository
            .getByBlogId(testBlog.id,{"sortBy": "content", "sortDirection": "asc"})
        expect(getResult.items).toEqual(posts
            .sort((a, b) =>
                a.content.localeCompare(b.content)))
    })
    it('should return correct posts list on page with sortDirection (/blogs/:id/posts)', async () => {
        const anotherBlog = await blogTestRepository.createBlog(correctBodyBlog)
        await postTestRepository.createPost({...correctBodyPost, blogId: anotherBlog.id})
        const posts = await postTestRepository.createPostsByBlogId(testBlog.id, 5)
        let getResult = await postTestRepository
            .getByBlogId(testBlog.id,{"sortDirection": "asc"})
        expect(getResult.items).toEqual(posts)
        getResult = await postTestRepository
            .getByBlogId(testBlog.id)
        expect(getResult.items).toEqual(posts
            .sort((a, b) =>
                new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()))
        getResult = await postTestRepository
            .getByBlogId(testBlog.id,{"sortDirection": "desc"})
        expect(getResult.items).toEqual(posts)
    })
    it('should return correct posts list on page with pageNumber/pageSize (/blogs/:id/posts)', async () => {
        await postTestRepository.createPostsByBlogId(testBlog.id, 10)
        let getResult = await postTestRepository
            .getByBlogId(testBlog.id,{"pageNumber": "1", "pageSize": "3"})
        expect(getResult.items.length).toEqual(3)
        getResult = await postTestRepository
            .getByBlogId(testBlog.id,{"pageNumber": "4", "pageSize": "3"})
        expect(getResult.items.length).toEqual(1)
        getResult = await postTestRepository
            .getByBlogId(testBlog.id,{"pageNumber": "2", "pageSize": "10"})
        expect(getResult.items.length).toEqual(0)
        getResult = await postTestRepository
            .getByBlogId(testBlog.id,{"pageNumber": "1", "pageSize": "20"})
        expect(getResult.items.length).toEqual(10)
    })
})