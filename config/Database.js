const mysql = require('mysql2')

const Database = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DBNAME,
    waitForConnections: true,
    queueLimit: 0
})

Database.getConnection((error, connection) => {
    if(error) {
        console.log(error)
    } else {
        console.log("Database berhasil terhubung")
    }
})

module.exports = Database.promise()