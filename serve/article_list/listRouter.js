const express = require("express");
const router = express.Router();
const conn = require("../util/sql.js");
const multer = require("multer");
const dayjs = require("dayjs");

// 调用应用中间件
router.use(express.urlencoded());

let imgSrc = null;
let storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads')
    },
    filename: function (req, file, cb) {
        imgSrc = file.fieldname + '-' + Date.now()
        cb(null, imgSrc);
    }
})

let upload = multer({
    storage: storage
})

// 获取文章列表
router.get("/list", (req, res) => {

    let {
        pagenum,
        pagesize,
        cate_id,
        state,
    } = req.query;

    let {
        name
    } = req.user;
    // console.log(name);

    let sql = `select id from users where username="${name}"`;

    conn.query(sql, (err, result) => {
        if (err) {
            res.status(500).json({
                code: 500,
                msg: "数据库操作失败"
            });
            return;
        }
        // console.log(result[0].id);
        let userId = result[0].id;

        // console.log(cate_name);
        let sql = `select * from list where author_id=${userId} and is_delete=0`;

        if (cate_id) sql += ` and cate_id="${cate_id}"`;
        if (state) sql += ` and state="${state}"`;

        if (pagenum && pagesize) {
            pagenum = parseInt(pagenum);
            if (pagenum == 0) {
                pagenum = pagenum;
            } else {
                pagenum = pagenum - 1;
            }

            sql += ` limit ${pagenum * pagesize},${pagesize}`;
            // console.log(sql);
        } else {
            res.status(202).json({
                code: 202,
                msg: "pagenum,pagesize 是必传参数"
            });
            return;
        }

        conn.query(sql, (err, result) => {
            if (err) {
                res.status(500).json({
                    code: 500,
                    msg: "数据库操作失败"
                });
                return;
            }

            // console.log(result);

            let listArr = result;

            let sql = `select count(*) as total from list where author_id=${userId}`;

            if (cate_id) sql += ` and cate_id="${cate_id}"`;
            if (state) sql += ` and state="${state}"`;

            conn.query(sql, (err, result) => {
                if (err) {
                    res.status(501).json({
                        code: 501,
                        msg: "数据库操作失败"
                    });
                    return;
                }
                // listArr.push(result[0])
                // console.log(listArr);

                res.status(200).json({
                    code: 200,
                    msg: "获取文章列表成功",
                    data: listArr,
                    total: result[0].total
                });
            })
        })

    })


})

// 删除文章
router.get("/delete/:id", (req, res) => {
    let {
        id
    } = req.params;

    console.log(id);

    if (!id) {
        res.status(201).json({
            code: 201,
            msg: "id是必传参数"
        });
        return;
    }

    let sql = `update list set is_delete=1 where id=${id}`;

    conn.query(sql, (err, result) => {
        if (err) {
            res.status(500).json({
                code: 500,
                msg: "数据库操作失败"
            });
            return;
        }
        console.log(result);
        if (result.affectedRows > 0) {
            res.status(200).json({
                code: 200,
                msg: "删除文章成功"
            });
        }
    })

})

// 获取文章内容
router.get("/:id", (req, res) => {
    let {
        id
    } = req.params;

    // console.log(id);
    let sql = `select * from list where id=${id}`;

    conn.query(sql, (err, result) => {
        if (err) {
            res.status(500).json({
                code: 500,
                msg: "数据库操作失败"
            });
            return;
        }

        // console.log(result)

        res.status(200).json({
            code: 200,
            msg: "获取文章内容成功",
            data: result
        });
    })


})

