$(function(){
    $('#link-login').on('click',function(){
        $('#reg-box').hide()
        $('#login-box').show()
    })

    $('#link-reg').on('click',function(){
        $('#reg-box').show()
        $('#login-box').hide()
    })

    /* 自定义校验规则，这个步骤参考layui来操作 */
    // 从layui中获取form对象
    let form = layui.form
    var layer = layui.layer
    form.verify({
        pass:[
        /^[\S]{6,12}$/,
        '密码必须6到12位，且不能出现空格'],
        // 两次密码保持一致原则
        repass:function(value){
            let passnum = $('#reg-box [name=password]').val()
            if(value !== passnum){return '两次密码不一致'}
        }
    })

    //监听注册表单的提交事件
  $('#form_reg').on('submit', function(e) {
    // 1. 阻止默认的提交行为
    e.preventDefault()
    // 2. 发起Ajax的POST请求
    var data = {
      username: $('#form_reg [name=username]').val(),
      password: $('#form_reg [name=password]').val()
    }
    $.post('/api/reguser', data, function(res) {
      if (res.status !== 0) {
        return layer.msg(res.message)
      }
      layer.msg('注册成功，请登录！')
      // 模拟人的点击行为
      $('#link_login').click()
    })
  })

    //实现登录事件
    $('#form_login').submit(function(e){
        e.preventDefault()
        $.ajax({
            url:'/api/login',
            method:'post',
            data:$(this).serialize(),
            success:function(res){
                if(res.status !== 0){
                    return layer.msg(res.message)
                }
                layer.msg('登录成功'),
                // 将页面返回的token字符串，存储到本地的localStorage中
                localstorage.setItem('token',res.token)
                // 页面跳转到后台主页
                localtion.href = '/index.html'

            }
        })
    })  

})