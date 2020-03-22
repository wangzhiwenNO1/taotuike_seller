mui.init();
ca.init();
axios.defaults.timeout = 10000;              //超时默认值
axios.defaults.baseURL = config.base_url;    //默认baseUrl
axios.defaults.responseType = 'json';       //默认数据相应类型
// http response 拦截器
// ajax请求回调之前拦截 对请求返回的信息做统一处理 比如error为401无权限则跳转到登陆界面

//判断是否是安卓还是ios
var platform = function isAndroid_ios() {
    var u = navigator.userAgent, app = navigator.appVersion;
    var isAndroid = u.indexOf('Android') > -1 || u.indexOf('Linux') > -1; //android终端或者uc浏览器
    var isiOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/); //ios终端
    return isAndroid == true ? true : false;
};

var hasRestart = localStorage.getItem('hasRestart');
axios.interceptors.response.use(
    function (response) {
        return response.data;
    },
    function(err) {
   //      if (err && err.response) {
   //          switch (err.response.status) {
   //              case 400: err.message = '请求错误(400)' ; break;
   //              case 401:
   //                  err.message = '未授权，请重新登录(401)';
   //                  setTimeout(function(){
   //                          // plus.webview.open('../pages/login/login.html');
   //                          if(window.plus){
   //                              if(!hasRestart){
   //                                  var btnArray=['登录','取消'];
   //                                  mui.confirm('请您重新登录?','未登录',btnArray,function(e){
   //                                      if(e.index == 0){
   //                                          mui.plusReady(function() {
   //                                              // 重启应用
   //                                              localStorage.setItem('hasRestart',true);
   //                                              plus.runtime.restart();
   //                                          });
   //                                      }
   //                                  });

   //                              }
   //                          }else{
   //                              openWebview({
   //                                  url:location.origin + '/taotuike_seller/pages/login/login.html',
   //                                  id:'pages/login/login.html'
   //                              })
   //                          }
   //                      // popToTargetAndRefresh('pages/login/login.html');
   //                  },200);
   //                  break;
   //              case 403: err.message = '拒绝访问(403)'; break;
   //              case 404: err.message = '请求出错(404)'; break;
   //              case 408: err.message = '请求超时(408)'; break;
   //              case 500: err.message = '服务器错误(500)'; break;
   //              case 501: err.message = '服务未实现(501)'; break;
   //              case 502: err.message = '网络错误(502)'; break;
   //              case 503: err.message = '服务不可用(503)'; break;
   //              case 504: err.message = '网络超时(504)'; break;
   //              case 505: err.message = 'HTTP版本不受支持(505)'; break;
   //              default: err.message = "连接出错(" + err.response.status +")!";
   //          }
   //      }else{
   //          err.message = '连接服务器失败!'
			// // alert(config.base_url)
   //      }
        mui.hideLoading();
        // ca.prompt(err.message);
        return Promise.reject(err);
    }
);

var Axios = {
    // get 方法
    get: function(api,data,showLoading) {
        if(!showLoading){
            mui.showLoading("加载中...","div");
        }
        return new Promise(function(resolve, reject) {
            var url = api;
            axios.get(url, {params: data})
                .then( function(response) {
                    mui.hideLoading();
                    resolve(response);
                }, function(err) {
                    mui.hideLoading();
                    ca.prompt(err);
                    reject(err);
                });
        });
    },
    // post 方法
    post:function(api,data, showLoading){
        if(!showLoading){
            mui.showLoading("加载中...","div");
        }
        // if(api == '/api/Store/my_store_list'){
        //     mui.plusReady(function() {
        //         alert(5656)
        //         // plus.webview.open('pages/login/login.html');
        //         var ws=plus.webview.currentWebview();
        //         alert( "窗口标识: "+ws.id );
        //     });
        // }

        return new Promise(function(resolve, reject) {
            var url = api;
            axios.post(url, Qs.stringify(data))
                .then(function(response) {
                    mui.hideLoading();
                    resolve(response);
                }, function(err) {
                    mui.hideLoading();
                    ca.prompt(err);
                    reject(err);
                });
        });
    },
	// 流量请求
	flowPost:function(api,data, showLoading){
        if(!showLoading){
            mui.showLoading("加载中...","div");
        }

        return new Promise(function(resolve, reject) {
            var url = api;
            axios.post(url, Qs.stringify(data))
                .then(function(response) {
                    mui.hideLoading();
                    resolve(response);
                }, function(err) {
                    mui.hideLoading();
                    ca.prompt(err);
                    reject(err);
                });
        });
    },
    // 文件上传 （发送blob文件流对象）
    uploadFile:function(fileUrl,fileName,type, showLoading){
        if(!showLoading){
            mui.showLoading("加载中...","div");
        }
        var formData = new FormData();
        // blob文件对象时，forData.append(参数1，参数2，参数3) 参数3代表blob文件的文件名
        // blob文件对象时，forData.append(参数1，参数2，参数3) 不传参数3代表上传的是正常的文件对象
        formData.append('file',fileUrl,fileName);
        formData.append('type',type);
        formData.append('token',storage.get('token'));
        return new Promise(function(resolve, reject) {
            $.ajax({
                type: "post",
                url: config.base_url + '/api/common/upload',
                data: formData,
                processData: false,  // processData和contentType需设置为false
                contentType: false,
                success: function (res) {
                    if(res.code == 1){
                        mui.hideLoading();
						ca.prompt(res.msg);
                        resolve(res.data.full_url);
                    }else{
                        mui.hideLoading();
                        ca.prompt(res.msg);
                    }
                },
                error:function (err) {
                    mui.hideLoading();
                    ca.prompt(err);
                    reject(err);
                }
            })
        });
    }
}