$(function () {
    let layer = layui.layer;
    let form = layui.form;
    initCates();

    function initCates() {
        $.ajax({
            url: '/my/article/cates',
            method: 'GET',
            data: {},
            dataType: 'json',
            success: (res) => {
                console.log(res);
                if (res.status != 0) {
                    return layer.msg(res.message, {
                        icon: 5
                    });
                }
                // layer.msg(res.message, {
                //     icon: 6
                // });

                let htmlCate = template("cateList", {
                    data: res.data
                });
                $("tbody").html(htmlCate);
            }
        })
    }

    let addIndex = null;
    $("#addBtn").on("click", function () {
        // console.log('ok');
        addIndex = layer.open({
            type: 1,
            area: ['500px', '300px'],
            title: '添加文章分类',
            content: $("#addJump").html()
        });
    })

    $("body").on("submit", "#addForm", function (e) {
        e.preventDefault();
        // console.log('ok');
        let formInfo = $(this).serialize();

        $.ajax({
            url: '/my/article/addcates',
            method: 'POST',
            data: formInfo,
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
                layer.close(addIndex);
                $(this)[0].reset();
                initCates();
            }
        })
    })

    $("tbody").on("click", ".btn-del", function () {
        // console.log('ok');
        let Id = $(this).attr("data-id");
        layer.confirm('删除此数据后不可恢复！', {
            icon: 3,
            title: '提示'
        }, function (index) {
            //do something
            $.ajax({
                url: '/my/article/deletecate/' + Id,
                method: 'GET',
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
                    initCates();
                }
            })

            layer.close(index);
        });
    })

    let editIndex = null;
    $("tbody").on("click", ".btn-edit", function () {
        // console.log('ok');
        editIndex = layer.open({
            type: 1,
            area: ['500px', '300px'],
            title: '修改文章分类',
            content: $("#editJump").html()
        });
        let Id = $(this).attr("data-id");
        $.ajax({
            url: '/my/article/cates/' + Id,
            method: 'GET',
            dataType: 'json',
            success: (res) => {
                console.log(res);
                if (res.status != 0) {
                    return layer.msg(res.message, {
                        icon: 5
                    });
                }
                form.val("editForm", res.data);
            }
        })
    })

    $("body").on("submit", "#editForm", function (e) {
        e.preventDefault();
        // console.log('ok');
        let formInfo = $(this).serialize();
        console.log(formInfo);
        $.ajax({
            url: '/my/article/updatecate',
            method: 'POST',
            data: formInfo,
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
                layer.close(editIndex);
                initCates();
            }
        })
    })
})