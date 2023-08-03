import {MongoClient} from 'mongodb'
import {BlogViewModel} from "../models/blogs-models";
import {PostViewModel} from "../models/posts-models";
import 'dotenv/config'

const mongoURI = process.env.MONGO_URI
if (!mongoURI) {
    throw new Error('URI doesnt found')
}
export const client = new MongoClient(mongoURI)

const db = client.db("social_media");
export const blogsCollection = db.collection<BlogViewModel>("blogs");
export const postsCollection = db.collection<PostViewModel>("posts");

export async function runDb() {
    try {
        await client.connect()
        await client.db('HW').command({ping: 1})
        console.log('Connected successfully to mongo server')
    } catch (e) {
        console.log('Cant connect to mongo server')
        await client.close()
    }
}