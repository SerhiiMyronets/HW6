//presentation input models
export type PostInputModel = {
    title: string
    shortDescription: string
    content: string
    blogId: string
}

export type PostUpdateInputModel = PostInputModel & {postId: string}
export type PostInputByBlogModel = Omit<PostInputModel, 'blogId'>

export type FindPostsPaginateModel = {
    pageNumber: number
    pageSize: number
    sortBy: string
    sortDirection: "asc" | "desc"
}
//presentation view models
export type PostViewModel = {
    id: string
    title: string
    shortDescription: string
    content: string
    blogId: string
    blogName: string
    createdAt: Date
    extendedLikesInfo: extendedLikesInfoViewModel
}

export type extendedLikesInfoViewModel = {
    likesCount: number
    dislikesCount: number
    myStatus: string
    newestLikes: newestLikesViewModel[]
}
export type newestLikesViewModel= {
    addedAt: Date,
    userId: string,
    login: string
}

export type PostViewModelPaginated = {
    pagesCount: number
    page: number
    pageSize: number
    totalCount: number
    items: PostViewModel[]
}
