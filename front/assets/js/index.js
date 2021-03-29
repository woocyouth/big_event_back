$(function () {
    initIndex();

    $("#logout").on("click", function () {
        localStorage.removeItem("token");
        location.href = "/login.html";
    })
})
let layer = layui.layer;
let form = layui.form;

function initIndex() {
    $.ajax({
        url: '/my/userinfo',
        dataType: 'json',
        success: (res) => {
            // console.log(res);
            if (res.status != 0) {
                return layer.msg(res.message, {
                    icon: 5
                });
            }

            let name = res.data.nickname || res.data.username;
            $(".welcome").text(name);
            if (res.data.user_pic) {
                $(".layui-nav-img").attr("src", res.data.user_pic);
                $(".userinfo").hide();
            } else {
                $(".userinfo").hide();
                $(".welcome").text(name[0]);
            }
        }
    })
}