import mongoose from "mongoose";
import {
    AccountDataModel,
    ApiRequestDatabaseMongoDBModel,
    BlogMongoDBModel,
    CommentDBType,
    DeviceAuthSessionMongoDBModel,
    EmailConfirmationModel,
    LikeInfoType,
    PasswordRecoveryMongoDBModel,
    PostMongoDBModel,
    UsersMongoDBModel
} from "./db-models";


export const BlogSchema = new mongoose.Schema<BlogMongoDBModel>({
    name: {type: String, require: true},
    description: {type: String, require: true},
    websiteUrl: {type: String, require: true},
    createdAt: {type: Date},
    isMembership: {type: Boolean}
})
export const PostSchema = new mongoose.Schema<PostMongoDBModel>({
    title: {type: String, require: true},
    shortDescription: {type: String, require: true},
    content: {type: String, require: true},
    blogId: {type: String, require: true},
    blogName: {type: String, require: true},
    createdAt: {type: Date},
})
export const AccountDataSchema = new mongoose.Schema<AccountDataModel>({
    login: {type: String, require: true},
    email: {type: String, require: true},
    password: {type: String, require: true},
    createdAt: {type: Date}
})
export const EmailConfirmationSchema = new mongoose.Schema<EmailConfirmationModel>({
    confirmationCode: {type: String},
    expirationDate: {type: Date},
    isConfirmed: {type: Boolean}
})
export const PasswordRecoverySchema = new mongoose.Schema<PasswordRecoveryMongoDBModel>({
    userId: {type: String, require: true},
    email: {type: String, require: true},
    confirmationCode: {type: String},
    expirationDate: {type: Date}
})
export const UserSchema = new mongoose.Schema<UsersMongoDBModel>({
    accountData: AccountDataSchema,
    emailConfirmation: EmailConfirmationSchema
})

export const CommentSchema = new mongoose.Schema<CommentDBType>({
    postId: {type: String, require: true},
    content: {type: String, require: true},
    commentatorInfo: {
        userId: {type: String, require: true},
        userLogin: {type: String, require: true},
    },
    createdAt: {type: Date, required: true},
    likesInfo: {
        likesCount: {type: Number, require: true},
        dislikesCount: {type: Number, require: true}
    }
})

export const LikesInfoSchema = new mongoose.Schema<LikeInfoType>({
    userId: {type: String, require: true},
    objectType: {type: String, require: true},
    objectId: {type: String, require: true},
    parentObjectType: {type: String, require: true},
    parentObjectId: {type: String, require: true},
    likeStatus: {type: String, require: true},
    createdAt: {type: Date, required: true}
})

export const DeviceAuthSessionsSchema = new mongoose.Schema<DeviceAuthSessionMongoDBModel>({
    userId: {type: String, require: true},
    deviceId: {type: String, require: true},
    deviceName: {type: String, require: true},
    IP: {type: String, require: true},
    issuedAt: {type: Date, required: true},
    expiredAt: {type: Date, required: true}
})
export const ApiRequestDatabaseSchema = new mongoose.Schema<ApiRequestDatabaseMongoDBModel>({
    IP: {type: String, require: true},
    URL: {type: String, require: true},
    date: {type: Date, required: true}
})

// CommentSchema.methods = {
//     addLike(iserId: string, status: string) {
//         this.likes.find(() => {
//         })
//         this.likesCount += 1
//     }
// }
