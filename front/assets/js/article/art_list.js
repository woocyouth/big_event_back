$(function () {
    let layer = layui.layer;
    let form = layui.form;

    template.defaults.imports.dateFormat = function (date) {
        let dt = new Date(date);
        let y = Zero(dt.getFullYear());
        let m = Zero(dt.getMonth() + 1);
        let d = Zero(dt.getDay());

        let hh = Zero(dt.getHours());
        let mm = Zero(dt.getMinutes());
        let ss = Zero(dt.getSeconds());

        return `${y}-${m}-${d}  ${hh}:${mm}:${ss}`;
    }

    function Zero(time) {
        return time < 10 ? '0' + time : time;
    }

    let p = {
        pagenum: 1,
        pagesize: 2,
        cate_id: '',
        state: ''
    }

    initForm();

    function initForm() {
        $.ajax({
            url: '/my/article/list',
            method: 'GET',
            data: p,
            dataType: 'json',
            success: (res) => {
                // console.log(res);
                if (res.status != 0) {
                    return layer.msg(res.message, {
                        icon: 5
                    });
                }

                let htmlStr = template("cateList", {
                    data: res.data
                });
                $("tbody").html(htmlStr);
                renderPage(res.total)
            }
        })
    }

    initSelect();

    function initSelect() {
        $.ajax({
            url: '/my/article/cates',
            method: 'GET',
            dataType: 'json',
            success: (res) => {
                console.log(res);
                if (res.status != 0) {
                    return layer.msg(res.message, {
                        icon: 5
                    });
                }
                let htmlStr = template("selectForm", {
                    data: res.data
                });
                $("[name=cate_id]").html(htmlStr);
                form.render();
            }
        })
    }

    $("#filterForm").on("submit", function (e) {
        e.preventDefault();
        // console.log('ok');
        let cate_id = $("[name=cate_id]").val();
        let state = $("[name=state]").val();

        p.cate_id = cate_id;
        p.state = state;

        initForm();
    })

    let laypage = layui.laypage;

    function renderPage(total) {
        // 执行一个laypage实例
        laypage.render({
            elem: 'pageList', //注意，这里的 test1 是 ID，不用加 # 号
            count: total, //数据总数，从服务端得到
            curr: p.pagenum,
            limit: p.pagesize,
            jump: function (obj, first) {
                //obj包含了当前分页的所有参数，比如：
                // console.log(obj.curr); //得到当前页，以便向服务端请求对应页的数据。
                // console.log(obj.limit); //得到每页显示的条数

                //首次不执行
                if (!first) {
                    //do something
                    p.pagenum = obj.curr;
                    p.pagesize = obj.limit;

                    initForm();
                }
            }
        });
    }

    $("tbody").on("click", ".btn-del", function () {
        // console.log(this);
        let Id = $(this).attr("data-id");
        layer.confirm('删除此数据后不可恢复！', {
            icon: 3,
            title: '提示'
        }, function (index) {
            //do something
            $.ajax({
                url: '/my/article/delete/' + Id,
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
                    if ($(".btn-del").length === 1 && p.pagenum > 1) p.pagenum--;
                    initForm();
                }
            })

            layer.close(index);
        });
    })

})