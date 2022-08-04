/* 表单的验证 */
var form = layui.form;
var layer = layui.layer
form.verify({
    nickname: function(value){ //value：表单的值、item：表单的DOM对象
      if(value.length>6){
        return '昵称长度必须在1-6个字符之间';
        }
    }
      
});

initUserinfo()

// 初始化用户的基本信息
function initUserinfo(){
    // 获取用户的基本信息
    $.ajax({
        url:'/my/userinfo',
        method:'GET',
        success:function(res){
            if(res.status !== 0) {
                return layer.msg('获取用户的信息失败')
            }
            console.log(res);
            // 调用form.val()为表单赋值
            form.val('formUserinfo',res.data)
        }
    })
}

// 实现表单的重置
$('#btnreset').click(function(e){
    // 首先阻止按钮的默认行为
    e.preventDefault()
    // 调用获取表单信息的函数
    initUserinfo()
})

// 表单提交修改操作
$('.layui-form').submit(function(e){
    // 阻止表单的默认提交
    e.preventDefault()
    $.ajax({
        url:'/my/userinfo',
        method:'post',
        data:$(this).serialize(),
        success:function(res){
            if(res.status !== 0){
                return layer.msg('更改数据失败')
            }
            layer.msg('更改数据成功')
            // 想要数据更新成功后   把主页的头像和用户名也更新掉
            // 需要调用主页中的渲染用户头像的renderAvater(user)函数
            window.parent.getUserinfo()
        }
    })
})
