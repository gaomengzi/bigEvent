$(function(){
    var layer = layui.layer
    var form = layui.form
    // 使用模板引擎来快速获取和渲染数据
    randerform()
    function randerform(){
        $.ajax({
            url:'/my/article/cates',
            method:'GET',
            success:function(res){
                if(res.status !== 0){
                    return layer.msg('获取数据失败')
                }
                var tableStr = template('tpl-table',res.data)
                $(tbody).html(tableStr)
            }
    
        })
    }
    

    // 使用layer.open实现弹出层效果
    var closekuang = null
    $('#btnAddcate').on('click',function(){
        closekuang = layer.open({
            type:1,
            title: '添加文章分类',
            area: ['500px', '250px'],
            content: $('#addleibiebtn').html()
          });
        
    })

    // 通过代理的形式为弹窗内的提交按钮添加点击事件
    $('body').on('submit','#formAdd',function(e){
        e.preventDefault()
        $.ajax({
            url:'/my/article/addcates',
            method:'POST',
            data:$('#formAdd').serialize(),
            success:function(res){
                if(res.status !== 0){
                    layer.close(closekuang)
                    return layer.msg('新增数据失败')
                }
                // 从新渲染表格
                randerform()
                layer.msg('新增数据成功')
                // 关闭弹出框
                layer.close(closekuang)

            }
        })
    })

    // 点击编辑按钮，实现表格编辑，因为编辑按钮也是通过模板引擎添加的，所以需要通过代理的形式为编辑按钮添加点击事件
    var dit = null
    $('tbody').on('click','#form-dit',function(){
        dit = layer.open({
            type:1,
            title: '添加文章分类',
            area: ['500px', '250px'],
            content: $('#ditform').html()
        });
        let id = $(this).attr('data-id')
        $.ajax({
            method:'GET',
            url:'/my/article/cates/' + id,
            success:function(res){
                if(res.status !== 0){
                    return layer.msg('获取数据失败')
                }
                // 快苏给表单填数据，用到layui的form模块
        
                form.val('form-edit',res.data)
            }
        })
    })

    // 通过代理的形式为弹窗内的提交按钮添加点击事件
    $('tbody').on('submit','#ditformbtn',function(e){
        e.preventDefault()
        $.ajax({
            url:'/my/article/updatecate',
            method:'POST',
            data:$('#formdit').serialize(),
            success:function(res){
                if(res.status !== 0){
                    layer.close(dit)
                    return layer.msg('修改数据失败')
                }
                // 从新渲染表格
                randerform()
                layer.msg('修改数据成功')
                // 关闭弹出框
                layer.close(closekuang)

            }
        })
    })

    // 通过代理的形式为删除按钮绑定点击事件
    $('tbody').on('click','#form-delete',function(){
        layer.confirm('确定删除吗?', {icon: 3, title:'提示'}, function(index){
            //这是里点击确定后的回调函数
            var id = $('#form-delete').attr('data-id')
            $.ajax({
                url:'/my/article/deletecate/' + id,
                method:'get',
                success:function(res){
                    if(res.status !== 0){
                        return layer.msg('删除数据失败')
                        }
                    layer.msg('删除数据成功')
                    // 从新渲染数据
                    randerform()
                }
            })
            
            layer.close(index);
          });
        
    })



})