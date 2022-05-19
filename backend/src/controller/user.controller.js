import { username, password, secret } from '../pwd.js'
import jwt from 'jsonwebtoken'

class UserController {
  async verifyAndGetToken(ctx) {
    const { username: usr, password: pwd } = ctx.request.body
    if (usr === username && pwd === password) {
      const token = jwt.sign({ username: usr, password: pwd }, secret, { expiresIn: '1d' })
      ctx.body = { token }
    } else {
      ctx.throw(401, '用户名或密码错误')
    }
  }
  
  async checkToken(ctx) {
    ctx.body = ''
  }
}

export default new UserController()