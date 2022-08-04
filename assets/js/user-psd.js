// 校验规则
var form = layui.form
var layer = layui.layer
form.verify({
    pass: [
        /^[\S]{6,12}$/
        ,'密码必须6到12位，且不能出现空格'
    ],

    samepsd: function(value){ 
        if(value === $([name=oldpsd]).val()){
          return '新密码不能与原密码相同';
        }
    },

    resamepsd:function(value){
        if(value !== $('[name=newpsd].val()')){
            return '两次输入密码不一致';
        }
    }
})

// 重置表单
$('.layui-form').submit(function(e){
    e.preventDefault()
    $.ajax({
        url:'/my/updatepwd',
        method:'POST',
        data:$(this).serialize(),
        success:function(res){
            if(res.status === 1){
                return layer.msg('密码重置失败')
            }
            layer.msg('密码重置成功')
            // 重置表单
            $('.layui-form')[0].reset()
        }
    })
})