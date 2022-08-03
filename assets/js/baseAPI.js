// 每次发起get()、post()、ajax()请求时
// 会先调用$.ajaxPrefilter这个函数
// 在这个函数中我们可以拿到我们给ajax提供的配置对象
// 其中options就是那个配置对象
$.ajaxPrefilter(function(options){
    options.url = 'http://big-event-api-t.itheima.net' + options.url
    // 统一为有权限的接口设置请求头
    options.headers = {
        Authorization:localStorage.getItem('token') || '',
    }

    // 优化控制用户的访问权限的代码
    options.complete = function(res){
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
