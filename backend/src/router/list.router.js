import Router from 'koa-router'
import ListController from '../controller/list.controller.js'

const listRouter = new Router()

listRouter.get("/getSongList", ListController.querySongList)


export default listRouter