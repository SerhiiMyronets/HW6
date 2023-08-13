export type findPostsQueryModel = {
    pageNumber: number
    pageSize: number
    sortBy: string
    sortDirection: "asc" | "desc"
}
export enum sortDirectionList {
    "asc" = 1,
    "desc" = -1
}