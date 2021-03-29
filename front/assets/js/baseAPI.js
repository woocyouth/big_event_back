let baseURL = "http://api-breakingnews-web.itheima.net";

$.ajaxPrefilter(function (options) {
    // console.log(options);
    options.url = baseURL + options.url;

    if (options.url.indexOf("/my/") != -1) {
        options.headers = {
            Authorization: localStorage.getItem("token") || ""
        }

        options.complete = function (res) {
            // console.log(res);
            let rps = res.responseJSON;
            if (rps.status === 1 && rps.message === "身份认证失败！") {
                localStorage.removeItem("token");
                location.href = "/login.html";
            }
        }
    }
})