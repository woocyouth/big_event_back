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
        url: '/person/userinfo',
        dataType: 'json',
        success: (res) => {
            console.log(res.data.nickname);
            // console.log(JSON.parse(res.data.user_pic));
            if (res.code != 200) {
                return layer.msg(res.message, {
                    icon: 5
                });
            }

            let name = res.data.nickname || res.data.username;
            $(".welcome").text(name);
            if (res.data.user_pic) {
                // console.log('ok');
                $(".layui-nav-img").attr("src", res.data.user_pic);
                $(".userinfo").hide();
            } else {
                console.log('ok2');
                $(".layui-nav-img").hide();
                $(".welcome").text(name[0]);
            }
        }
    })
}