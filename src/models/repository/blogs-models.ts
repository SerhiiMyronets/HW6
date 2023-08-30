//presentations input models
export type BlogInputModel = {
    name: string
    description: string
    websiteUrl: string
}
export type findBlogsPaginateModel = {
    searchNameTerm: string
    sortBy: string
    sortDirection: "asc" | "desc"
    pageNumber: number
    pageSize: number
}
//presentations view models
export type BlogViewModel = {
    id: string
    name: string
    description: string
    websiteUrl: string
    createdAt: string
    isMembership: boolean
}
export type BlogViewPaginatedModel = {
    pagesCount: number
    page: number
    pageSize: number
    totalCount: number
    items: BlogViewModel[]
}
