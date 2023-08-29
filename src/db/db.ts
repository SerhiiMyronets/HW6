import {MongoClient} from 'mongodb'
import 'dotenv/config'
import {BlogInputMongoDB, PostInputMongoDB, UsersInputMongoDB} from "../models/db-models";
import {settings} from "../setting";

const mongoURI = settings.MONGO_URI
if (!mongoURI) {
    throw new Error('URI doesnt found!!!!!')
}
export const client = new MongoClient(mongoURI)

const db = client.db("social_media");
export const blogsCollection = db.collection<BlogInputMongoDB>("blogs");
export const postsCollection = db.collection<PostInputMongoDB>("posts");
export const usersCollection = db.collection<UsersInputMongoDB>("users");

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