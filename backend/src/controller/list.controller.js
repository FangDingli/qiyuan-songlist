import listService from '../service/list.service.js'

class ListController {
  async querySongList(ctx) {
    const result = await listService.query()

    ctx.body = result
  }

  async createSong(ctx) {
    const songInfo = ctx.request.body

    ctx.body = await listService.create(songInfo)
  }
}

export default new ListController()