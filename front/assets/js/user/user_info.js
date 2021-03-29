$(function () {
    let layer = layui.layer;
    let form = layui.form;

    initUserInfo();

    function initUserInfo() {
        $.ajax({
            url: '/my/userinfo',
            method: 'GET',
            dataType: 'json',
            success: (res) => {
                // console.log(res);
                if (res.status != 0) {
                    return layer.msg(res.message, {
                        icon: 5
                    });
                }
                // layer.msg(res.message, {
                //     icon: 6
                // });
                form.val("userInfo", res.data);
            }
        })
    }

    $("form").on("reset", function (e) {
        e.preventDefault();
        // console.log('ok');
        initUserInfo();
    })

    $("form").on("submit", function (e) {
        e.preventDefault();
        // console.log('ok');
        let userinfo = $(this).serialize();
        $.ajax({
            url: '/my/userinfo',
            method: 'POST',
            data: userinfo,
            dataType: 'json',
            success: (res) => {
                // console.log(res);
                if (res.status != 0) {
                    return layer.msg(res.message, {
                        icon: 5
                    });
                }
                layer.msg(res.message, {
                    icon: 6
                });
                window.parent.initIndex();
                // console.log(window.parent);
            }
        })
    })
})