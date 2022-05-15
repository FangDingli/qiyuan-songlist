import mysql from 'mysql2'
import config from '../../config.js'

const connection = mysql.createPool({
  host: config.MYSQL_HOST,
  port: config.MYSQL_PORT,
  user: config.MYSQL_USER,
  password: config.MYSQL_PASSWORD,
  database: config.MYSQL_DATABSE,
  multipleStatements: true
})

connection.getConnection((err, conn) => {
  conn.connect(err => {
    if (err) {
      console.log("mysql connect failed,", err)
    } else {
      console.log("mysql connection is created")
    }
  })
})

export default connection.promise()