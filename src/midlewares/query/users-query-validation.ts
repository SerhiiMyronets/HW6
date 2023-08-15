import {query} from "express-validator";

export const usersQueryValidation = [
    query("searchLoginTerm").default(""),
    query("searchEmailTerm").default(""),
    query("sortBy").default("createdAt"),
    query("sortDirection").default("desc"),
    query("pageNumber").default("1"),
    query("pageSize").default("10")

]