import mongoose, {HydratedDocument, Model} from "mongoose";
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
import {UserModel} from "./db";
import {randomUUID} from "crypto";
import add from "date-fns/add";
import {settings} from "../setting";
import {newestLikesViewModel} from "../models/repository/posts-models";


export const BlogSchema = new mongoose.Schema<BlogDBType>({
    name: {type: String, require: true},
    description: {type: String, require: true},
    websiteUrl: {type: String, require: true},
    createdAt: {type: Date},
    isMembership: {type: Boolean}
})


export const PostSchema = new mongoose.Schema<PostDBType>({
    title: {type: String, require: true},
    shortDescription: {type: String, require: true},
    content: {type: String, require: true},
    blogId: {type: String, require: true},
    blogName: {type: String, require: true},
    createdAt: {type: Date},
    extendedLikesInfo: {
        likesCount: {type: Number, require: true},
        dislikesCount: {type: Number, require: true},
        newestLikes: [{
            addedAt: Date,
            userId: String,
            login: String,
            _id: false
        }]
    }
})


export const PasswordRecoverySchema = new mongoose.Schema<PasswordRecoveryDBType>({
    userId: {type: String, require: true},
    email: {type: String, require: true},
    confirmationCode: {type: String},
    expirationDate: {type: Date}
})

export type UsersBDMethodsType = {
    canBeConfirmed: () => boolean
    confirm: () => void
}

export type UserModelType = Model<UsersBDType, {}, UsersBDMethodsType>

export type UserModelStaticType = Model<UsersBDType> & {
    makeInstance(login: string, email: string, passHash: string): HydratedDocument<UsersBDType, UsersBDMethodsType>
}

export type UserModelFullType = UserModelType & UserModelStaticType

export const UserSchema = new mongoose.Schema<UsersBDType, UserModelFullType, UsersBDMethodsType>({
    accountData: {
        login: {type: String, require: true},
        email: {type: String, require: true},
        password: {type: String, require: true},
        createdAt: {type: Date}
    },
    emailConfirmation: {
        confirmationCode: {type: String},
        expirationDate: {type: Date},
        isConfirmed: {type: Boolean}
    }
})
UserSchema.method('canBeConfirmed', function canBeConfirmed() {
    const that = this as UsersBDType
    return that.emailConfirmation.isConfirmed && (that.emailConfirmation.expirationDate < new Date())
})

UserSchema.static('makeInstance', function makeInstance(login: string, email: string, passHash: string) {
    return new UserModel({
        accountData: {
            login,
            email,
            passHash,
            createdAt: new Date()
        },
        emailConfirmation: {
            confirmationCode: randomUUID(),
            expirationDate: add(new Date(), settings.EMAIL_CONFIRMATION_CODE_EXP),
            isConfirmed: false
        }
    })
})

UserSchema.method('confirm', function confirm() {
    const that = this as UsersBDType
    that.emailConfirmation.isConfirmed = true
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
    userLogin: {type: String, require: true},
    objectType: {type: String, require: true},
    objectId: {type: String, require: true},
    parentObjectType: {type: String, require: true},
    parentObjectId: {type: String, require: true},
    likeStatus: {type: String, require: true},
    createdAt: {type: Date, required: true}
})

export const DeviceAuthSessionsSchema = new mongoose.Schema<DeviceAuthSessionDBType>({
    userId: {type: String, require: true},
    deviceId: {type: String, require: true},
    deviceName: {type: String, require: true},
    IP: {type: String, require: true},
    issuedAt: {type: Date, required: true},
    expiredAt: {type: Date, required: true}
})
export const ApiRequestDatabaseSchema = new mongoose.Schema<ApiRequestDatabaseDBType>({
    IP: {type: String, require: true},
    URL: {type: String, require: true},
    date: {type: Date, required: true}
})
