import Router from 'koa-router'
import UserController from '../controller/user.controller.js'
import { verifyUser } from '../middleware/user.middleware.js'
import jwt from 'koa-jwt'
import { secret } from '../pwd.js'

const auth = jwt({ secret })

const userRouter = new Router()

userRouter.post('/login', verifyUser, UserController.verifyAndGetToken)
userRouter.get('/checkToken', auth,UserController.checkToken)

export default userRouter