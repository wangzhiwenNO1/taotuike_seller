//公共地址
var config = {
    // base_url: "http://192.168.2.134:101",
    // base_url: "http://taotuike.zzqcnz.com",  // 线上测试地址
    // base_url: "http://taotuike.hncjne.com",
    // base_url: "https://taotuike.hncjne.com",	//犇犇测试地址
	// base_url:"http://39.106.231.193",
	base_url:"112.126.69.114",
	
    // base_url: "https://taotuike.57t45.cn",		// -- 备案过审-已废弃
    // base_url: "https://taotuike.dianqiandai.com/",		//客户地址
	
	
};
mui.init({
    statusBarBackground: "#ccc"
});

//获取url地址的各个参数(单独获取)
function GetQueryString(name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
    var r = window.location.search.substr(1).match(reg);
    if (r != null) return decodeURI(r[2]);
    return null;
}

/*在手机端当用户调出手机键盘的时候,让本页面的那个大的按钮隐藏*/
var windheight = $(window).height();
$(document).ready(function () {
    $(window).resize(function () {
        var docheight = $(window).height();
        if (docheight < windheight) {
            $(".HideElement").hide();
        } else {
            $(".HideElement").show();
        }
    });
});

// 禁止返回键
function loginClose() {
    mui.back = function () {
        var first = null;
        mui.back = function () {
            if (!first) {
                first = new Date().getTime();
                mui.toast('再按一次退出应用');
                setTimeout(function () {
                    first = null;
                }, 2000);
            } else {
                if (new Date().getTime() - first < 2000) {
                    plus.runtime.quit();
                }
            }
        };
    }
}

//页面跳转
function openWebview(params) {
    mui.openWindow({
        url: params.url,
        id: params.id,
        createNew: params.createNew || false,
        extras: params.data
    })
}

// 日期比较
function compareDate(val) {
    var dateArr = val.split('-');
    var dateStr = '';
    dateArr.forEach(function (item) {
        dateStr = dateStr += item;
    });
    var nowDate = new Date();
    var nowDateStr = nowDate.getFullYear().toString() + (addZero(nowDate.getMonth() + 1)).toString() + addZero(nowDate.getDate()).toString();
    if (dateStr < nowDateStr) {
        ca.prompt('选择日期不能小于当前日期');
        return false;
    } else {
        return true;
    }
}
// 日期比较
function bigTaskDate(val) {
    var dateArr = val.split('-');
    var dateStr = '';
    dateArr.forEach(function (item) {
        dateStr = dateStr += item;
    });
    var nowDate = new Date();
    var nowDateStr = nowDate.getFullYear().toString() + (addZero(nowDate.getMonth() + 1)).toString() + addZero(nowDate.getDate()).toString();
    if (dateStr == nowDateStr) {
        return false;
    } else {
        return true;
    }
}
function addZero(day) {
    if (day < 10) day = '0' + day;
    return day;
}

// 产生随机颜色
function randomColor() {
    var r = Math.floor(Math.random() * 91 + 150);
    var g = Math.floor(Math.random() * 91 + 150);
    var b = Math.floor(Math.random() * 91 + 150);
    return "rgb(" + r + ',' + g + ',' + b + ")";//所有方法的拼接都可以用ES6新特性`其他字符串{$变量名}`替换
}

// 自定义mui.DtPicker的时间别名
function getTime(startTime, endTime) {
    var timeArr = [];
    var timerObj = {};
    for (var i = startTime; i <= endTime; i++) {
        timerObj = {};
        timerObj.value = i < 10 ? '0' + i : i;
        timerObj.text = i < 10 ? '0' + i : i;
        timeArr.push(timerObj)
    }
    return timeArr;
}

// 安卓和ios复制内容到剪切板功能
function copyContent(content,tip) {
    //判断是安卓还是ios
    if (mui.os.ios) {
        // ios 的方法 这个我没具体研究过 直接拿来用了
        var UIPasteboard = plus.ios.importClass("UIPasteboard");
        var generalPasteboard = UIPasteboard.generalPasteboard();
        //设置 复制的内容也就是 触发事件 innerText 获取的内容
        generalPasteboard.plusCallMethod({
            setValue: content,
            forPasteboardType: "public.utf8-plain-text"
        });
        generalPasteboard.plusCallMethod({
            valueForPasteboardType: "public.utf8-plain-text"
        });
        // 在上边都走完 给用户一个提示
        mui.toast(tip || '复制成功')
    } else {
        //安卓 的方法 这个我没具体研究过 直接拿来用了
        var context = plus.android.importClass("android.content.Context");
        var main = plus.android.runtimeMainActivity();
        var clip = main.getSystemService(context.CLIPBOARD_SERVICE);
        plus.android.invoke(clip, "setText", content);
        // 在上边都走完 给用户一个提示
        mui.toast(content || '复制成功')
    }
}

/**
 * 从当前页面pop到目标页面
 * @param {String} targetId 目标页面ID
 * @param {Boolean} isReload 是否让目标页面执行reload方法刷新（全局刷新）
 * @param {String} eventName 自定义事件名称，如果存在，就触发（可以实现局部刷新）
 * @param {Object} data json格式的数据（自定事件参数）
 */
