$B = {
    //===================================
    //1.弹出提示
    //===================================
    //1.0基本
    //options:{aType:"",aMessage:""}
    alert: function (options) {
        var d = dialog(options);
        d.show();
    },

    //1.0.1 判断显示位置
    buildElement: function (obj) {
        if ($(".sys-content-right-top")) {
            return $(".sys-content-right-top").after(obj);
        }
        return $("body").prepend(obj);
    },

    //1.1成功
    alertSuccess: function (message) {
        var msgContent = $('<div class="alert alert-success" role="alert" style="display:none">' + message + '</div>');
        //this.atElement().prepend(msgContent);
        this.buildElement(msgContent);//.append(msgContent);
        msgContent.slideDown();
        setTimeout(function () {
            msgContent.fadeOut(function () {
                this.remove();
            });
        }, 2000);
    },

    //1.2失败
    alertError: function (message) {
        var msgContent = $('<div class="alert alert-danger" role="alert" style="display:none">' + message + '</div>');
        this.buildElement(msgContent);
        msgContent.slideDown();
        setTimeout(function () {
            msgContent.fadeOut(function () {
                this.remove();
            });
        }, 5000);
    },

    //1.3警告
    alertWarning: function (message) {
        var msgContent = $('<div class="alert alert-warning" role="alert" style="display:none">' + message + '</div>');
        this.buildElement(msgContent);
        msgContent.slideDown();
        setTimeout(function () {
            msgContent.fadeOut(function () {
                this.remove();
            });
        }, 3500);
    },

    //1.4确认
    alertConfirm: function (message, okFunc, cancelFunc, outerWidth, options) {
        var theOptions = {
            title: '提示',
            content: '<div  style="padding: 10px;text-align: center; font-size: 18px;"><span>' + message + "</span></div>",
            okValue: '确定',
            ok: okFunc || function (here) { return true; },
            cancelValue: '取消',
            cancel: cancelFunc || function (here) { return true; }
        };
        if (options) {
            $.extend(theOptions, options);
        }
        var d = dialog(theOptions);
        var width = outerWidth || "320px";
        $(".ui-dialog table.ui-dialog-grid").css("width", width);
        d.show();
    },

    popTips:function (bt, msg) {
        bt.attr("data-content", msg);
        bt.popover("show");
        setTimeout(function () {
            bt.popover("hide");
            bt.popover("destroy");
        }, 2000);
    },

    //===================================
    //4.ajax
    //===================================
    //4.0 base ajax
    //---------------------------------
    baseAjax: function (options) {
        var opt = $.extend(options, {
            beforeSend: function (XMLHttpRequest) {
            },
            complete: function (XMLHttpRequest, textStatus) {
            }
        });
        $.ajax(opt);
    },

    //4.1 ajax get
    AjaxGet: function (url, data, successFunc, errorFunc) {
        //data = $.extend(data, { r: new Date().getTime() }); //添加随机数参数
        var options = {
            url: url,
            data: data,
            dataType: 'json',
            success: successFunc || defaultSuccessFunc,
            error: errorFunc || defaultErrorFunc
        };

        function defaultSuccessFunc(data) {
            $B.alert(data);
        }
        function defaultErrorFunc(XMLHttpRequest, errorMessage, exception) {
            $B.alertError(errorMessage);
        }
        $B.baseAjax(options);
    },
    AjaxSyncGet: function (url, data, successFunc, errorFunc) {
        data = $.extend(data, { r: new Date().getTime() }); //添加随机数参数
        var options = {
            url: url,
            data: data,
            dataType: 'json',
            async: false,
            success: successFunc || defaultSuccessFunc,
            error: errorFunc || defaultErrorFunc
        };

        function defaultSuccessFunc(data) {
            $B.alert(data);
        }
        function defaultErrorFunc(XMLHttpRequest, errorMessage, exception) {
            $B.alertError(errorMessage);
        }
        $B.baseAjax(options);
    },

    //4.1 
    //----------------------
    //ajax提交form并进行验证
    //jsonData:json数据
    //formName：form的名称，且必须form带有action值
    //beforeSendAction: 提交前的回调函数
    //afteraction：完成提交后的回调函数
    //passValidate:直接验证通过
    //----------------------
    AjaxPostForm: function (formName, jsonData, beforeSendAction, afterPostAction, passValidate) {
        formName = formName.replace("#", "");

        var isvalidate = $("#" + formName).validate().form() || passValidate;
        if (isvalidate) {
            var f = $("#" + formName);
            var sf = null;
            if (jsonData == null) {
                sf = f.serialize();
            }
            var action = f.attr("action");
            var data = jsonData || sf;
            $.ajax({
                type: "POST",
                url: action,
                data: jsonData || sf,
                dataType: 'json',
                beforeSend: defaultBeforeSend,
                success: defaultAfterPostAction,
                cache: false,
                error: function (XMLHttpRequest, textStatus, errorThrown) {
                    //弹出错误提示
                    var message = XMLHttpRequest.responseText.Message;
                    if (typeof XMLHttpRequest.responseText.Message == "undefined") {
                        message = "操作发生异常！";
                    }
                    $B.alertError(message);
                }
            });
        }

        //默认提交前的屏蔽提交按钮
        function defaultBeforeSend() {
            if (beforeSendAction) {
                //执行自定义方法
                beforeSendAction();
            } else {
                //禁用提交按钮
                $(".submit").attr("disabled", "disabled");
            }
        }

        //默认提交前的屏蔽提交按钮
        function defaultAfterPostAction(data) {
            if (afterPostAction) {
                //执行自定义方法
                afterPostAction(data);
            }
            else {
                //解禁提交按钮
                $(".submit").removeAttr("disabled");

                //提示信息
                if (data.IsSuccess == 1) {
                    $B.alertSuccess(data.Message);
                } else {
                    $B.alertError(data.Message);
                }
            }
        }


    },
    //4.2 ajax post
    AjaxPost: function (url, data, successFunc, errorFunc, customOption) {
        data = $.extend(data, { r: new Date().getTime() }); //添加随机数参数
        var options = {
            url: url,
            type: "POST",
            data: data,
            success: successFunc || defaultSuccessFunc,
            error: errorFunc || defaultErrorFunc
        };

        options = $.extend(options, customOption);

        function defaultSuccessFunc(data) {
            $B.alert(data);
        }
        function defaultErrorFunc(XMLHttpRequest, errorMessage, exception) {
            $B.alertError(errorMessage);
        }
        $B.baseAjax(options);
    },

    //4.3 template
    AjaxTemplate: function (url, callback, templateId) {
        var tpl = templateId && window.getJuicerTemplate(templateId);
        if (tpl) {
            callback(tpl);
        } else {
            $.get(url, function (d) {
                var tplTxt = "";
                if (templateId) {
                    tplTxt = $(d).filter("#" + templateId).html();
                }
                else {
                    var tplNode = $(d).filter("script[type='text/template']").eq(0);
                    tplTxt = tplNode.html();
                    templateId = tplNode.id;
                }
                var tpl = juicer(tplTxt);
                if (templateId) {
                    window.setJuicerTemplate(templateId, tpl);
                }
                callback(tpl,d);
            }, 'html');
        }
    },

    AjaxTemplates: function (url, callback) {
        $.get(url, function (html) {
            var tpls = {};
            $(html).filter("script[type='text/template']").each(function (index, item) {
                var id = item.id;
                var tpl = juicer($(item).html());
                window.setJuicerTemplate(id, tpl);
                tpls[id] = tpl;
            });
            callback(tpls,html);
        }, 'html');
    },

    ResolveJuicerConflict: function () {
        juicer.set({
            'tag::operationOpen': '{#',
            'tag::operationClose': '}',
            'tag::interpolateOpen': '${',
            'tag::interpolateClose': '}',
            'tag::noneencodeOpen': '$${',
            'tag::noneencodeClose': '}',
            'tag::commentOpen': '{##',
            'tag::commentClose': '}'
        });
    },


    joinUrl: function (rootPath, relativePath) {
        return rootPath.replace(/\/$/, "") + "/" + relativePath.replace(/^\//, "");
    },

    __joinUrl:function(rootPath,args){
        var argArry = [];
        $.each(args, function (index, item) {
            argArry.push(item);
        });
        return this.joinUrl(rootPath, argArry.join(""));
    },

    compileTemplate:function(template){
        return juicer(template);
    },

    regestJuicerFuncs:function(){
        
    }

};

(function () {

    $B.ResolveJuicerConflict();
    $B.regestJuicerFuncs();
    window.juicerTemplateContainer = {};

    window.getJuicerTemplateContainer = function () {
        return window.juicerTemplateContainer;
    };

    window.setJuicerTemplate = function (templateid, template) {
        window.juicerTemplateContainer[templateid] = template;
    };

    window.getJuicerTemplate = function (templateid) {
        return window.juicerTemplateContainer[templateid];
    };
})();

/*************寄生组合继承*********************************/
function inherit(superType, subType) {
    var prototype = Object.create(superType.prototype);//创建对象
    prototype.constructor = subType;//增强对象
    subType.prototype = prototype;//指定对象
}
/*************************************************************/