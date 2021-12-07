import connection from '../app/database.js'

class ListService {
  async query() {
    const statement = "select * from songlist"
    const result = await connection.query(statement)
    return result[0]
  }

  async create(songInfo) {
    const { original_name, searched_name, singer } = songInfo

    if (searched_name.length == 0) {
      searched_name = original_name
    }

    const statement = "INSERT INTO songlist (original_name,searched_name,singer) VALUES (?,?,?)"
    return await connection.execute(statement, [original_name, searched_name, singer])
  }
}

export default new ListService()