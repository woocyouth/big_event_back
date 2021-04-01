module.exports = {
    query: function (sql, callback) {
        const mysql = require("mysql");
        const conn = mysql.createConnection({
            host: "localhost",
            port: 3306,
            user: "root",
            password: "zaqxsw",
            database: "bignews"
        });

        conn.connect();
        conn.query(sql, callback);
        conn.end();
    }
}