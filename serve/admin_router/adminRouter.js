const express = require("express");
const router = express.Router();
const conn = require("../util/sql.js");
const jwt = require("jsonwebtoken");

// 调用应用中间件
router.use(express.urlencoded());

// 登录模块
router.get("/login", (req, res) => {
    let {
        username,
        password
    } = req.query;
    // console.log(username, password);

    let sql = `select * from users where username="${username}" and password="${password}"`;

    conn.query(sql, (err, result) => {
        if (err) {
            res.status(500).json({
                code: 500,
                msg: "数据库操作失败"
            });
            return;
        }

        if (result.length > 0) {

            const token = 'Bearer ' + jwt.sign({
                    name: username
                },
                'gz61', // 加密的密码，要与express-jwt中的验证密码一致
                {
                    expiresIn: 2 * 60 * 60
                } // 过期时间，单位是秒
            )

            res.json({
                code: 200,
                msg: "登录成功",
                token
            });
        } else {
            res.json({
                code: 400,
                msg: "用户名或密码错误"
            });
        }
    })
})

// 注册模块
router.post("/register", (req, res) => {
    let {
        username,
        password
    } = req.body;
    console.log(username, password);

    let sql = `select * from users where username="${username}"`;

    conn.query(sql, (err, result) => {
        if (err) {
            res.status(500).json({
                code: 500,
                msg: "数据库操作失败"
            });
            return;
        }

        if (result.length > 0) {
            res.json({
                code: 201,
                msg: "用户名已被占用"
            });
            return;
        }

        let sql = `insert into users(username, password) values ("${username}","${password}")`;
        console.log(sql);
        conn.query(sql, (err, result) => {
            if (err) {
                res.status(502).json({
                    code: 502,
                    msg: "数据库操作失败"
                });
                return;
            }
            console.log(result);
            if (result.affectedRows > 0) {
                res.json({
                    code: 200,
                    msg: "注册成功"
                });
            } else {
                res.json({
                    code: 200,
                    msg: "注册失败"
                });
            }
        })


    })
})

module.exports = router;