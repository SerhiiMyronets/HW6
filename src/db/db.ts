import {MongoClient} from 'mongodb'
import mongoose from 'mongoose'
import 'dotenv/config'
import {
    ApiRequestDatabaseModel,
    BlogMongoDBModel,
    CommentMongoDBModel,
    DeviceAuthSessionsModel,
    PostMongoDBModel,
    UsersMongoDBModel
} from "./db-models";
import {BlogSchema} from "./mongo-db-schemas";

//const dbName = 'social_media'
const mongoURI = process.env.MONGO_URI || "mongodb+srv://hardmail88:3846MrN1@cluster0.0goknaf.mongodb.net/?retryWrites=true&w=majority"
export const mongooseURI = process.env.MONGOOSE_URI || "mongodb+srv://hardmail88:3846MrN1@cluster0.0goknaf.mongodb.net/social_media?retryWrites=true&w=majority"
if (!mongoURI) throw new Error('URI doesnt found!')

export const client = new MongoClient(mongoURI)

const db = client.db("social_media");
export const BlogModel = mongoose.model<BlogMongoDBModel>('blogs', BlogSchema)


//export const blogsCollection = db.collection<BlogMongoDBModel>("blogs")
export const postsCollection = db.collection<PostMongoDBModel>("posts");
export const usersCollection = db.collection<UsersMongoDBModel>("users");
export const commentsCollection = db.collection<CommentMongoDBModel>("comments");
export const deviceAuthSessionsCollection = db.collection<DeviceAuthSessionsModel>("deviceAuthSessions");
export const apiRequestDatabaseCollection = db.collection<ApiRequestDatabaseModel>('apiRequestDatabase')

export async function runDb() {
    try {
        await mongoose.connect(mongooseURI)
        await client.connect()
        await client.db('HW').command({ping: 1})
        console.log('Connected successfully to mongo server')
    } catch (e) {
        console.log('Cant connect to mongo server')
        await mongoose.disconnect()
        await client.close()
    }
}