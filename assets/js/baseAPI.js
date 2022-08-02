// 每次发起get()、post()、ajax()请求时
// 会先调用$.ajaxPrefilter这个函数
// 在这个函数中我们可以拿到我们给ajax提供的配置对象
// 其中options就是那个配置对象
$.ajaxPrefilter(function(options){
    options.url = 'http://api-breakingnews-web.itheima.net' + options.url
})
