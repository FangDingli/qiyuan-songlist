import app from './src/app/index.js'
import config from './config.js'
import "./src/app/database.js"

app.listen(config.SERVER_PORT, () => {
  console.log(`server is running at ${config.SERVER_PORT}`)
})