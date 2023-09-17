import {MongoClient} from 'mongodb'
import 'dotenv/config'
import {
    ApiRequestDatabaseModel,
    BlogMongoDBModel,
    CommentMongoDBModel,
    PostMongoDBModel,
    DeviceAuthSessionsModel,
    UsersMongoDBModel
} from "./db-models";

const mongoURI = process.env.MONGO_URI || "mongodb+srv://hardmail88:3846MrN1@cluster0.0goknaf.mongodb.net/?retryWrites=true&w=majority"
if (!mongoURI) {
    throw new Error('URI doesnt found!!!!!')
}
export const client = new MongoClient(mongoURI)

const db = client.db("social_media");
export const blogsCollection = db.collection<BlogMongoDBModel>("blogs")
export const postsCollection = db.collection<PostMongoDBModel>("posts");
export const usersCollection = db.collection<UsersMongoDBModel>("users");
export const commentsCollection = db.collection<CommentMongoDBModel>("comments");
export const deviceAuthSessionsCollection = db.collection<DeviceAuthSessionsModel>("deviceAuthSessions");
export const apiRequestDatabaseCollection = db.collection<ApiRequestDatabaseModel>('apiRequestDatabase')

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