// 更新文章
router.post("/updateArt", upload.single('cover_img'), (req, res) => {
    let {
        id,
        title,
        cate_id,
        content,
        state
    } = req.body;

    let {
        file
    } = req;

    // console.log(id, title, cate_id, file, content, state);

    let alsArr = [];

    if (title) alsArr.push(`title="${title}"`);
    if (cate_id) alsArr.push(`cate_id="${cate_id}"`);
    if (content) alsArr.push(`content="${content}"`);
    if (state) alsArr.push(`state="${state}"`);

    if (file) {
        imgSrc = "http://127.0.0.1:3000/uploads/" + imgSrc;
        // console.log(imgSrc);
        alsArr.push(`cover_img="${imgSrc}"`);
    }

    let sql = `select name from categories where id=${cate_id}`;

    conn.query(sql, (err, result) => {
        if (err) {
            res.status(500).json({
                code: 500,
                msg: "数据库操作失败"
            });
            return;
        }

        // console.log(result[0].name);

        let cate_name = result[0].name;

        if (cate_name) alsArr.push(`cate_name="${cate_name}"`);

        alsArr = alsArr.join(",");

        let sql = `update list set ${alsArr} where id=${id}`;

        console.log(sql);

        conn.query(sql, (err, result) => {
            if (err) {
                res.status(500).json({
                    code: 500,
                    msg: "数据库操作失败"
                });
                return;
            }

            console.log(result);
            if (result.affectedRows > 0) {
                res.status(200).json({
                    code: 200,
                    msg: "更新文章内容成功",
                    cover_img: imgSrc
                });
            } else {
                res.status(201).json({
                    code: 201,
                    msg: "更新文章内容失败"
                });
            }
        })
    })




})

// 发布文章
router.post("/add", upload.single('cover_img'), (req, res) => {
    let {
        title,
        cate_id,
        content,
        state
    } = req.body;

    let {
        file
    } = req;

    let {
        name
    } = req.user;
    console.log(name);

    // console.log(id, title, cate_id, file, content, state);

    let alsArr = [];
    let keyArr = [];

    if (title) {
        keyArr.push("title");
        alsArr.push(`"${title}"`);
    }

    if (cate_id) {
        keyArr.push("cate_id");
        alsArr.push(`"${cate_id}"`);
    }

    if (content) {
        keyArr.push("content");
        alsArr.push(`"${content}"`);
    }

    if (state) {
        keyArr.push("state");
        alsArr.push(`"${state}"`);
    }

    let imgSrc = "";
    if (file) {
        imgSrc = "http://127.0.0.1:3000/" + file.path.replace(/\\/g, "/");
        // console.log(imgSrc);
        keyArr.push("cover_img");
        alsArr.push(`"${imgSrc}"`);
    }

    let sql = `select name from categories where id=${cate_id}`;

    conn.query(sql, (err, result) => {
        if (err) {
            res.status(500).json({
                code: 500,
                msg: "数据库操作失败"
            });
            return;
        }
        let cate_name = result[0].name;

        if (cate_name) {
            keyArr.push("cate_name");
            alsArr.push(`"${cate_name}"`);
        }

        alsArr = alsArr.join(",");
        keyArr = keyArr.join(",");
        // console.log(result[0].name);

        let sql = `select id from users where username="${name}"`;

        conn.query(sql, (err, result) => {
            if (err) {
                res.status(500).json({
                    code: 500,
                    msg: "数据库操作失败"
                });
                return;
            }

            let author_id = result[0].id;
            console.log(author_id);

            let time = dayjs()
                .startOf('second')
                .add(1, 'day')
                .set('year', 2018)
                .format('YYYY-MM-DD HH:mm:ss');

            let sql = `insert into list(${keyArr},author_id,pub_date) values(${alsArr},${author_id},"${time}")`;

            console.log(sql);

            conn.query(sql, (err, result) => {
                if (err) {
                    res.status(500).json({
                        code: 500,
                        msg: "数据库操作失败"
                    });
                    return;
                }

                console.log(result);
                if (result.affectedRows > 0) {
                    res.status(200).json({
                        code: 200,
                        msg: "添加文章成功"
                    });
                } else {
                    res.status(201).json({
                        code: 201,
                        msg: "添加文章失败"
                    });
                }
            })
        })


    })




})

module.exports = router;