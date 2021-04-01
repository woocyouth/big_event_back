$(function () {
    let layer = layui.layer;
    let form = layui.form;
    initCates();
    // 获取文章分类
    function initCates() {
        $.ajax({
            url: '/article/cates/',
            method: 'GET',
            data: {},
            dataType: 'json',
            success: (res) => {
                // console.log(res);
                if (res.code != 200) {
                    return layer.msg(res.msg, {
                        icon: 5
                    });
                }
                // layer.msg(res.msg, {
                //     icon: 6
                // });

                let htmlCate = template("cateList", {
                    data: res.data
                });
                $("tbody").html(htmlCate);
            }
        })
    }


    // 添加文章分类
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
            url: '/article/addcates',
            method: 'POST',
            data: formInfo,
            dataType: 'json',
            success: (res) => {
                // console.log(res);
                if (res.code != 200) {
                    return layer.msg(res.msg, {
                        icon: 5
                    });
                }
                layer.msg(res.msg, {
                    icon: 6
                });
                layer.close(addIndex);
                $(this)[0].reset();
                initCates();
            }
        })
    })


    // 删除文章分类
    $("tbody").on("click", ".btn-del", function () {
        // console.log('ok');
        let id = $(this).attr("data-id");
        layer.confirm('删除此数据后不可恢复！', {
            icon: 3,
            title: '提示'
        }, function (index) {
            //do something
            $.ajax({
                url: '/article/deletecate/' + id,
                method: 'GET',
                dataType: 'json',
                success: (res) => {
                    // console.log(res);
                    if (res.code != 200) {
                        return layer.msg(res.msg, {
                            icon: 5
                        });
                    }
                    layer.msg(res.msg, {
                        icon: 6
                    });
                    initCates();
                }
            })

            layer.close(index);
        });
    })


    // 编辑文章分类
    let editIndex = null;
    $("tbody").on("click", ".btn-edit", function () {
        // console.log('ok');
        editIndex = layer.open({
            type: 1,
            area: ['500px', '300px'],
            title: '修改文章分类',
            content: $("#editJump").html()
        });
        let id = $(this).attr("data-id");
        // console.log(this);
        $("[name=id]").val(id);
        $.ajax({
            url: '/article/cates/' + id,
            // url: '/article/cates/',
            method: 'GET',
            dataType: 'json',
            success: (res) => {
                // console.log(res);
                if (res.code != 200) {
                    return layer.msg(res.msg, {
                        icon: 5
                    });
                }
                form.val("editForm", res.data[0]);
            }
        })
    })

    $("body").on("submit", "#editForm", function (e) {
        e.preventDefault();
        // console.log('ok');
        let formInfo = $(this).serialize();
        // console.log(formInfo);
        $.ajax({
            url: '/article/updatecate',
            method: 'POST',
            data: formInfo,
            dataType: 'json',
            success: (res) => {
                // console.log(res);
                if (res.code != 200) {
                    return layer.msg(res.msg, {
                        icon: 5
                    });
                }
                layer.msg(res.msg, {
                    icon: 6
                });
                layer.close(editIndex);
                initCates();
            }
        })
    })
})