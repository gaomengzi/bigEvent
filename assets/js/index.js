$(function(){
    // 获取用户的基本信息
    $.ajax({
        url:'/my/userinfo',
        method:'GET',
        // 发送请求头配置对象 
        // headers:{Authorization:localStorage.getItem('token') || ''},
        success:function(res){
            if(res.status !== 0){
                return layui.layer.msg('获取用户信息失败')
            }
            console.log(res);
            // 渲染用户头像等
            renderAvater(res.data)
        },

        // 控制用户的访问权限
        // 每次发起有权限的访问时，无论成功与否，都会调用complete回调函数
        complete:function(res){
            // 在complete回调函数中，可以使用responseJSON拿到服务器响应回来的数据
            res.responseJSON.status
            if(res.responseJSON.status === 1 && res.responseJSON.message === '身份认证失败！'){
                // 点击确定后要执行内容
                // 把存储在localstorage中的token字符串删除
                localStorage.removeItem('token')
                location.href = '/login.html'

            }
        }
    })
})

//渲染用户头像
function renderAvater(user){
    // 修改用户名称
    let name = user.nicname || user.username
    $('#welcome').html('欢迎&nbsp&nbsp' + name)
    // 修改用户头像图片
    if(user.user_pic !== null){
        $('.layui-nav-img').attr('src',user.user_pic).show()
        $('#text-avater').hide()
    }else{
        let first = name[0].toUppercase()
        $('#text-avater').html(first).show()
        $('.layui-nav-img').hide()
    }
}

// 退出功能
$('.btn-logout').click(function(){
    layer.confirm('确定要退出吗?', {icon: 3, title:'提示'}, function(index){
        // 点击确定后要执行内容
        // 把存储在localstorage中的token字符串删除
        localStorage.removeItem('token')
        location.href = '/login.html'
        // 页面跳转到登录页面
        // 下面的代码不能省略
        layer.close(index);
      });
})