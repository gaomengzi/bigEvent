
var layer = layui.layer
// 1.1 获取裁剪区域的 DOM 元素
var $image = $('#image')
// 1.2 配置选项
const options = {
  // 纵横比
  aspectRatio: 1,
  // 指定预览区域
  preview: '.img-preview'
}

// 1.3 创建裁剪区域
$image.cropper(options)


// 实现选择文件的功能  
// 选择文件功能，需要有input文件选择框

$('#btnchuan').click(function(e){
    // 当点击上传按钮时，触发文件选择框中的点击事件
    $('#file').click()
})


// 文件选择框绑定change事件
$('#file').on('change',function(e){
    // 获取用户选择的文件
    var filelist = e.target.files
    // 判断文件是否选择成功
    if(filelist.length === 0){
        return layer.msg('文件获取失败')
    }
    // 拿到用户选择的文件
    let file = e.target.files[0]
    // 将文件转化为路径
    let imgUrl = URL.createObjectURL(file)
    // 重新初始化裁剪区域
    $image
        .cropper('destroy')      // 销毁旧的裁剪区域
        .attr('src', imgUrl)  // 重新设置图片路径
        .cropper(options)        // 重新初始化裁剪区域
})


// 将裁减后的头像上传到服务器
//为确定按钮绑定点击事件
$('#btnsure').on('click',function(){
    // 点击之后，获取上传的头像
    var dataURL = $image
      .cropper('getCroppedCanvas', { // 创建一个 Canvas 画布
        width: 100,
        height: 100
      })
      .toDataURL('image/png') // 将 Canvas 画布上的内容，转化为 base64 格式的字符串
    
    //  调用接口把头像上传到服务器
    $.ajax({
        url:'',
        method:'',
        data:{
            avatar:dataURL
        },
        success:function(res){
            if(res.status !== 0){
                return layer.msg('更换头像失败')
            }
            layer.msg('更换头像成功')
            // 重置主页的个人头像和昵称
            window.parent.getUserinfo()
        }
    }) 
})