$(function(){
    var form = layui.form
    var layer = layui.layer
    var laypage = layui.laypage;
    // 定义一个查询的参数对象，将来请求数据的时候
    // 需要将请求的参数对象提交到服务器
    var q ={
        pagenum:1,  //页码值，默认请求第一页的数据
        pagesize:2, //每页显示几条数据，默认显示两条
        cate_id:'', //文章分类的id
        state:'',   //文章的发布状态
    }


    // 调用渲染表格的函数
    renderTable()
    // 调用渲染文章类别的函数
    renderCate()

    // 渲染表格的函数
    function renderTable(){
        $.ajax({
            method:'/my/article/list',
            url:'get',
            data:q,
            success:function(res){
                if(res.status !== 0){
                    return layer.msg('获取数据失败')
                }
                let tableStr = template('tpl-table',res)
                $('tbody').html(tableStr)
                renderPage(res.total)
            }
        })
    }

    // 定义美化时间的过滤器（这个是模板引擎中的用法：template.defaults.imports固定开头）
    template.defaults.imports.dataFormat = function(date){
        let y = padZero(date.getFullYear())
        let m = padZero(date.getMonth() + 1)
        let d = padZero(date.getDate()) 

        let hh = date.getHours()
        let mm = date.getMinutes()
        let ss = date.getSeconds()

        return y + '-' + m + '-' + d + ' ' + hh + ':' + mm + ':' + ss
    }

    // 定义一个时间补零的函数
    function padZero(n){
        return n > 9 ? n : '0' + n
    }

    // 定义渲染所有分类的函数
    function renderCate(){
        // 发起获取文章分类列表的请求
        $.ajax({
            method:'get',
            url:'/my/article/cates',
            success:function(res){
                if(res.status !== 0){
                    return layer.msg('获取失败')
                }
                layer.msg('获取成功')
                var cateStr = template('tpl-cate',res)
                $('[name=cate_id]').html(cateStr)
                // 此时需要通过layui从新渲染表格的UI结构
                form.render()
            }
        })
    }

    // 定义筛选区域表单的筛选提交事件
    $('#selectTable').on('submit',function(e){
        // 阻止默认提交
        e.preventDefault()
        // 获取分类表和状态表的值
        var cate_id = $('[name=cate_id]').val()
        var state = $('[name=state]').val()
        // 给参数对象q赋值
        q.cate_id = cate_id
        q.state = state
        // 重新渲染
        renderTable()
    })

    // 定义渲染分页的函数，并且在上面表格渲染完成后调用
    // 传入数据总数
    function renderPage(total){
        laypage.render({
            elem:'pageBox', //分页的容器，这里的 test1 是 ID，不用加 # 号
            count: total, //数据总数，从服务端得到
            limit:q.pagesize, //每页显示几条数据
            curr:q.pagenum, //起始页
            // 当分页发生切换时，触发jump回调
            // 触发jump回调的方式有两种
            // 1：点击页码的时候触发回调
            // 2：只要用了renderPage()方法就会触发
            jump:function(obj,first){
                // 把最新的页码值，赋值到q这个查询参数对象中
                // 当分页被切换时触发，函数返回两个参数：obj（当前分页的所有选项值）、first（是否首次，一般用于初始加载的判断）
                q.pagenum = obj.curr
                // 在jump回调中把最新的条目数赋值给q.pagesize属性中
                q.pagesize = obj.limit
                // first参数:如果jump回调是通过renderPage()方法触发的，first的值为true，而通过点击页码的时候触发的，first的值为undefined
                if(!first){
                    renderTable()
                }
            },

            layout:['count','prev','page','next','skip'],
            limits:[2,3,5,10]
            // 当点击了页码值按钮时也能触发jump回调
            // 在jump回调中把最新的条目数赋值给q.pagesize属性中
        }); 
    }

    // 定义删除文章的函数
    function deleteAtic(){
        // 通过代理的形式，为删除按钮添加点击事件
        $('tbody').on('click','#delete-btn',function(){
            let id = $(this).attr('data-id')
            // 获取删除按钮的个数来判断页面还有几条数据
            // 当页面的的删除按钮个数等于1时，说明页面只有一条数据了，删除完后也页面就没有数据了
            let len = $('#delete-btn').length
            // 弹窗
            layer.confirm('确定删除?', {icon: 3, title:'提示'}, function(index){
                //点击确定按钮后执行的操作代码
                // 发起请求
                $.ajax({
                    method:'get',
                    url:'/my/article/delete/:id' + id,
                    success:function(res){
                        if(res.status !== 0){
                            return layer.msg('删除数据失败')
                        }

                        layer.msg('删除数据成功')
                        // 从新渲染表格
                        if(len === 1){
                            // 如果len的值等于1，证明删除完毕之后，页面上就没有任何数据了
                            // 页码值最小必须是1
                            q.pagenum = 1 ? 1 : q.pagenum-1
                        }
                        renderTable()
                    }
                })
                layer.close(index);
            });
            
        })
    }
})