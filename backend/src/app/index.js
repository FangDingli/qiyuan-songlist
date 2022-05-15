import Koa from 'koa'
import bodyParser from 'koa-bodyparser'
import error from 'koa-json-error'
import listRouter from '../router/list.router.js'
import userRouter from '../router/user.router.js'

const app = new Koa()

app.use(async (ctx, next) => {
  ctx.set('Access-Control-Allow-Origin', '*');
  ctx.set('Access-Control-Allow-Headers', 'Content-Type, Content-Length, Authorization, Accept, X-Requested-With ');
  ctx.set('Access-Control-Allow-Methods', 'PUT, POST, GET, DELETE, OPTIONS');
  if (ctx.method == 'OPTIONS') {
    ctx.body = 200;
  } else {
    await next();
  }
})
app.use(error(e => {
  return {
    status: e.status,
    message: e.message
  }
}))
app.use(bodyParser())
app.use(listRouter.routes())
app.use(userRouter.routes())
app.use(listRouter.allowedMethods())

export default app
