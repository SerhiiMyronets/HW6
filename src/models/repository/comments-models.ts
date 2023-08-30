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
//presentations view models
export type CommentatorInfo = {
    userId: string
    userLogin: string
}
export type CommentViewModel = {
    id: string
    content: string
    commentatorInfo: CommentatorInfo
    createdAt: string
}
export type CommentsViewModelPaginated = {
    pagesCount: number
    page: number
    pageSize: number
    totalCount: number
    items: CommentViewModel[]
}
