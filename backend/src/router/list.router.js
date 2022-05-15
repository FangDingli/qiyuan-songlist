import Router from 'koa-router'
import ListController from '../controller/list.controller.js'
import jwt from 'koa-jwt'
import { secret } from '../pwd.js'

const auth = jwt({ secret })

const listRouter = new Router()

listRouter.get("/songList", ListController.querySongList)

listRouter.post("/songList", auth, ListController.addSong)

listRouter.put("/songList", auth, ListController.updateSongInfo)

listRouter.delete("/songList", auth, ListController.deleteSong)

listRouter.get("/languageDict", ListController.queryLanguageDict)

listRouter.get("/keywordDict", ListController.queryKeywordDict)

// listRouter.get("/resetTableId", ListController.resetTableId)


export default listRouter