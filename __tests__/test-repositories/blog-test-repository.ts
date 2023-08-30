// @ts-ignore
import request from 'supertest'
import {app, RouterPaths} from "../../src/setting";
import {BlogInputModel} from "../../src/models/repository/blogs-models";
import {correctLogin} from "../test-inputs/blogs-test-inputs";
import {ErrorType} from "../../src/midlewares/errors-format-middleware";
import {UsersInputModel} from "../../src/models/repository/users-models";

const createUserForTest = async (inputModel: UsersInputModel, saLogin: string, saPwd: string) => {
    return request(app).post('/users').auth(saLogin, saPwd).send(inputModel)
}

const createUsersForTest = async (count: number, inputModel: UsersInputModel, saLogin: string, saPwd: string) => {
    const users = []
    for (let i = 0; i < count; i++) {
        const iM: UsersInputModel = {
            login: `${inputModel.login}${i}`,
            email: `${inputModel.email}${i}`,
            password: inputModel.password,
        }
        const user = await createUserForTest(iM, saLogin, saPwd)
        users.push(user.body)
    }
    return users
}

//it1 401 cr => saLogin: ''
//it2 401 cr => saLogin: 'any'
//it3 not 401 cr => saLogin: 'ok'

//it10...

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
        const res = request(app)
            .post(RouterPaths.blogs)
            .set("Authorization", auth)
            .send(body)

        return errors ? res.expect(code, errors) : res.expect(code)

        // if (!errors) {
        //     return request(app)
        //         .post(RouterPaths.blogs)
        //         .set("Authorization", auth)
        //         .send(body)
        //         .expect(code)
        // } else {
        //     return request(app)
        //         .post(RouterPaths.blogs)
        //         .set("Authorization", auth)
        //         .send(body)
        //         .expect(code, errors)
        // }
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

