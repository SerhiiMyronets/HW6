import {query} from "express-validator";

export const blogsQueryValidation = [
    query("searchNameTerm").default(""),
    query("pageNumber").default("1"),
    query("pageSize").default("10"),
    query("sortDirection").default("desc"),
    query("sortBy").default("createdAt")
]