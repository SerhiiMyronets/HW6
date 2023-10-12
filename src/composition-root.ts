import {CommentsDbRepository} from "./repositories/db-repositories/comments-db-repository";
import {CommentsQueryRepository} from "./repositories/query-repositories/comments-query-repository";
import {CommentsService} from "./domain/comments-service";
import {LikesInfoQueryRepository} from "./repositories/query-repositories/likes-info-query-repository";
import {CommentsController} from "./controllers/comments-controller";
import {LikesInfoDbRepository} from "./repositories/db-repositories/likes-info-db-repository";
import {PostsRepository} from "./repositories/db-repositories/post-db-repository";
import {PostsQueryRepository} from "./repositories/query-repositories/posts-query-repository";
import {PostsService} from "./domain/posts-service";
import {BlogsDBRepository} from "./repositories/db-repositories/blogs-db-repository";
import {PostController} from "./controllers/post-controller";
import {BlogsService} from "./domain/blogs-service";
import {BlogsQueryRepository} from "./repositories/query-repositories/blogs-query-repository";
import {BlogsController} from "./controllers/blogs-controller";
import {UsersDBRepository} from "./repositories/db-repositories/users-db-repository";
import {UsersQueryRepository} from "./repositories/query-repositories/users-query-repository";
import {UsersService} from "./domain/users-service";

import {UserController} from "./controllers/user-controller";
import {AuthService} from "./domain/auth-service";
import {EmailManager} from "./managers/email-manager";
import {EmailAdapter} from "./adapters/email-adapter";
import {DeviceAuthSessionsDbRepository} from "./repositories/db-repositories/device-auth-sessions-db-repository";
import {JwtService} from "./appliacation/jwt-service";
import {PasswordRecoveryDbRepository} from "./repositories/db-repositories/password-recovery-db-repository";
import {AuthController} from "./controllers/auth-controller";

import {SessionsController} from "./controllers/sessions-controller";

export const blogsDBRepository = new BlogsDBRepository()
export const blogsQueryRepository = new BlogsQueryRepository()
export const blogsService = new BlogsService(blogsDBRepository)

export const likesInfoDBRepository = new LikesInfoDbRepository()
export const likesInfoQueryRepository = new LikesInfoQueryRepository()

export const commentsDBRepository = new CommentsDbRepository()
export const commentsQueryRepository = new CommentsQueryRepository()
export const commentsService = new CommentsService(
    commentsDBRepository, likesInfoDBRepository)

export const postsQueryRepository = new PostsQueryRepository()
export const postsRepository = new PostsRepository()
export const postsService = new PostsService(
    postsRepository, blogsDBRepository)

export const usersDBRepository = new UsersDBRepository()
export const usersQueryRepository = new UsersQueryRepository()
export const usersService = new UsersService(usersDBRepository)

export const deviceAuthSessionsDbRepository = new DeviceAuthSessionsDbRepository()

export const jwtService = new JwtService()

export const passwordRecoveryDbRepository = new PasswordRecoveryDbRepository()



export const emailAdapter = new EmailAdapter()
export const emailManager = new EmailManager(emailAdapter)

export const authService = new AuthService(
    usersDBRepository, emailManager, deviceAuthSessionsDbRepository, jwtService, passwordRecoveryDbRepository)


export const commentsController = new CommentsController(
    commentsService, commentsQueryRepository, likesInfoQueryRepository)
export const postController = new PostController(
    postsQueryRepository, postsService, commentsService, commentsQueryRepository, likesInfoQueryRepository)
export const blogController = new BlogsController(
    blogsQueryRepository, blogsService, postsQueryRepository, postsService)
export const userController = new UserController(usersQueryRepository, usersService)
export const authController = new AuthController(authService)
export const sessionsController = new SessionsController(authService)