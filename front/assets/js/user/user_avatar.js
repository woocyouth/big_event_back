$(window).on("load", function () {
    // 1.1 获取裁剪区域的 DOM 元素
    let $image = $('#image')
    // 1.2 配置选项
    const options = {
        // 纵横比
        aspectRatio: 1,
        // 指定预览区域
        preview: '.img-preview'
    }

    // 1.3 创建裁剪区域
    $image.cropper(options);

    $("#upload").on("click", function () {
        // console.log('ok');
        $("#img_file").click();
    })

    $("#img_file").on("change", function (e) {
        let file = e.target.files[0];
        // console.log(file);
        if (file === undefined) {
            return layer.msg("请选择上传图片", {
                icon: 5
            });
        }
        let fileS = ['.png', '.jpg', 'jpeg'];
        let fileName = file.name.slice(file.name.lastIndexOf("."));
        let flag = false;
        $.each(fileS, (index, item) => {
            if (item === fileName) {
                flag = true;
            }
        })
        if (flag == false) {
            return layer.msg("上传图片格式仅支持 png jpg jpeg", {
                icon: 5
            });
        }
        // 2. 将文件，转化为路径
        // let imgURL = URL.createObjectURL(file)
        let imgUrl = URL.createObjectURL(file);
        // 3. 重新初始化裁剪区域
        // $image
        //     .cropper('destroy') // 销毁旧的裁剪区域
        //     .attr('src', imgURL) // 重新设置图片路径
        //     .cropper(options) // 重新初始化裁剪区域
        $image.cropper('destroy').attr("src", imgUrl).cropper(options);
    })

    $("#tarUpload").on("click", function () {
        // let dataURL = $image
        //     .cropper('getCroppedCanvas', {
        //         // 创建一个 Canvas 画布
        //         width: 100,
        //         height: 100
        //     })
        //     .toDataURL('image/png');
        let dataURL = $image.cropper("getCroppedCanvas", {
            width: 100,
            height: 100
        }).toDataURL("image/png");

        $.ajax({
            url: '/my/update/avatar',
            method: 'POST',
            data: {
                avatar: dataURL
            },
            dataType: 'json',
            success: (res) => {
                console.log(res);
                if (res.status != 0) {
                    return layer.msg(res.message, {
                        icon: 5
                    });
                }
                layer.msg(res.message, {
                    icon: 6
                });
                window.parent.initIndex();
            }
        })
    })
})