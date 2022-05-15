import connection from '../app/database.js'

class ListService {
  async query(tableName) {
    const statement = `select * from ${tableName}`
    const result = await connection.query(statement)
    return result[0]
  }

  async create(songInfo) {
    let statement = 'INSERT INTO songlist (original_name,singer,language,keyword) VALUES '
    songInfo.forEach(item => {
      statement += `('${item.original_name || null}','${item.singer || null}','${item.language || null}','${item.keyword || null}'),`
    })
    statement = statement.substring(0, statement.length - 1)

    return await connection.query(statement)
  }

  async updateSongInfo(songInfo) {
    let statement = 'REPLACE INTO songlist (id,original_name,singer,language,keyword) VALUES '
    songInfo.forEach(item => {
      statement += `(${item.id},'${item.original_name || null}','${item.singer || null}','${item.language || null}','${item.keyword || null}'),`
    })
    statement = statement.substring(0, statement.length - 1)

    return await connection.query(statement)

  }

  async deleteSong(ids) {
    let statement = `DELETE FROM songlist WHERE id in (${ids})`

    return await connection.query(statement)

  }


  async resetTableId(tableName) {
    // 为什么执行完  表里的顺序会乱？

    /* const statement = `
    UPDATE ${tableName} SET old_id=id;
    ALTER TABLE ${tableName} DROP id;
    ALTER TABLE ${tableName} ADD id INT(4) ZEROFILL auto_increment NOT NULL , ADD PRIMARY KEY(id);
    `
    await connection.query(`UPDATE ${tableName} SET old_id=id;`)
    await connection.query(`ALTER TABLE ${tableName} DROP id;`)
    return await connection.query(`ALTER TABLE ${tableName} ADD id INT(4) ZEROFILL auto_increment NOT NULL , ADD PRIMARY KEY(id);`) */

    // return await connection.query(statement)
  }
}

export default new ListService()