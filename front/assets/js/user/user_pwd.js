$(function () {
    let layer = layui.layer;
    let form = layui.form;

    form.verify({
        pass: [
            /^[\S]{6,12}$/, '密码必须6到12位，且不能出现空格'
        ],
        newpass: function (value) {
            if (value === $("[name=oldPwd]").val().trim()) {
                return "新旧密码不能一致";
            }
        },
        renewpass: function (value) {
            if (value !== $("[name=newPwd]").val().trim()) {
                return "确认密码与新密码不一致";
            }
        }
    });

    $("form").on("submit", function (e) {
        e.preventDefault();
        // console.log('ok');
        let userpwd = $(this).serialize();
        $.ajax({
            url: '/my/updatepwd',
            method: 'POST',
            data: userpwd,
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
            }
        })
    })
})