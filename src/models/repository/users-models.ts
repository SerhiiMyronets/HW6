//presentations input models

export type UserInputModel = {
    login: string
    password: string
    email: string
}
export type FindUserPaginateModel = {
    searchLoginTerm: string
    searchEmailTerm: string
    sortBy: string
    sortDirection: "asc" | "desc"
    pageNumber: number
    pageSize: number
}
//presentations view models
export type UserViewModel = {
    id: string
    login: string
    email: string
    createdAt: Date
}

export type UserViewPaginatedModel = {
    pagesCount: number
    pageSize: number
    page: number
    totalCount: number
    items: UserViewModel[]
}
//auth
export type AuthModel = {
    loginOrEmail: string
    password: string
}
export type AuthViewModel = {
    accessToken: string
}
export type ResendConfirmationCodeInputModel = {
    email: string
}
export type PasswordRecoveryInputModel = {
    email: string
}
export type NewPasswordInputModel = {
    newPassword: string,
    recoveryCode: string
}
export type EmailBodyModel = {
    from: string
    to: string
    subject: string
    html: string
}
export type RegistrationConfirmationCodeModel = {
    code: string
}
export type ConfirmationCodeUpdateModel = {
    'emailConfirmation.confirmationCode': string
    'emailConfirmation.expirationDate': Date
}

//me
export type MeViewUserModel = {
    email: string
    login: string
    userId: string
}

// security device
export type DeviceViewModel = {
    ip: string
    title: string
    lastActiveDate: Date
    deviceId: string
}
