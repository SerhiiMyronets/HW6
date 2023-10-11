import {CommentsDbRepository} from "./repositories/db-repositories/comments-db-repository";
import {CommentsQueryRepository} from "./repositories/query-repositories/comments-query-repository";
import {CommentsService} from "./domain/comments-service";
import {LikesInfoQueryRepository} from "./repositories/query-repositories/likes-info-query-repository";

export const commentsDbRepository = new CommentsDbRepository()
export const likesInfoQueryRepository = new LikesInfoQueryRepository()
export const commentsQueryRepository = new CommentsQueryRepository()
export const commentsService = new CommentsService()
