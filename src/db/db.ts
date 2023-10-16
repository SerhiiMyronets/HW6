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
    UserModelFullType,
    UserSchema
} from "./mongo-db-schemas";

const dbName = 'social_media'
export const mongooseURI = process.env.MONGOOSE_URI || `mongodb+srv://hardmail88:3846MrN1@cluster0.0goknaf.mongodb.net/${dbName}?retryWrites=true&w=majority`

export const BlogModel = mongoose.model<BlogDBType>('blogs', BlogSchema)
export const PostModel = mongoose.model<PostDBType>('posts', PostSchema)
export const UserModel = mongoose.model<UsersBDType, UserModelFullType>('users', UserSchema)
export const CommentModel = mongoose.model<CommentDBType>('comments', CommentSchema)
export const LikeInfoModel = mongoose.model<LikeInfoType>('likeInfo', LikesInfoSchema)
export const DeviceAuthSessionsModel = mongoose.model<DeviceAuthSessionDBType>('deviceAuthSessions', DeviceAuthSessionsSchema)
export const ApiRequestDatabaseModel = mongoose.model<ApiRequestDatabaseDBType>('apiRequestDatabase', ApiRequestDatabaseSchema)
export const PasswordRecoveryModel = mongoose.model<PasswordRecoveryDBType>('passwordRecovery', PasswordRecoverySchema)


export async function runDb() {
    try {
        await mongoose.connect(mongooseURI)
        console.log('Connected successfully to mongo server')
    } catch (e) {
        console.log('Cant connect to mongo server')
        await mongoose.disconnect()
    }
}