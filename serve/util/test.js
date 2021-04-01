const conn = require("./sql");

let sql = "select * from userinfo";

conn.query(sql, (err, result) => {
    console.log(result);
})