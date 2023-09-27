// @ts-ignore
import request from 'supertest'
import {app, RouterPaths} from "../../src/setting";
import {blogTestRepository} from "../test-repositories/blog-test-repository";
import {
    correctBodyBlog,
    errorsIncorrectInputBlog,
    incorrectBodyBlog,
    incorrectLogin,
    randomObjectId,
    updatedCorrectBodyBlog
} from "../test-inputs/blogs-test-inputs";
import {blogsService} from "../../src/domain/blogs-service";
import mongoose from "mongoose";
import {MongoMemoryServer} from "mongodb-memory-server";

let mongoMemoryServer: any
describe(RouterPaths.blogs, () => {
    beforeAll(async () => {
        mongoMemoryServer = new MongoMemoryServer()
        await mongoMemoryServer.start();
        const uri = await mongoMemoryServer.getUri();
        await mongoose.connect(uri);
        // await mongoose.connect(mongooseURI)
        await request(app).delete(RouterPaths.__test__).expect(204)
    })
    beforeEach(async () => {
        await blogsService.deleteAllBlogs()
    })
    afterAll(async () => {
        //mongo off
        await request(app).delete(RouterPaths.__test__).expect(204)
        await mongoose.connection.close()
    })
    it(`should return 200 and empty array after get/ request`, async () => {
        const getResult = await blogTestRepository.get()
        expect(getResult.items).toEqual([])
    })
    it(`should return 200 and array of blogs after get/ request`, async () => {
        const testBlogs = await blogTestRepository.createBlogs(3)

        const getResult = await blogTestRepository.get({"sortDirection": "asc"})
        expect(getResult.items).toEqual(testBlogs)
    })
    it('should return correct blogs list on page with searchNameTerm', async () => {
        const blogs = await blogTestRepository.createBlogs(12)
        let getResult = await blogTestRepository
            .get({"searchNameTerm": "BlogName1", "sortDirection": "asc"})
        expect(getResult.items).toEqual([blogs[1], blogs[10], blogs[11]])
        getResult = await blogTestRepository
            .get({"searchNameTerm": "BlogName10", "sortDirection": "asc"})
        expect(getResult.items).toEqual([blogs[10]])
        getResult = await blogTestRepository
            .get({"searchNameTerm": "name".toUpperCase(), "sortDirection": "asc", "pageSize": 12})
        expect(getResult.items).toEqual(blogs)
        getResult = await blogTestRepository
            .get({"sortDirection": "asc", "pageSize": 12})
        expect(getResult.items).toEqual(blogs)
    })
    it('should return correct blogs list on page with sortBy', async () => {
        const blogs = await blogTestRepository.createBlogs(5)
        let getResult = await blogTestRepository
            .get({"sortBy": "description", "sortDirection": "desc"})
        expect(getResult.items).toEqual(blogs
            .sort((a, b) =>
                b.description.localeCompare(a.description)))
        getResult = await blogTestRepository
            .get({"sortBy": "description", "sortDirection": "asc"})
        expect(getResult.items).toEqual(blogs
            .sort((a, b) =>
                a.description.localeCompare(b.description)))
        getResult = await blogTestRepository
            .get({"sortBy": "websiteUrl", "sortDirection": "desc"})
        expect(getResult.items).toEqual(blogs
            .sort((a, b) =>
                b.websiteUrl.localeCompare(a.websiteUrl)))
        getResult = await blogTestRepository
            .get({"sortBy": "websiteUrl", "sortDirection": "asc"})
        expect(getResult.items).toEqual(blogs
            .sort((a, b) =>
                a.websiteUrl.localeCompare(b.websiteUrl)))
    })
    it('should return correct blogs list on page with sortDirection', async () => {
        const blogs = await blogTestRepository.createBlogs(5)
        let getResult = await blogTestRepository
            .get({"sortDirection": "asc"})
        expect(getResult.items).toEqual(blogs)
        getResult = await blogTestRepository.get()
        expect(getResult.items).toEqual(blogs
            .sort((a, b) =>
                b.createdAt.localeCompare(a.createdAt)))
        getResult = await blogTestRepository
            .get({"sortDirection": "desc"})
        expect(getResult.items).toEqual(blogs)
    })
    it('should return correct blogs list on page with pageNumber/pageSize', async () => {
        await blogTestRepository.createBlogs(10)
        let getResult = await blogTestRepository
            .get({"pageNumber": "1", "pageSize": "3"})
        expect(getResult.items.length).toEqual(3)
        getResult = await blogTestRepository
            .get({"pageNumber": "4", "pageSize": "3"})
        expect(getResult.items.length).toEqual(1)
        getResult = await blogTestRepository
            .get({"pageNumber": "2", "pageSize": "10"})
        expect(getResult.items.length).toEqual(0)
        getResult = await blogTestRepository
            .get({"pageNumber": "1", "pageSize": "20"})
        expect(getResult.items.length).toEqual(10)
    })
    it(`should return 404 after get/id request with incorrect id`, async () => {
        await blogTestRepository.getById(randomObjectId, 404)
    })
    it(`should return 200 and correct blog after get/id`, async () => {
        const result = await blogTestRepository.createBlog(correctBodyBlog)
        expect(result).toEqual(await blogTestRepository.getById(result.id))
    })
    it(`shouldn't create blog with incorrect body`, async () => {
        const error = await blogTestRepository.createBlog(incorrectBodyBlog, 400)
        expect(error).toEqual(errorsIncorrectInputBlog)
        const getResult = await blogTestRepository.get()
        expect(getResult.items).toEqual([])
    })
    it(`shouldn't create blog with incorrect auth`, async () => {
        await blogTestRepository.createBlog(correctBodyBlog, 401, incorrectLogin)
        const getResult = await blogTestRepository.get()
        expect(getResult.items).toEqual([])
    })
    it('should create blog with correct data', async () => {
        const testBlog = await blogTestRepository.createBlog(correctBodyBlog)
        expect(testBlog).toMatchObject(correctBodyBlog)
        const getResult = await blogTestRepository.getById(testBlog.id)
        expect(getResult).toEqual(testBlog)
    })
    it(`shouldn't update blog with incorrect data in body`, async () => {
        const testBlog = await blogTestRepository.createBlog(correctBodyBlog)
        const error = await blogTestRepository.update(testBlog.id, incorrectBodyBlog, 400)
        expect(error.body).toEqual(errorsIncorrectInputBlog)
        const getResult = await blogTestRepository.getById(testBlog.id)
        expect(getResult).toEqual(testBlog)
    })
    it(`shouldn't update blog with incorrect id`, async () => {
        const testBlog = await blogTestRepository.createBlog(correctBodyBlog)
        await blogTestRepository.update(
            randomObjectId,
            updatedCorrectBodyBlog,
            404)
        const getResult = await blogTestRepository.getById(testBlog.id)
        expect(getResult).toEqual(testBlog)
    })
    it(`shouldn't update blog with incorrect auth`, async () => {
        const testBlog = await blogTestRepository.createBlog(correctBodyBlog)
        await blogTestRepository.update(
            testBlog.id,
            updatedCorrectBodyBlog,
            401,
            incorrectLogin,
        )
        const getResult = await blogTestRepository.getById(testBlog.id)
        expect(getResult).toEqual(testBlog)
    })
    it('should update existing blog with correct data', async () => {
        const testBlog = await blogTestRepository.createBlog(correctBodyBlog)
        await blogTestRepository.update(
            testBlog.id,
            updatedCorrectBodyBlog,
            204)
        const getResult = await blogTestRepository.getById(testBlog.id)
        expect(getResult).toMatchObject(updatedCorrectBodyBlog)
    })
    it(`shouldn't delete blog with incorrect id`, async () => {
        const testBlog = await blogTestRepository.createBlog(correctBodyBlog)
        await blogTestRepository.delete(randomObjectId, 404)
        const getResult = await blogTestRepository.getById(testBlog.id)
        expect(getResult).toEqual(testBlog)
    })
    it(`shouldn't delete existing blog with incorrect authorization`, async () => {
        const testBlog = await blogTestRepository.createBlog(correctBodyBlog)
        await blogTestRepository.delete(testBlog.id, 401, incorrectLogin)
        const getResult = await blogTestRepository.getById(testBlog.id)
        expect(getResult).toEqual(testBlog)
    })
    it(`should delete existing blog`, async () => {
        const testBlog = await blogTestRepository.createBlog(correctBodyBlog)
        await blogTestRepository.delete(testBlog.id, 204)
        await blogTestRepository.getById(testBlog.id, 404)
    })
})
