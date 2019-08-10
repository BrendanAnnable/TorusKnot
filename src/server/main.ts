import Koa from 'koa'
import compress from 'koa-compress'
import serve from 'koa-static'
import path from 'path'

const app = new Koa()

app.use(async (ctx, next) => {
  try {
    await next()
  } catch (err) {
    err.status = err.statusCode || err.status || 500
    throw err
  }
})

app.use(compress())

app.use(serve(path.join(__dirname, '../../dist')))

const port = process.env.PORT || 3000
app.listen(port, () => {
  console.log('Server listening on port', port)
})
