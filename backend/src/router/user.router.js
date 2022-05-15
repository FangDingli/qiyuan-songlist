import Router from 'koa-router'
import UserController from '../controller/user.controller.js'
import { verifyUser } from '../middleware/user.middleware.js'

const userRouter = new Router()

userRouter.post('/login', verifyUser, UserController.verifyAndGetToken)

export default userRouter