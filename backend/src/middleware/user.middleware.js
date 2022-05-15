export const verifyUser = async (ctx, next) => {
  const { username, password } = ctx.request.body

  if (!username || !password || username === '' || password === '') {
    ctx.throw(400, '用户名密码不能为空')
  }

  await next()
}