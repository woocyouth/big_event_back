const express = require("express");
const router = express.Router();
const conn = require("../util/sql.js");

// 调用应用中间件
router.use(express.urlencoded());

// router.use("*", (req, res, next) => {
//     console.log(req.params);
//     next();
// })

// 获取文章分类
router.get("/cates/:id", (req, res) => {
    let {
        id
    } = req.params;
    // console.log(id);

    let sql = `select * from categories`;
    if (id) sql += ` where id=${id}`;
    // console.log(sql);
    conn.query(sql, (err, result) => {
        if (err) {
            res.status(500).json({
                code: 500,
                msg: "数据库操作失败"
            });
            return;
        }
        // console.log(result);
        res.status(200).json({
            code: 200,
            msg: "获取文章分类成功",
            data: result
        })
    })
})

router.get("/cates", (req, res) => {

    let sql = `select * from categories`;
    // console.log(sql);
    conn.query(sql, (err, result) => {
        if (err) {
            // console.log(err);
            res.status(500).json({
                code: 500,
                msg: "数据库操作失败"
            });
            return;
        }
        // console.log(result, " res");
        res.status(200).json({
            code: 200,
            msg: "获取文章分类成功",
            data: result
        })
    })
})

// 添加文章分类
router.post("/addcates", (req, res) => {
    let {
        name,
        slug
    } = req.body;

    let sql = `select * from categories where slug="${slug}" or name="${name}"`;

    conn.query(sql, (err, result) => {
        if (err) {
            res.status(500).json({
                code: 500,
                msg: "数据库操作失败"
            });
            return;
        }

        if (result.length > 0) {
            res.status(202).json({
                code: 202,
                msg: "文章分类已存在"
            });
            return;
        } else {
            let sql = `insert into categories (name,slug) values ("${name}","${slug}")`;
            // console.log(sql);
            conn.query(sql, (err, result) => {
                if (err) {
                    res.status(500).json({
                        code: 500,
                        msg: "数据库操作失败"
                    });
                    return;
                }
                // console.log(result);
                res.status(200).json({
                    code: 200,
                    msg: "插入文章分类成功",
                    data: result
                })
            })
        }
    })


})

// 编辑文章分类
router.post("/updatecate", (req, res) => {
    let {
        id,
        name,
        slug
    } = req.body;
    let infoArr = [];
    if (!id) {
        res.status(202).json({
            code: 202,
            msg: "id是必选参数"
        });
        return;
    }

    if (name) infoArr.push(`name="${name}"`);
    if (slug) infoArr.push(`slug="${slug}"`);

    infoArr = infoArr.join(",");

    let sql = `update categories set ${infoArr} where id=${id}`;

    // console.log(sql);

    conn.query(sql, (err, result) => {
        if (err) {
            res.status(500).json({
                code: 500,
                msg: "数据库操作失败"
            });
            return;
        }
        // console.log(result);
        if (result.affectedRows > 0) {
            res.status(200).json({
                code: 200,
                msg: "修改文章分类成功"
            })
        } else {
            res.status(201).json({
                code: 201,
                msg: "修改文章分类失败"
            })
        }

    })
})

// 删除文章分类
router.get("/deletecate/:id", (req, res) => {
    let {
        id
    } = req.params;
    let sql = `delete from categories where id=${id}`;
    // console.log(sql);
    conn.query(sql, (err, result) => {
        if (err) {
            res.status(500).json({
                code: 500,
                msg: "数据库操作失败"
            });
            return;
        }
        // console.log(result);
        if (result.affectedRows > 0) {
            res.status(200).json({
                code: 200,
                msg: "删除文章分类成功"
            })
        } else {
            res.status(201).json({
                code: 201,
                msg: "删除文章分类失败"
            })
        }
    })
})

module.exports = router;