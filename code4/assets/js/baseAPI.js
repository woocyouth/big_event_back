// let baseURL = "http://api-breakingnews-web.itheima.net";
let baseURL = "http://127.0.0.1:3000";

$.ajaxPrefilter(function (options) {
    // console.log(options);
    options.url = baseURL + options.url;

    if (options.url.indexOf("/person/") != -1 || options.url.indexOf("/article/") != -1 || options.url.indexOf("/artlist/") != -1) {
        options.headers = {
            Authorization: localStorage.getItem("token") || ""
        }

        options.complete = function (res) {
            // console.log(res);
            let rps = res.responseJSON;
            // console.log(rps);
            if (rps.code === 1 && rps.message === "身份认证失败！") {
                localStorage.removeItem("token");
                location.href = "/login.html";
            }
        }
    }
})