const express = require("express");
const ejwt = require("express-jwt");
const cors = require("cors");

const server = express();

server.use(cors());

server.use("/uploads", express.static("uploads"));

// app.use(ejwt().unless());
// ejwt() 用于解析token，并将 token 中保存的数据 赋值给 req.user
// unless() 约定某个接口不需要身份认证
server.use(ejwt({
    secret: 'gz61', // 生成token时的 钥匙，必须统一
    algorithms: ['HS256'] // 必填，加密算法，无需了解
}).unless({
    path: ['/admin/login', '/admin/register', /^\/uploads\/.*/] // 除了这两个接口，其他都需要认证
}));

// 引入路由中间件
const adminRouter = require("./admin_router/adminRouter.js");
server.use("/admin", adminRouter);

const personRouter = require("./person_router/personRouter.js");
server.use("/person", personRouter);

const articleRouter = require("./article_router/articleRouter.js");
server.use("/article", articleRouter);

const listRouter = require("./article_list/listRouter.js");
server.use("/artlist", listRouter);

// 错误处理中间件
server.use((err, req, res, next) => {
    console.log('有错误', err)
    if (err.name === 'UnauthorizedError') {
        // res.status(401).send('invalid token...');
        res.status(401).send({
            code: 1,
            message: '身份认证失败！'
        });
    }
});

server.listen(3000, () => {
    console.log('ok');
})