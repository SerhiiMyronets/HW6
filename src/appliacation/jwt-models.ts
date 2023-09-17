export type AccessRefreshTokensModel = {
    accessToken: string
    refreshToken: string
}

export type refreshTokenPayload = {
    userId: string
    deviceId: string
    issuedAt: Date
    expiredAt: Date
}

export type authInputModel = {
    userId: string
    deviceName: string
    IP: string
}