import mongoose from 'mongoose'
import 'dotenv/config'
import {
    ApiRequestDatabaseMongoDBModel,
    BlogMongoDBModel,
    CommentDBType,
    DeviceAuthSessionMongoDBModel,
    LikeInfoType,
    PasswordRecoveryMongoDBModel,
    PostMongoDBModel,
    UsersMongoDBModel
} from "./db-models";
import {
    ApiRequestDatabaseSchema,
    BlogSchema,
    CommentSchema,
    DeviceAuthSessionsSchema,
    LikesInfoSchema,
    PasswordRecoverySchema,
    PostSchema,
    UserSchema
} from "./mongo-db-schemas";

const dbName = 'social_media'
export const mongooseURI = process.env.MONGOOSE_URI || `mongodb+srv://hardmail88:3846MrN1@cluster0.0goknaf.mongodb.net/${dbName}?retryWrites=true&w=majority`

export const BlogModel = mongoose.model<BlogMongoDBModel>('blogs', BlogSchema)
export const PostModel = mongoose.model<PostMongoDBModel>('posts', PostSchema)
export const UserModel = mongoose.model<UsersMongoDBModel>('users', UserSchema)
export const CommentModel = mongoose.model<CommentDBType>('comments', CommentSchema)
export const LikeInfoModel = mongoose.model<LikeInfoType>('likeInfo', LikesInfoSchema)
export const DeviceAuthSessionsModel = mongoose.model<DeviceAuthSessionMongoDBModel>('deviceAuthSessions', DeviceAuthSessionsSchema)
export const ApiRequestDatabaseModel = mongoose.model<ApiRequestDatabaseMongoDBModel>('apiRequestDatabase', ApiRequestDatabaseSchema)
export const PasswordRecoveryModel = mongoose.model<PasswordRecoveryMongoDBModel>('passwordRecovery', PasswordRecoverySchema)

// const mongoURI = process.env.MONGO_URI || "mongodb+srv://hardmail88:3846MrN1@cluster0.0goknaf.mongodb.net/?retryWrites=true&w=majority"
// if (!mongoURI) throw new Error('URI doesn't found!')
// export const client = new MongoClient(mongoURI)
// const db = client.db("social_media");
// export const blogsCollection = db.collection<BlogMongoDBModel>("blogs")
// export const postsCollection = db.collection<PostMongoDBModel>("posts");
// export const usersCollection = db.collection<UsersMongoDBModel>("users");
// export const commentsCollection = db.collection<CommentMongoDBModel>("comments");
// export const deviceAuthSessionsCollection = db.collection<DeviceAuthSessionMongoDBModel>("deviceAuthSessions");
// export const apiRequestDatabaseCollection = db.collection<ApiRequestDatabaseMongoDBModel>('apiRequestDatabase')

export async function runDb() {
    try {
        await mongoose.connect(mongooseURI)
        // await client.connect()
        // await client.db('HW').command({ping: 1})
        console.log('Connected successfully to mongo server')
    } catch (e) {
        console.log('Cant connect to mongo server')
        await mongoose.disconnect()
        // await client.close()
    }
}