import {randomUUID} from "crypto";


export class BlogDBType {
    createdAt: Date
    isMembership: boolean

    constructor(public name: string,
                public description: string,
                public websiteUrl: string) {
        this.createdAt = new Date()
        this.isMembership = false
    }
}

export class PostDBType {
    createdAt: Date

    constructor(public title: string,
                public shortDescription: string,
                public content: string,
                public blogId: string,
                public blogName: string,
    ) {
        this.createdAt = new Date()
    }
}

export class UsersBDType {
    accountData: {
        login: string
        email: string
        password: string
        createdAt: Date
    }
    emailConfirmation: {
        confirmationCode: string
        expirationDate: Date
        isConfirmed: boolean
    }

    constructor(login: string,
                email: string,
                password: string,
                expirationDate: Date) {
        this.accountData = {
            login,
            email,
            password,
            createdAt: new Date()
        }
        this.emailConfirmation = {
            confirmationCode: randomUUID(),
            expirationDate,
            isConfirmed: false
        }
    }
}

export class PasswordRecoveryDBType {
    confirmationCode: string

    constructor(public userId: string,
                public email: string,
                public expirationDate: Date) {
        this.confirmationCode = randomUUID()
    }
}

export class CommentDBType {
    createdAt: Date
    likesInfo: {
        likesCount: number,
        dislikesCount: number
    }

    constructor(public postId: string,
                public content: string,
                public commentatorInfo: {
                    userId: string,
                    userLogin: string
                }
    ) {
        this.createdAt = new Date()
        this.likesInfo = {
            likesCount: 0,
            dislikesCount: 0
        }
    }
}

export class LikeInfoType {
    public createdAt: Date

    constructor(public userId: string,
                public objectType: string,
                public objectId: string,
                public parentObjectType: string,
                public parentObjectId: string,
                public likeStatus: string
    ) {
        this.createdAt = new Date()
    }
}

export class DeviceAuthSessionDBType {
    constructor(
        public userId: string,
        public deviceId: string,
        public deviceName: string,
        public IP: string,
        public issuedAt: Date,
        public expiredAt: Date) {
    }
}

export class ApiRequestDatabaseDBType {
    date: Date
    constructor(public IP: string,
                public URL: string,
    ) {
        this.date = new Date()
    }
}