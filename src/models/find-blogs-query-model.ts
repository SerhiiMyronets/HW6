export type findBlogsQueryModel = {
    searchNameTerm: string
    sortBy: string
    sortDirection: "asc" | "desc"
    pageNumber: number
    pageSize: number
}

export type findPostsByIdQueryModel = {
    pageNumber: number
    pageSize: number
    sortBy: string
    sortDirection: "asc" | "desc"
}

export enum sortDirectionList {
    "asc" = 1,
    "desc" = -1
}