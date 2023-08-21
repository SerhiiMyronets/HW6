import {query} from "express-validator";

export const usersQueryValidation = [
    query("searchLoginTerm").default(null),
    query("searchEmailTerm").default(null),
    query("sortBy").default("createdAt"),
    query("sortDirection").default("desc"),
    query("pageNumber").default("1"),
    query("pageSize").default("10")

]