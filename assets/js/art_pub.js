
var layer = layui.layer
var form = layui.form

// 初始化富文本编辑器
initEditor()

// 定义获取文章分类的函数并调用
renderCate()
function renderCate(){
    // 发起请求
    $.ajax({
        method:'/my/article/cates',
        url:'get',
        success:function(res){
            if(res.status !== 0){
                return layer.msg('获取分类数据失败')
            }
            layer.msg('获取分类数据成功')
            var cateStr = template('tpl-cate',res)
            $('[name=cate_id]').html(cateStr)
            // 一定要记得调用form.render()方法
            form.render()
        }
    })
}

// 1. 初始化图片裁剪器
var $image = $('#image')
  
// 2. 裁剪选项
var options = {
  aspectRatio: 400 / 280,
  preview: '.img-preview'
}

// 3. 初始化裁剪区域
$image.cropper(options)

// 点击选择封面按钮,绑定点击事件处理函数
$('#imageChoosebtn').click(function(){
    $('#imagechoose').click()
    
})

// 监听文件选择框的change事件,获取用户选择的文件列表

$('#imagechoose').on('change',function(e){
    // 获取到文件的列表数组
    var files = e.target.files
    // 判断用户是否选择了文件
    if(files === 0){
        return
    }
    // 根据文件,创建对应的URL地址
    var newimageUrl = URL.createObjectURL(files[0])
    // 为裁剪区域重新设置
    $image
   .cropper('destroy')      // 销毁旧的裁剪区域
   .attr('src', newimageUrl)  // 重新设置图片路径
   .cropper(options)        // 重新初始化裁剪区域
})


// 定义文章的发布状态,默认为已发布
var art_state = '已发布'

// 为存为草稿按钮绑定点击事件
$('#caogao').on('click',function(){
    art_state = '草稿'
})

// 为表单绑定submit提交事件
$('#form_pub').on('submit',function(e){
    e.preventDefault()
    // 基于form表单,快速创建一个FormData对象
    var fd = new FormData($(this)[0])
    // 将文章的发布状态,存到fd中
    fd.append('state',art_state)
    // 将封面裁剪过后的图片,输出为一个文件对象
    $image
    .cropper('getCroppedCanvas', { // 创建一个 Canvas 画布
        width: 400,
        height: 280
    })
    .toBlob(function(blob) { // 将 Canvas 画布上的内容，转化为文件对象
        // 得到文件对象后，进行后续的操作
        // 将文件对象输如到fd中
        fd.append('cover_image',blob)
    })
})