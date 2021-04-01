const express = require("express");
const router = express.Router();
const conn = require("../util/sql.js");
const multer = require("multer");


// 存储上传文件
let storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads')
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname)
    }
})

let upload = multer({
    storage: storage
})

// 调用应用中间件
router.use(express.urlencoded());

// 查询用户数据
router.get("/userinfo", (req, res) => {
    // res.send(req.user);
    let {
        name
    } = req.user;

    let sql = `select * from users where username="${name}"`;
    conn.query(sql, (err, result) => {
        if (err) {
            res.status(500).json({
                code: 500,
                msg: "数据库操作失败"
            })
        }
        // console.log(result);
        // if (result[0].userPic == null) {
        //     result[0].userPic = "";
        // }
        if (result.length > 0) {
            res.status(200).json({
                code: 200,
                msg: "获取用户信息成功",
                data: {
                    id: result[0].id,
                    username: name,
                    nickname: result[0].nickname,
                    email: result[0].email,
                    user_pic: result[0].userPic
                }
            });
        }
    })


})

// 更新用户数据
router.post("/userinfo", (req, res) => {
    let {
        id,
        nickname,
        email
    } = req.body;

    if (!id) {
        res.status(500).json({
            code: 500,
            msg: "id是必传参数"
        });
        return;
    }

    let infoArr = [];

    if (nickname) infoArr.push(`nickname="${nickname}"`);
    if (email) infoArr.push(`email="${email}"`);

    infoArr = infoArr.join(",");

    let sql = `update users set ${infoArr} where id=${id}`;

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
                msg: "更新用户成功"
            });
        } else {
            res.status(201).json({
                code: 201,
                msg: "更新用户失败"
            })
        }

    })
})

// 更新用户密码
router.post("/updatepwd", (req, res) => {
    let {
        oldPwd,
        newPwd
    } = req.body;

    let {
        name
    } = req.user;
    // console.log(oldPwd, newPwd, id);

    let sql = `select * from users where username="${name}" and password="${oldPwd}"`;
    console.log(sql);
    conn.query(sql, (err, result) => {
        if (err) {
            res.status(500).json({
                code: 500,
                msg: "数据库操作失败"
            });
            return;
        }

        if (result.length > 0) {
            let sql = `update users set password="${newPwd}" where username="${name}"`;
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
                        msg: "更新密码成功"
                    });
                } else {
                    res.status(201).json({
                        code: 201,
                        msg: "更新密码失败"
                    });
                }
            })
        } else {
            res.status(201).json({
                code: 201,
                msg: "原密码不正确"
            });
        }
    })
})

// // 上传用户头像
// router.post("/uploadPic", upload.single('file_data'), (req, res) => {
//     let {
//         file
//     } = req;

//     console.log("http://127.0.0.1:3000/uploads/" + file.filename);

//     res.status(200).json({
//         code: 200,
//         msg: "上传头像成功",
//         src: "http://127.0.0.1:3000/uploads/" + file.filename
//     })
// })

// 更新用户头像
// router.post("/updatePic", (req, res) => {
//     let {
//         userPic
//     } = req.body;

//     let {
//         name
//     } = req.user;

//     // if (!id) {
//     //     res.status(500).json({
//     //         code: 500,
//     //         msg: "id是必传参数"
//     //     });
//     //     return;
//     // }

//     let sql = `update users set userPic="${userPic}" where username="${name}"`;
//     console.log(sql);
//     conn.query(sql, (err, result) => {
//         if (err) {
//             res.status(500).json({
//                 code: 500,
//                 msg: "数据库操作失败"
//             });
//             return;
//         }
//         // console.log(result);
//         if (result.affectedRows > 0) {
//             res.status(200).json({
//                 code: 200,
//                 msg: "更新头像成功"
//             });
//         } else {
//             res.status(201).json({
//                 code: 201,
//                 msg: "更新头像失败"
//             })
//         }

//     })
// })


// 上传用户头像
router.post("/uploadPic", (req, res) => {
    let {
        userPic
    } = req.body;

    // console.log(userPic);

    let {
        name
    } = req.user;
    let sql = `update users set userPic="${userPic}" where username="${name}"`;
    // console.log(sql);
    // console.log("http://127.0.0.1:3000/uploads/" + file.filename);
    conn.query(sql, (err, result) => {
        if (err) {
            res.status(500).json({
                code: 500,
                msg: "数据库操作失败"
            });
            return;
        }
        if (result.affectedRows > 0) {
            res.status(200).json({
                code: 200,
                msg: "更新头像成功"
            });
        } else {
            res.status(201).json({
                code: 201,
                msg: "更新头像失败"
            });
        }
    })

    // res.status(200).json({
    //     code: 200,
    //     msg: "上传头像成功",
    //     src: "http://127.0.0.1:3000/uploads/" + file.filename
    // })
})

module.exports = router;