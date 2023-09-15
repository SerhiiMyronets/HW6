import {MongoClient} from 'mongodb'
import 'dotenv/config'
import {
    apiRequestDatabase,
    BlogMongoDBModel,
    CommentMongoDBModel,
    PostMongoDBModel,
    RefreshTokenBlackListMongoInputDB,
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
export const tokenBlackListCollection = db.collection<RefreshTokenBlackListMongoInputDB>("refreshTokenBlackList");
export const apiRequestDatabaseCollection = db.collection<apiRequestDatabase>('apiRequestDatabase')

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