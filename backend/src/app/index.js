import Koa from 'koa'
import bodyParser from 'koa-bodyparser'
import listRouter from '../router/list.router.js'

const app = new Koa()

app.use(async (ctx, next) => {
  ctx.set('Access-Control-Allow-Origin', '*');
  ctx.set('Access-Control-Allow-Headers', 'Content-Type, Content-Length, Authorization, Accept, X-Requested-With');
  ctx.set('Access-Control-Allow-Methods', 'PUT, POST, GET, DELETE, OPTIONS');
  if (ctx.method == 'OPTIONS') {
    ctx.body = 200;
  } else {
    await next();
  }
})

app.use(bodyParser())
app.use(listRouter.routes())
app.use(listRouter.allowedMethods())

export default app
