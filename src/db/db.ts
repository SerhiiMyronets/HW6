import mongoose from 'mongoose'
import 'dotenv/config'
import {
    ApiRequestDatabaseDBType,
    BlogDBType,
    CommentDBType,
    DeviceAuthSessionDBType,
    LikeInfoType,
    PasswordRecoveryDBType,
    PostDBType,
    UsersBDType
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

export const BlogModel = mongoose.model<BlogDBType>('blogs', BlogSchema)
export const PostModel = mongoose.model<PostDBType>('posts', PostSchema)
export const UserModel = mongoose.model<UsersBDType>('users', UserSchema)
export const CommentModel = mongoose.model<CommentDBType>('comments', CommentSchema)
export const LikeInfoModel = mongoose.model<LikeInfoType>('likeInfo', LikesInfoSchema)
export const DeviceAuthSessionsModel = mongoose.model<DeviceAuthSessionDBType>('deviceAuthSessions', DeviceAuthSessionsSchema)
export const ApiRequestDatabaseModel = mongoose.model<ApiRequestDatabaseDBType>('apiRequestDatabase', ApiRequestDatabaseSchema)
export const PasswordRecoveryModel = mongoose.model<PasswordRecoveryDBType>('passwordRecovery', PasswordRecoverySchema)

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