function popToTargetAndRefresh(targetId, isReload, eventName, data) {

    //获取目标页面
    var target = plus.webview.getWebviewById(targetId);
    if (!target) {
        console.log("目标页面不存在！");
        return;
    }
    //获取当前页面
    var current = plus.webview.currentWebview();
    if (current === target) {
        console.log("目标页面是当前页面！");
        return;
    }

    //将要关闭的页面
    var pages = new Array(current);
    //父级页面
    var opener = current.opener();
    while (opener) {
        if (opener === target) {//找到了目标页面
            //是否需要触发目标页面的自定义事件
            if (eventName) {
                if (isReload) {//全局刷新和局部刷新（自定义事件）同时存在
                    //在全局刷新完成之后再触发目标页面的自定义事件
                    target.onloaded = function () {
                        mui.fire(target, eventName, data);
                    };
                } else {
                    mui.fire(target, eventName, data);
                }
            }
            //是否需要全局刷新目标页面
            if (isReload) {
                target.reload();
            }
            //关闭目标页面的所有子级页面pages
            pages.map(function (page) {
                page.close();
            });
            return;
        }
        pages.push(opener);

        opener = opener.opener();
    }
    //没有找到目标页面
    console.log("目标页面不是当前页面的祖先！");
}

// native.js input框自动获取焦点
function autoFocus() {
	return;
    var nativeWebview, imm, InputMethodManager;
    var initNativeObjects = function () {
        if (mui.os.android) {
            var main = plus.android.runtimeMainActivity();
            var Context = plus.android.importClass("android.content.Context");
            InputMethodManager = plus.android.importClass("android.view.inputmethod.InputMethodManager");
            imm = main.getSystemService(Context.INPUT_METHOD_SERVICE);
        } else {
            nativeWebview = plus.webview.currentWebview().nativeInstanceObject();
        }
    };
    var showSoftInput = function () {
        if (mui.os.android) {
            imm.toggleSoftInput(0, InputMethodManager.SHOW_FORCED);
        } else {
            nativeWebview.plusCallMethod({
                "setKeyboardDisplayRequiresUserAction": false
            });
        }
        setTimeout(function () {
            var inputElem = document.querySelector('input');//需要获得焦点的input
            inputElem.focus();
            inputElem.parentNode.classList.add('mui-active'); //第一个是search，加上激活样式
        }, 200);
    };
    mui.plusReady(function () {
        initNativeObjects();
        showSoftInput();
    });
}
// 获取当前窗口的宽、高
function client() {
    if (window.innerHeight !== undefined) {
        return {
            "width": window.innerWidth,
            "height": window.innerHeight
        }
    } else if (document.compatMode === "CSS1Compat") {
        return {
            "width": document.documentElement.clientWidth,
            "height": document.documentElement.clientHeight
        }
    } else {
        return {
            "width": document.body.clientWidth,
            "height": document.body.clientHeight
        }
    }
}
// 图片上传
function uploadImg(e,type,obj){
    var formData = new FormData();
    formData.append('file',e.target.files[0]);
    formData.append('type',type);
    formData.append('token',storage.get('token'));
    new Promise()
    return $.ajax({
        type: "post",
        url: config.base_url+"/api/common/upload",
        data: formData,
        dataType: "json",
        processData: false,  // processData和contentType需设置为false
        contentType: false,
        success: function (res) {

        },
        error:function (err) {
            console.log(err)
        }
    })
}
(function ($, window) {
    //显示加载框
    $.showLoading = function (message, type) {
        if ($.os.plus && type !== 'div') {
            $.plusReady(function () {
                plus.nativeUI.showWaiting(message);
            });
        } else {
            var html = '';
            html += '<i class="mui-spinner mui-spinner-white"></i>';
            html += '<p class="text">' + (message || "数据加载中") + '</p>';

            //遮罩层
            var mask = document.getElementsByClassName("mui-show-loading-mask");
            if (mask.length == 0) {
                mask = document.createElement('div');
                mask.classList.add("mui-show-loading-mask");
                document.body.appendChild(mask);
                mask.addEventListener("touchmove", function (e) {
                    e.stopPropagation();
                    e.preventDefault();
                });
            } else {
                mask[0].classList.remove("mui-show-loading-mask-hidden");
            }
            //加载框
            var toast = document.getElementsByClassName("mui-show-loading");
            if (toast.length == 0) {
                toast = document.createElement('div');
                toast.classList.add("mui-show-loading");
                toast.classList.add('loading-visible');
                document.body.appendChild(toast);
                toast.innerHTML = html;
                toast.addEventListener("touchmove", function (e) {
                    e.stopPropagation();
                    e.preventDefault();
                });
            } else {
                toast[0].innerHTML = html;
                toast[0].classList.add("loading-visible");
            }
        }
    };

    //隐藏加载框
    $.hideLoading = function (callback) {
        if ($.os.plus) {
            $.plusReady(function () {
                plus.nativeUI.closeWaiting();
            });
        }
        var mask = document.getElementsByClassName("mui-show-loading-mask");
        var toast = document.getElementsByClassName("mui-show-loading");
        if (mask.length > 0) {
            mask[0].classList.add("mui-show-loading-mask-hidden");
        }
        if (toast.length > 0) {
            toast[0].classList.remove("loading-visible");
            callback && callback();
        }
    }
})(mui, window);

	