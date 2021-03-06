$(window).on("load", function () {
    let layer = layui.layer;
    let form = layui.form;

    // console.log(location.search.split("=")[1]);
    let letter_id = location.search.split("=")[1];

    initLetter();

    function initLetter() {
        $.ajax({
            url: '/artlist/' + letter_id,
            method: 'GET',
            dataType: 'json',
            success: (res) => {
                // console.log(res.data[0]);
                if (res.code != 200) {
                    return layer.msg(res.msg, {
                        icon: 5
                    });
                }
                form.val("letterForm", res.data[0]);
                // console.log(res.data[0]);

                // 解决tinyMCE富文本域重载的问题
                let tinyMCETime = setTimeout(() => {
                    tinyMCE.activeEditor.setContent(res.data[0].content);
                    clearTimeout(tinyMCETime)
                }, 500);

                // console.log(res.data);
                // 解决对应文章封面显示的问题
                if (res.data[0].cover_img) {
                    let imgURL = res.data[0].cover_img;

                    $image
                        .cropper('destroy') // 销毁旧的裁剪区域
                        .attr('src', imgURL) // 重新设置图片路径
                        .cropper(options) // 重新初始化裁剪区域
                } else {
                    layer.msg("未上传图片");
                }
            }
        })
    }

    initSelect();

    function initSelect() {
        $.ajax({
            url: '/article/cates',
            method: 'GET',
            dataType: 'json',
            success: (res) => {
                // console.log(res);
                if (res.code != 200) {
                    return layer.msg(res.msg, {
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

    initEditor();

    // 1. 初始化图片裁剪器
    let $image = $('#image')

    // 2. 裁剪选项
    let options = {
        aspectRatio: 400 / 280,
        preview: '.img-preview'
    }

    // 3. 初始化裁剪区域
    $image.cropper(options);

    $("#btnChooseImage").on("click", function () {
        $("#coverFile").click();
    })

    $("#coverFile").on("change", function (e) {
        let file = e.target.files[0];
        // console.log(file);
        if (file === undefined) {
            return layer.msg("请选择图片上传", {
                icon: 5
            });
        }

        let fileS = ['.png', '.jpg', 'jpeg'];
        let fileName = file.name.slice(file.name.lastIndexOf('.'));
        let flag = false;
        $.each(fileS, (index, item) => {
            if (fileName === item) {
                flag = true;
            }
        })

        if (flag === false) {
            return layer.msg("上传图片格式仅支持 png jpg jpeg", {
                icon: 5
            });
        }

        let imgURL = URL.createObjectURL(file);
        $image.cropper("destroy").attr("src", imgURL).cropper(options);
    })

    let state = "已发布";
    $("#btnSave2").on("click", function () {
        // console.log('ok');
        state = "草稿";
    })

    function publishArticle(fd) {
        console.log(...fd);
        $.ajax({
            url: '/artlist/updateArt',
            method: 'POST',
            data: fd,
            dataType: 'json',
            contentType: false,
            processData: false,
            success: (res) => {
                console.log(res);
                if (res.code != 200) {
                    return layer.msg(res.msg, {
                        icon: 5
                    });
                }

                layer.msg(res.msg, {
                    icon: 6
                });

                window.parent.document.querySelector("#art_list").click();
                // console.log(window.parent.document.querySelector("#art_list"));
            }
        })
    }

    $("form").on("submit", function (e) {
        e.preventDefault();
        let fd = new FormData($(this)[0]);
        fd.append("state", state);
        fd.append("id", letter_id);
        // console.log(...fd);
        $image.cropper("getCroppedCanvas", {
                width: 400,
                height: 200
            })
            .toBlob(function (blob) {
                // console.log(blob);
                fd.append('cover_img', blob);
                publishArticle(fd);
            })
    })
})