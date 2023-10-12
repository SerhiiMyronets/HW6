export type AccessRefreshTokensModel = {
    accessToken: string
    refreshToken: string
}

export type RefreshTokenPayloadModel = {
    userId: string
    deviceId: string
    issuedAt: Date
    expiredAt: Date
}

export type AuthInputModel = {
    userId: string
    deviceName: string
    IP: string
}