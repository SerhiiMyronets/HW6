import {MongoClient} from 'mongodb'
import {BlogStructureMongoDB} from "../models/blogs-models";
import {PostStructureMongoDB} from "../models/posts-models";
import 'dotenv/config'

const mongoURI = 'mongodb://localhost:27017/'//process.env.MONGO_URI || "mongodb+srv://hardmail88:3846MrN1@cluster0.0goknaf.mongodb.net/?retryWrites=true&w=majority"
if (!mongoURI) {
    throw new Error('URI doesnt found!!')
}
export const client = new MongoClient(mongoURI)

const db = client.db("social_media");
export const blogsCollection = db.collection<BlogStructureMongoDB>("blogs");
export const postsCollection = db.collection<PostStructureMongoDB>("posts");

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