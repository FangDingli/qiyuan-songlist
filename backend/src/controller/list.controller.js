import listService from '../service/list.service.js'


class ListController {
  async querySongList(ctx) {
    const result = await listService.query('songlist')
    if (!result) ctx.throw(500)
    ctx.body = result
  }

  async addSong(ctx) {
    const songInfo = ctx.request.body
    const result = await listService.create(songInfo)
    if (result[0].warningStatus !== 0) ctx.throw(500)
    ctx.body = '操作成功'
  }

  async updateSongInfo(ctx) {
    const songInfo = ctx.request.body
    const result = await listService.updateSongInfo(songInfo)
    if (result[0].warningStatus !== 0) ctx.throw(500)
    ctx.body = '操作成功'
  }

  async deleteSong(ctx) {
    const { id } = ctx.request.query
    const result = await listService.deleteSong(id)
    if (result[0].warningStatus !== 0) ctx.throw(500)
    ctx.body = '操作成功'
  }

  async queryLanguageDict(ctx) {
    const result = await listService.query('songlanguage')
    if (!result) ctx.throw(500)
    ctx.body = result
  }

  async queryKeywordDict(ctx) {
    const result = await listService.query('songkeyword')
    if (!result) ctx.throw(500)
    ctx.body = result
  }

  async resetTableId(ctx) {
    const result = await listService.resetTableId('songlist')
    if (!result) ctx.throw(500)
    ctx.body = result
  }
}

export default new ListController()