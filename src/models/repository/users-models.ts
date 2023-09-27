//presentations input models

export type UserInputModel = {
    login: string
    password: string
    email: string
}
export type findUserPaginateModel = {
    searchLoginTerm: string
    searchEmailTerm: string
    sortBy: string
    sortDirection: "asc" | "desc"
    pageNumber: number
    pageSize: number
}
//presentations view models
export type UsersViewModel = {
    id: string
    login: string
    email: string
    createdAt: string
}

export type UserViewPaginatedModel = {
    pagesCount: number
    pageSize: number
    page: number
    totalCount: number
    items: UsersViewModel[]
}
//auth
export type AuthModel = {
    loginOrEmail: string
    password: string
}
export type AuthViewModel = {
    accessToken: string
}

export type PasswordRecoveryInputModel = {
    email: string
}
export type NewPasswordInputModel = {
    newPassword: string,
    recoveryCode: string
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
    lastActiveDate: string
    deviceId: string
}
