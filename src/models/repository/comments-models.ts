//presentations input models
export type CommentInputModel = {
    content: string
}
export type findCommentsPaginateModel = {
    pageNumber: number
    pageSize: number
    sortBy: string
    sortDirection: "asc" | "desc"
}
export type LikeInputModel = {
    likeStatus: 0
}
//presentations view models
export type CommentatorInfo = {
    userId: string
    userLogin: string
}
export type CommentViewModel = {
    id: string
    content: string
    commentatorInfo: CommentatorInfo
    createdAt: Date
    likesInfo: LikesInfoViewModel
}
export type LikesInfoViewModel = {
    likesCount: number
    dislikesCount: number
    myStatus: string
}

export type CommentsViewModelPaginated = {
    pagesCount: number
    page: number
    pageSize: number
    totalCount: number
    items: CommentViewModel[]
}

export enum LikeStatusType {
    None,
    Like,
    Dislike
}

export type ParamInputModel = { id: string }