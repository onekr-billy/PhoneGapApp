//#region 退出登录
function LoingOut() {
    Unbind_bind("#logout", "click", function () {
        var token = $.cookie("m_token");
        var uid = $.cookie("m_uid");
        GetWcf({
            _api: "Member.logout"
        }, function (json) {
            if (json.status == 1) {
                //RemoveLoginCookie();
                window.location.href = window.WebRoot + "index.aspx";
            } else {
                alert(json.msg);
            };
        }, true);
    });
}
//#endregion

//#region 首页动画
function Index_Fun() {
    //传递搜索key值
    $("#search-form").submit(function (e) {
        //if(e.keyCode==13){
        var keyval = $("#searchinput1").val();
        if (keyval !== "") {
            window.location.href = "/product/productlist.aspx?key=" + keyval;
        }
        return false
        //}
    });
    //绑定动画图片
    var bind_Index_pic = function () {
        GetWcf({
            _api: "Cms.get_columndata_list",
            _url: "B-A1-A1/1/5"
        }, function (jsonString) {
            console.log(jsonString.list[0].pic_url);
            if (jsonString.status == 1 && typeof (jsonString.list) == "object") {

                if (jsonString.list.length > 0) {
                    var sthH = '';
                    for (var i = 0; i < jsonString.list.length; i++) {
                        //jsonString.list[i].pic_url = jsonString.list[i].pic_url.toString().replace("http://img.muyingzhijia.com/product/{0}/", "http://m.muyingzhijia.me/");
                        sthH += '<div data-src="' + jsonString.list[i].pic_url + '" data-link="/goodstopic.aspx?id=' + jsonString.list[i].id + '"></div>';
                    }

                    if ($.trim($('#foucsPic').html()).length == 0) {
                        $('#foucsPic').empty().append(sthH);
                        Camera_cao.camera();
                        Camera_cao.cameraStop();
                        Camera_cao.cameraPause();
                        Camera_cao.cameraResume();
                        jQuery('#foucsPic').camera({
                            thumbnails: false,
                            pauseOnClick: false,
                            pagination: false,
                            loader: 'bar',
                            fx: 'scrollHorz',
                            playPause: false,
                            time: 4000,
                            transPeriod: 1500
                        });
                    }
                }
            } else {
                alert(jsonString.msg);
            }
        }, true, { "ref_loading_c": $('#loading_list'), "ref_loading_text_c": '<div style="text-align:center; background:url(../images/loading.gif) no-repeat center center; height:80px;"></div>' });
    } ();
    //产品推荐列表
    var columnlist_index = function () {
        GetWcf({
            _api: "Cms.get_columndata_list",
            _url: "B-A1-A2/1/5"
        }, function (jsonString) {
            if (jsonString.status == 1 && typeof (jsonString.list) == "object") {
                if (jsonString.list.length > 0) {
                    $('#columnlistContent').setTemplate($('#columnlist_jTemplate').html());
                    $('#columnlistContent').processTemplate(jsonString, null, { append: false });
                    $("#columnlistContent").listview("refresh");
                } else {
                    $('#columnlistContent').setTemplate("<li>暂时无公告列表！</li>");
                    $('#columnlistContent').processTemplate(jsonString, null, { append: false });
                    $("#columnlistContent").listview("refresh");
                }
            } else {
                alert(jsonString.msg);
            }
        }, true, { "ref_loading_c": $('#loading_list'), "ref_loading_text_c": '<div style="text-align:center; background:url(../images/loading.gif) no-repeat center center; height:80px;"></div>' });
    } ();
    //公告列表
    var noticelist_index = function () {
        GetWcf({
            _api: "Cms.get_notice_list",
            _url: "1/5"
        }, function (jsonString) {
            if (jsonString.status == 1 && typeof (jsonString.list) == "object") {
                if (jsonString.list.length > 0) {
                    $('#noticelistContent').setTemplate($('#notice_jTemplate').html());
                    $('#noticelistContent').processTemplate(jsonString, null, { append: false });
                    $("#noticelistContent").listview("refresh");
                } else {
                    $('#noticelistContent').setTemplate("<li>暂时无公告列表！</li>");
                    $('#noticelistContent').processTemplate(jsonString, null, { append: false });
                    $("#noticelistContent").listview("refresh");
                }
            } else {
                alert(jsonString.msg);
            }
        }, true, { "ref_loading_c": $('#loading_list'), "ref_loading_text_c": '<div style="text-align:center; background:url(../images/loading.gif) no-repeat center center; height:80px;"></div>' });
    } ();
}
//#endregion

//#region 公告详情
var noticedetail = function () {
    var noticeid = (getParameter('notice_id') || "");

    GetWcf({
        _api: "Cms.get_notice_info",
        _url: noticeid
    }, function (jsonString) {
        if (jsonString.status == 1 && typeof (jsonString.info) == "object") {
            jsonString.info.created = timeDate(jsonString.info.created);
            //alert(timeDate(jsonString.info.created));
            $('#noticedetailContent').setTemplate($('#notice_detail_jTemplate').html());
            $('#noticedetailContent').processTemplate(jsonString.info, null, { append: false });
            $("#noticedetailContent").trigger("create");

        } else {
            alert(jsonString.msg);
        }
    }, true, { "ref_loading_c": $('#loading_list'), "ref_loading_text_c": '<div style="text-align:center; background:url(../images/loading.gif) no-repeat center center; height:80px;"></div>' });
}
//#endregion

//#region 登录
function Login_Fun(addUrl) {
    Unbind_bind("#login_email", "focus", function () {
        jQuery("#login_ErroMesg").css("display", "none").text("");
    });
    $("#frmLogin").validate({
        rules: {
            login_email: {
                required: true,
                email: true
            },
            login_password: {
                required: true,
                minlength: 6,
                maxlength: 20
            }
        },

        messages: {
            login_email: {
                required: "请输入Email地址",
                email: "请输入正确的email地址"
            },
            login_password: {
                required: "请输入密码",
                minlength: jQuery.validator.format("密码不能小于{0}个字符"),
                maxlength: jQuery.validator.format("密码不能最多超过{0}的字符")
            }
        },
        submitHandler: function (form) {
            var email = $("#login_email").val();
            var password = $("#login_password").val();

            var jobj = { uid: email, pwd: password };


            PostWcf({
                _api: "Member.Login",
                _data: JSON.stringify(jobj)
            }, function (json) {
                if (json.status == 1 && typeof (json.data) == "string" && json.data.length > 0) {
                    UpdateLoginCookie(json.info, email, json.data);
                    var wUr = GetUrlParam("returnurl") || window.WebRoot + "Member/myaccount.aspx";
                    //if (wUr === "undefined") wUr = window.WebRoot + "Member/myaccount.aspx";
                    LS.clear();
                    window.location.href = $("a[data-rel='back']").attr("href") || wUr;
                    //Change_Url(wUr);
                } else
                    jQuery("#login_ErroMesg").css("display", "block").text(json.msg);
            }, true);
        }
    });
}
//#endregion

//#region 注册
function Register_Fun(addUrl) {
    InitYear();
    jQuery('#select-choice-year').change(function () {
        InitMonth();
    });

    jQuery('#select-choice-month').change(function () {
        InitDate();
    });

    //alert(/checked_user/i.test(window.location.href));
    if (/checked_user/i.test(addUrl)) {
        $("#checkbox_agree").attr("checked", true).checkboxradio("refresh");
    }
    $("#register_email").focus(function () {
        jQuery("#register_ErroMesg").css("display", "none").text("");
    });
    $("#register_email").val($.cookie("c_email"));
    $("#register_password").val($.cookie("c_password"));
    $("#register_mobile").val($.cookie("c_mobile"));

    $("#select-choice-year").val($.cookie("c_babybirth_year")).selectmenu('refresh');
    $("#select-choice-month").val($.cookie("c_babybirth_month")).selectmenu('refresh');
    InitDate();
    $("#select-choice-day").val($.cookie("c_babybirth_day")).selectmenu('refresh');

    Unbind_bind("#userpolicy", "click", function () {
        var email = $("#register_email").val();
        var password = $("#register_password").val();
        var mobile = $("#register_mobile").val();
        var babybirth_year = $("#select-choice-year").val();
        var babybirth_month = $("#select-choice-month").val();
        var babybirth_day = $("#select-choice-day").val();
        $.cookie("c_email", email);
        $.cookie("c_password", password);
        $.cookie("c_mobile", mobile);
        $.cookie("c_babybirth_year", babybirth_year);
        $.cookie("c_babybirth_month", babybirth_month);
        $.cookie("c_babybirth_day", babybirth_day);
    });

    $("#frmReg").validate({
        errorElement: "span",
        rules: {
            email: {
                required: true,
                email: true
            },
            password: {
                required: true,
                minlength: 6,
                maxlength: 20
            },
            confirm_password: {
                required: true,
                minlength: 6,
                maxlength: 20,
                equalTo: "#register_password"
            },
            mobile: {
                required: true,
                number: true,
                rangelength: [11, 11]
            },
            checkbox_agree: "required"
        },

        messages: {
            email: {
                required: "请输入Email地址",
                email: "请输入正确的email地址"
            },
            password: {
                required: "请输入密码",
                minlength: jQuery.validator.format("密码不能小于{0}个字符"),
                maxlength: jQuery.validator.format("密码不能最多超过{0}的字符")
            },
            confirm_password: {
                required: "请输入确认密码",
                minlength: jQuery.validator.format("确认密码不能小于{0}个字符"),
                maxlength: jQuery.validator.format("密码不能最多超过{0}的字符"),
                equalTo: "两次输入密码不一致"
            },
            mobile: {
                required: "请输入手机号",
                number: "请输入有效的手机号码",
                rangelength: "手机号码只能是{0}位"
            },
            checkbox_agree: {
                required: "您还没有同意母婴之家”注册条款“！"
            },
            year: {
                required: "请您填写宝宝生日或预产期"

            },
            month: {
                required: "请您填写宝宝生日或预产期"

            },
            day: {
                required: "请您填写宝宝生日或预产期"

            }
        },
        groups: {
            username: "year month day"
        },
        errorPlacement: function (error, element) {
            if (element.attr("name") == "year" || element.attr("name") == "month" || element.attr("name") == "day")
                error.appendTo("div.error");

            else
                error.insertAfter(element);
        },
        submitHandler: function (form) {
            if (!$("#checkbox_agree").attr("checked")) {
                return;
            }
            var email = $("#register_email").val();
            var password = $("#register_password").val();
            var confirm_password = $("#register_confirm_password").val();
            var mobile = $("#register_mobile").val();
            var babybirthday = $("#select-choice-year").val() + "/" + $("#select-choice-month").val() + "/" + $("#select-choice-day").val();

            var jsonData = {};
            jsonData.pwd = password;
            jsonData.uid = email;
            jsonData.email = email;
            jsonData.mobile = mobile;
            jsonData.babybirthday = DateToTimePoke(babybirthday);
            jsonData.registertype = 6;

            PostWcf({
                _api: "Member.Register",
                _data: JSON.stringify(jsonData)
            }, function (json) {
                if (json.status == 1 && typeof (json.data) == "string" && json.data.length > 0) {
                    UpdateLoginCookie(json.info, email, json.data);
                    $.cookie("c_email", null);
                    $.cookie("c_password", null);
                    $.cookie("c_mobile", null);
                    $.cookie("c_babybirth_year", null);
                    $.cookie("c_babybirth_month", null);
                    $.cookie("c_babybirth_day", null);
                    window.location.href = window.WebRoot + "Member/myaccount.aspx";
                    //Change_Url(window.WebRoot + "Member/myaccount.aspx");
                } else {
                    $(".gotop").tap();
                    jQuery("#register_ErroMesg").css("display", "block").text(json.msg);
                }
            }, true);
        }
    });
}
//#endregion

//#region 找回密码
function Forgetpassword() {
    jQuery("#frmgetpassword").validate({
        errorElement: "span",
        rules: {
            userEmail: {
                required: true,
                email: true
            }
        },
        messages: {
            userEmail: {
                required: "请输入Email地址",
                email: "请输入正确的email地址 / 填写的用户名不存在"
            }
        },
        submitHandler: function (form) {
            var email = $("#userEmail").val() || "";
            if (email != "") {
                GetWcf({
                    _api: "Member.reset_member_loginpassword",
                    _url: email
                }, function (jsonString) {
                    if (jsonString.status == 1) {
                        window.location.href = window.WebRoot + "getpassword-success.aspx?email=" + email;
                        //Change_Url(window.WebRoot + "getpassword-success.aspx?email=" + email);
                    } else {
                        alert(jsonString.msg);
                    }
                }, true);
            }
        }
    });

}
//#endregion

//#region 找回密码成功后
var ForgotPassword_Result = function () {
    var email = (getParameter('email') || "").toString().toLowerCase();
    var emaildomain, emailname;
    emailname = email.split("@")[1];
    for (var mail in emails) {
        if (mail == emailname) {
            emaildomain = emails[mail];
        }
    }
    var $body = $("#getpassword_success");
    $body.setTemplate($("#template_getpassword_success").html());
    $body.processTemplate({
        email: email,
        emaildomain: emaildomain,
        emailname: emailname
    });
}
//#endregion

//#region 改变按钮样式
function Change_DateIcon_Fun(id_c, arrow_c, ui_arrow_1s, ui_arrow_2s, ui_btn_1s, ui_btn_2s) {
    var tabs = $.cookie("tabs");
    $("#sales,#price,#upTime").removeAttr("data-icon").attr("data-icon", "arrow-d");
    $("#sales,#price,#upTime").children().children().next().removeClass("ui-icon-arrow-u").addClass("ui-icon-arrow-d");

    $(id_c).removeAttr("data-icon").attr("data-icon", arrow_c);
    $(id_c).children().children().next().removeClass(ui_arrow_1s).addClass(ui_arrow_2s);

    $("#sales,#price,#upTime").removeClass("ui-btn-up-e").addClass("ui-btn-up-c");
    $("#intro_a,#detail_a").removeClass("ui-btn-up-e").addClass("ui-btn-up-c");
    //$("#intro_a,#detail_a,#comments_a").removeClass("ui-btn-up-e").addClass("ui-btn-up-c");

    if (GoodProduct.sorts == "?100" || GoodProduct.sorts == "?101" || GoodTopic.sorts == "?100" || GoodTopic.sorts == "?101") {
        $("#sales").removeClass("ui-btn-up-c").addClass("ui-btn-up-e");
    }
    else if (GoodProduct.sorts == "?200" || GoodProduct.sorts == "?201" || GoodTopic.sorts == "?200" || GoodTopic.sorts == "?201") {
        $("#price").removeClass("ui-btn-up-c").addClass("ui-btn-up-e");
    }
    else if (GoodProduct.sorts == "?300" || GoodProduct.sorts == "?301" || GoodTopic.sorts == "?300" || GoodTopic.sorts == "?301") {
        $("#upTime").removeClass("ui-btn-up-c").addClass("ui-btn-up-e");
    }
    if (tabs == "intro") {
        $("#intro_a").removeClass("ui-btn-up-c").addClass("ui-btn-up-e");
    }
    else if (tabs == "detail") {
        $("#detail_a").removeClass("ui-btn-up-c").addClass("ui-btn-up-e");
    }
}
//#endregion

//#region 改变a便签样式
function Change_DateIcon_Diao_Fun(sorts) {
    switch (sorts) {
        case "?100": Change_DateIcon_Fun("#sales", "arrow-u", "ui-icon-arrow-d", "ui-icon-arrow-u", "ui-btn-up-c", "ui-btn-up-e"); break;
        case "?101": Change_DateIcon_Fun("#sales", "arrow-d", "ui-icon-arrow-u", "ui-icon-arrow-d", "ui-btn-up-c", "ui-btn-up-e"); break;
        case "?200": Change_DateIcon_Fun("#price", "arrow-u", "ui-icon-arrow-d", "ui-icon-arrow-u", "ui-btn-up-c", "ui-btn-up-e"); break;
        case "?201": Change_DateIcon_Fun("#price", "arrow-d", "ui-icon-arrow-u", "ui-icon-arrow-d", "ui-btn-up-c", "ui-btn-up-e"); break;
        case "?300": Change_DateIcon_Fun("#upTime", "arrow-u", "ui-icon-arrow-d", "ui-icon-arrow-u", "ui-btn-up-c", "ui-btn-up-e"); break;
        case "?301": Change_DateIcon_Fun("#upTime", "arrow-d", "ui-icon-arrow-u", "ui-icon-arrow-d", "ui-btn-up-c", "ui-btn-up-e"); break;
        case "intro": Change_DateIcon_Fun("#intro", "", "", "", "ui-btn-up-c", "ui-btn-up-e"); break;
        case "detail": Change_DateIcon_Fun("#detail", "", "", "", "ui-btn-up-c", "ui-btn-up-e"); break;
        default:
    }
}
//#endregion

//#region 商品列表页
var GoodProduct = {
    key: getParameter("key"),
    currentPage: 1, //当前页
    lastPage: 1, //总页数
    pageSize: 10, //每页显示的条数
    sorts: $.cookie("sorts") || "100", //销量、价格、上架时间
    DisplayProgressIndication: function () {
        //#region 显示隐藏上一页下一页
        if ($("#productlistContent li").length < 1) {
            $(".page").hide();
        }
        //#endregion
    },
    ApplyTemplate: function (jsonString) {
        //#region 给模板赋值
        $('#productlistContent').setTemplate($('#jTemplate').html());

        var _append = false;
        if (GoodProduct.currentPage > 1)
            _append = true;
        $('#productlistContent').processTemplate(jsonString, null, { append: _append });
        $("#productlistContent").listview("refresh");
        GoodProduct.UpdatePaging();
        //#endregion
    },
    DisplayUI: function (page, urls) {
        //#region 显示界面数据列表
        var token = $.cookie("m_token");
        var uid = $.cookie("m_uid");
        var obj = $.cookie("sorts") || "100";
        //var cid = LS.get("categoryId") || 0; //分类ID
        var cid = getParameter('categoryId') || 0;
        GoodProduct.sorts = "?" + obj;
        Change_DateIcon_Diao_Fun(GoodProduct.sorts);

        GetWcf({
            _api: "Goods.goodList",
            _url: GoodProduct.key + "/0/" + cid + "/0/0/" + obj + "/" + page + "/" + GoodProduct.pageSize
        }, function (jsonString) {
            if (jsonString.status == 1 && typeof (jsonString.list) == "object") {
                if (jsonString.list.length > 0) {
                    GoodProduct.lastPage = Math.ceil(jsonString.total / GoodProduct.pageSize);
                    for (var i = 0; i < jsonString.list.length; i++) {
                        jsonString.list[i].pic_url = jsonString.list[i].pic_url.replace("{0}", "normal");
                    }
                    //console.log("ApplyTemplate");
                    $("#totalCount").text(jsonString.total);
                    GoodProduct.ApplyTemplate(jsonString);
                }
            } else {
                alert(jsonString.msg);
            }
        }, true, { "ref_loading_c": $('#loading_list'), "ref_loading_text_c": '<div style="text-align:center; background:url(../images/loading.gif) no-repeat center center; height:80px;"></div>' });
        //#endregion
    },
    CheckIsnotLoading: function () {
        return $('#loading_list').is(":hidden");
    },
    CheckIsBottom: function () {
        return $(window).height() + $(document).scrollTop() > $("div[data-role='footer']").offset().top + $("div[data-role='footer']").height();
    },
    NextPage: function (evt) {
        //#region 下一页
        evt.preventDefault();
        if (GoodProduct.CheckIsnotLoading()) {
            GoodProduct.DisplayProgressIndication();
            GoodProduct.currentPage = parseInt(GoodProduct.currentPage) + parseInt(1);
            //currentPage = parseInt(currentPage) + parseInt(1);
            //DisplayUI(currentPage, $.cookie("sorts"));
            GoodProduct.DisplayUI(GoodProduct.currentPage, $.cookie("sorts"));
        }
        //#endregion;
    },
    UpdatePaging: function () {
        //#region 更新分页数据
        if (GoodProduct.currentPage != GoodProduct.lastPage) {
            $("#morePage").show();
            //Unbind_bind("#morePage", "tap", GoodProduct.NextPage);
            $("#morePage").one("tap", GoodProduct.NextPage);
            // 拖拽加载
            $(document).one("swipeup", function () {
                if (GoodProduct.CheckIsBottom() && GoodProduct.CheckIsnotLoading()) {
                    setTimeout(function () {
                        GoodProduct.DisplayProgressIndication();
                        GoodProduct.currentPage = parseInt(GoodProduct.currentPage) + parseInt(1);
                        GoodProduct.DisplayUI(GoodProduct.currentPage, $.cookie("sorts"));
                    }, 0);
                }
            });
        } else {
            $("#morePage").hide().unbind("tap");
            $(document).unbind("swipeup")
        }
        //#endregion
    },
    GoodProductList: function () {
        //$("#productlistContent").empty();
        //#region 显示商品列表
        GoodProduct.DisplayUI(GoodProduct.currentPage, $.cookie("sorts")); //显示第一页
        //#endregion
    },
    Salec_Price_newTime_Cha_Fun: function (sorts_cookie, asc_c, aseac_c) {
        //#region 销量、价格、上架时间变换过程
        if ($.cookie("sorts") != asc_c && $.cookie("sorts") != aseac_c) {
            $.cookie("sorts", asc_c);
        } else if ($.cookie("sorts") == asc_c && $.cookie("sorts") != aseac_c) {
            $.cookie("sorts", aseac_c);
        } else if ($.cookie("sorts") == aseac_c && $.cookie("sorts") != asc_c) {
            $.cookie("sorts", asc_c);
        }
        //$.cookie("currentPage", 1);
        GoodProduct.currentPage = 1;
        GoodProduct.DisplayUI(1, $.cookie("sorts"));
        //DisplayUI(1, $.cookie("sorts"));
        //#endregion
    },
    Salec_Price_newTime_Fun: function () {
        //#region 销量、价格、上架时间调用
        //#region 100升序 101降序

        Unbind_bind("#sales", "click", function () {
            $('#productlistContent').empty();
            GoodProduct.Salec_Price_newTime_Cha_Fun($.cookie("sorts"), "100", "101");
        });
        //#endregion

        //#region 200升序 201降序
        Unbind_bind("#price", "click", function () {
            $('#productlistContent').empty();
            GoodProduct.Salec_Price_newTime_Cha_Fun($.cookie("sorts"), "200", "201");
        });
        //#endregion

        //#region 300升序 301降序
        Unbind_bind("#upTime", "click", function () {
            $('#productlistContent').empty();
            GoodProduct.Salec_Price_newTime_Cha_Fun($.cookie("sorts"), "300", "301");
        });
        //#endregion
        //#endregion
    }
};
//#endregion

//#region 显示用户中心
//#endregion

//#region 首页推荐位列表页
var GoodTopic = {
    currentPage: 1, //当前页
    lastPage: 1, //总页数
    pageSize: 10, //每页显示的条数
    sorts: $.cookie("colsorts") || "100", //销量、价格、上架时间
    DisplayProgressIndication: function () {
        //#region 显示隐藏上一页下一页
        if ($("#productlistContent li").length < 1) {
            $(".page").hide();
        }
        //#endregion
    },
    ApplyTemplate: function (jsonString) {
        //#region 给模板赋值
        $('#productlistContent').setTemplate($('#jTemplate').html());

        var _append = false;
        if (GoodTopic.currentPage > 1)
            _append = true;
        $('#productlistContent').processTemplate(jsonString, null, { append: _append });
        $("#productlistContent").listview("refresh");
        GoodTopic.UpdatePaging();
        //#endregion
    },
    DisplayUI: function (page, urls) {
        //#region 显示界面数据列表
        var token = $.cookie("m_token");
        var uid = $.cookie("m_uid");
        var obj = $.cookie("colsorts") || "100";
        var cid = getParameter('id') || 0;
        GoodTopic.sorts = "?" + obj;
        Change_DateIcon_Diao_Fun(GoodTopic.sorts);

        GetWcf({
            _api: "Cms.get_columndata_info",
            _url: "B-A1-A2/" + cid + "/" + page + "/" + GoodTopic.pageSize
        }, function (jsonString) {
            var data = JSON.parse(jsonString.data);
            if (jsonString.status == 1) {
                if (typeof (data) == "object" && data.length > 0) {
                    GoodTopic.lastPage = Math.ceil(jsonString.total / GoodTopic.pageSize);
                    for (var i = 0; i < data.length; i++) {
                        data[i].pic_url = data[i].pic_url.replace("{0}", "normal");
                    }
                    //console.log("ApplyTemplate");
                    $("#totalCount").text(jsonString.total);
                    GoodTopic.ApplyTemplate(data);
                } else {
                    $('#productlistContent').html("<li style='text-align: center'>商品列表为空</li>");
                    $("#productlistContent").listview("refresh");
                }
            } else {
                alert(jsonString.msg);
            }
        }, true, { "ref_loading_c": $('#loading_list'), "ref_loading_text_c": '<div style="text-align:center; background:url(../images/loading.gif) no-repeat center center; height:80px;"></div>' });
        //#endregion
    },
    CheckIsnotLoading: function () {
        return $('#loading_list').is(":hidden");
    },
    CheckIsBottom: function () {
        return $(window).height() + $(document).scrollTop() > $("div[data-role='footer']").offset().top + $("div[data-role='footer']").height();
    },
    NextPage: function (evt) {
        //#region 下一页
        evt.preventDefault();
        if (GoodTopic.CheckIsnotLoading()) {
            GoodTopic.DisplayProgressIndication();
            GoodTopic.currentPage = parseInt(GoodTopic.currentPage) + parseInt(1);
            //currentPage = parseInt(currentPage) + parseInt(1);
            //DisplayUI(currentPage, $.cookie("sorts"));
            GoodTopic.DisplayUI(GoodTopic.currentPage, $.cookie("colsorts"));
        }
        //#endregion;
    },
    UpdatePaging: function () {
        //#region 更新分页数据
        if (GoodTopic.currentPage != GoodTopic.lastPage) {
            $("#morePage").show();
            //Unbind_bind("#morePage", "tap", GoodProduct.NextPage);
            $("#morePage").one("tap", GoodTopic.NextPage);
            // 拖拽加载
            $(document).one("swipeup", function () {
                if (GoodTopic.CheckIsBottom() && GoodTopic.CheckIsnotLoading()) {
                    setTimeout(function () {
                        GoodTopic.DisplayProgressIndication();
                        GoodTopic.currentPage = parseInt(GoodTopic.currentPage) + parseInt(1);
                        GoodTopic.DisplayUI(GoodProduct.currentPage, $.cookie("colsorts"));
                    }, 0);
                }
            });
        } else {
            $("#morePage").hide().unbind("tap");
            $(document).unbind("swipeup")
        }
        //#endregion
    },
    GoodProductList: function () {
        //$("#productlistContent").empty();
        //#region 显示商品列表
        GoodTopic.DisplayUI(GoodTopic.currentPage, $.cookie("colsorts")); //显示第一页
        //#endregion
    },
    Salec_Price_newTime_Cha_Fun: function (sorts_cookie, asc_c, aseac_c) {
        //#region 销量、价格、上架时间变换过程
        if ($.cookie("colsorts") != asc_c && $.cookie("colsorts") != aseac_c) {
            $.cookie("colsorts", asc_c);
        } else if ($.cookie("colsorts") == asc_c && $.cookie("colsorts") != aseac_c) {
            $.cookie("colsorts", aseac_c);
        } else if ($.cookie("colsorts") == aseac_c && $.cookie("colsorts") != asc_c) {
            $.cookie("colsorts", asc_c);
        }
        //$.cookie("currentPage", 1);
        GoodTopic.currentPage = 1;
        GoodTopic.DisplayUI(1, $.cookie("colsorts"));
        //DisplayUI(1, $.cookie("sorts"));
        //#endregion
    },
    Salec_Price_newTime_Fun: function () {
        //#region 销量、价格、上架时间调用
        //#region 100升序 101降序

        Unbind_bind("#sales", "click", function () {
            $('#productlistContent').empty();
            GoodTopic.Salec_Price_newTime_Cha_Fun($.cookie("colsorts"), "100", "101");
        });
        //#endregion

        //#region 200升序 201降序
        Unbind_bind("#price", "click", function () {
            $('#productlistContent').empty();
            GoodTopic.Salec_Price_newTime_Cha_Fun($.cookie("colsorts"), "200", "201");
        });
        //#endregion

        //#region 300升序 301降序
        Unbind_bind("#upTime", "click", function () {
            $('#productlistContent').empty();
            GoodTopic.Salec_Price_newTime_Cha_Fun($.cookie("colsorts"), "300", "301");
        });
        //#endregion
        //#endregion
    }
};
function myAccount_Fun() {
    var token = $.cookie("m_token");
    var uid = $.cookie("m_uid");
    GetWcf({
        _api: "Member.GetMember.Info"
    }, function (jsonString) {
        if (jsonString.status == 1 && typeof (jsonString.info) == "object") {
            $("#myAccount_content").setTemplate($("#myAccount_Template").html());
            $("#myAccount_content").processTemplate(jsonString.info, null, { append: false });
            $("#myAccount_content").listview("refresh");
        } else {
            alert("msg:" + jsonString.msg);
        }
    }, true);
}
//#endregion

//#region 最小值
Array.prototype.min = function () {
    var min = this[0];
    var len = this.length;
    for (var i = 1; i < len; i++) {
        if (this[i] < min) {
            min = this[i];
        }
    }
    return min;
}
//#endregion

//#region 最大值
Array.prototype.max = function () {
    var max = this[0];
    var len = this.length;
    for (var i = 1; i < len; i++) {
        if (this[i] > max) {
            max = this[i];
        }
    }
    return max;
}
//#endregion

//#region 计算字个数
var Font_Num_Fun = function (element) {
    var De_array = new Array();
    for (var i = 0; i < element.attrs.length; i++) {
        De_array.push(element.attrs[i].key.length);
    }
    return De_array.max();
}
//#endregion

//#region 字体宽度
var Font_Width_Fun = function (element) {
    var _fontNum = Font_Num_Fun(element);
    $(".ui-font-width").css("width", parseInt(_fontNum) * parseInt(14) + "px");
};
//#endregion

//#region 给商品菜单加click事件
function De_controlgroup_Fun() {
    $.cookie("tabs", "intro");
    Change_DateIcon_Diao_Fun($.cookie("tabs"));

    Unbind_bind("#intro_a", "click", function () {
        $("#intro").css("display", "block");
        $("#detail").css("display", "none");
        $.cookie("tabs", "intro");
        Change_DateIcon_Diao_Fun($.cookie("tabs"));
    });

    Unbind_bind("#detail_a", "click", function () {
        $("#intro").css("display", "none");
        $("#detail").css("display", "block");
        $.cookie("tabs", "detail");
        Change_DateIcon_Diao_Fun($.cookie("tabs"));
    });
}
//#endregion

//#region 商品详细页
function productDetail_Fun() {
    $("#intro").css("display", "block");
    $("#detail").css("display", "none");

    var token = $.cookie("m_token");
    var uid = $.cookie("m_uid");
    var gid = getParameter('gid');

    //#region 商品详细信息
    GetWcf({
        _api: "Goods.GetProductDetail.Info",
        _url: gid
    }, function (jsonString) {
        if (jsonString.status == 1 && typeof (jsonString.info) == "object") {
            $("#AddShop_btn").buttonMarkup({ theme: "a" }).button('enable');
            if (jsonString.info.stock == 0) {
                $("#AddShop_btn").buttonMarkup({ theme: "d" }).button('disable');
            }
            $("#h2_title").text(jsonString.info.title);
            $("#P_desc").html(jsonString.info.desc.toString());
            $('#iteminfo').setTemplate($('#productDetailContent').html());
            $('#iteminfo').processTemplate(jsonString.info, null, { append: false });
            $('#P_attrs').setTemplate($('#P_attrs_Template').html());
            $('#P_attrs').processTemplate(jsonString.info, null, { append: false });
            Font_Width_Fun(jsonString.info);
        } else {
            alert(jsonString.msg);
        };
    }, false);
    //#endregion

    //#region  图片列表
    GetWcf({
        _api: "Goods.goodspic.Info",
        _url: "/" + gid
    }, function (jsonString) {
        if (jsonString.status == 1 && typeof (jsonString.list) == "object" && jsonString.list != null) {
            for (var i = 0; i < jsonString.list.length; i++) {
                jsonString.list[i].url = jsonString.list[i].url.toString().replace("{0}", "org");
                //alert(jsonString.list[i].url); 此处停用图片模板，改为直接向dom添加
                //$("<li><img src='"+ jsonString.list[i].url +"' width='300' height='300' /></li>").appendTo("#imggallery_iteminfo");
            }
            $('#imggallery_iteminfo').setTemplate($('#picdetailList').html());
            $('#imggallery_iteminfo').processTemplate(jsonString, null, { append: false });
            ImgSwipegall();
        } else {
            //alert(jsonString.msg);
            $('#imggallery_iteminfo').setTemplate('<li><img src="/images/errorImg_big.jpg" width="300" height="300" /></li>');
            $('#imggallery_iteminfo').processTemplate(jsonString, null, { append: false });
        }
    }, false, {
        "ref_loading": $('#imggallery_iteminfo'), "ref_loading_text": '<li style="text-align:center; background:url(../images/loading.gif) no-repeat center center; height:300px;"></li>'
    });
    //#endregion

    De_controlgroup_Fun();

    //#region 添加购物车
    Unbind_bind("#AddShop_btn", "click", function () {
        var area_id = 0;
        var product_id = gid;
        var num = 1;
        GetWcf({
            _api: "Order.add_goodstoshoppingcar",
            _url: "/" + area_id + "/" + product_id + "/" + num
        }, function (jsonString) {
            if (jsonString.status == 1) {
                window.location.href = window.WebRoot + "CheckOut/shoppingcart.aspx";
                //Change_Url(window.WebRoot + "CheckOut/shoppingcart.aspx");
            } else {
                alert(jsonString.msg);
            }
        }, true);
    });
    //#endregion

    var ImgSwipegall = function () {
        var n = 0;
        var num = $(".slides li").size();
        if (num > 1) {
            $("#imggallerynum").text((n + 1) + "/" + num);
            $("#imgNex_Pre").css("display", "block");

            var item_width = $(".slides li").outerWidth();
            var left_value = item_width * (-1);

            $(".slides li:first").before($(".slides li:last"));
            if (num == 2) {
                left_value = 0;
            }
            $(".slides ul").css({ 'left': left_value });
            Unbind_bind("#imggalleryprev", "click", prev_Fun);
            Unbind_bind("#imggallerynext", "click", next_Fun);
            Unbind_bind("#imggallery", "swipeleft", next_Fun);
            Unbind_bind("#imggallery", "swiperight", prev_Fun);
            //            $("#imggalleryprev").click(function () { prev_Fun(); });
            //            $("#imggallerynext").click(function () { next_Fun(); });
            //            $('#imggallery').swipeleft(function () {
            //                next_Fun();
            //            });
            //            $('#imggallery').swiperight(function () {
            //                prev_Fun();
            //            });
        } else {
            $("#imgNex_Pre").css("display", "none");
        }
        //上一张图片
        function prev_Fun() {
            n = n == 0 ? (num - 1) : (n - 1);
            $("#imggallerynum").text((n + 1) + "/" + num);
            if (num == 2) {
                left_value = -300;
                $(".slides ul").css({ 'left': left_value });
            }
            //alert(parseInt($(".slides ul").css('left')));
            var left_indent = parseInt($(".slides ul").css('left')) + item_width;
            $(".slides ul:not(:animated)").animate({ 'left': left_indent }, 300, function () {
                $(".slides li:first").before($(".slides li:last"));

                $('.slides ul').css({ 'left': left_value });
            });
            return false;

        }

        //下一张图片
        function next_Fun() {
            n = n >= (num - 1) ? 0 : n + 1;
            $("#imggallerynum").text((n + 1) + "/" + num);
            if (num == 2) {
                left_value = 0;
                $(".slides ul").css({ 'left': left_value });
            }
            //alert(parseInt($(".slides ul").css('left')));
            var left_indent = parseInt($(".slides ul").css('left')) - item_width;
            $(".slides ul:not(:animated)").animate({ 'left': left_indent }, 300, function () {
                $(".slides li:last").after($(".slides li:first"));
                //alert($(".slides li:last").index());
                $('.slides ul').css({ 'left': left_value });
            });
            return false;

        }

    }
}
//#endregion

//#region 信息
var intervalID_mesage = 0;
function setMesage(mesag, product_id) {
    hideMesage();
    $("#error_" + product_id).text(mesag);
    intervalID_mesage = setTimeout(function () { intervalID_mesage = 0; $("#error_" + product_id).text(""); }, 3000);
}
function hideMesage() {
    if (intervalID_mesage != 0) {
        clearTimeout(intervalID_mesage);
        intervalID_mesage = 0;
    }
}
//#endregion

//#region 购物车

function shoppingcart_Fun() {
    var goodsTotal = $(".Hid_Good_Total_price").eq(0).val() || 0;
    $("#goodsTotal").html(parseFloat(goodsTotal).toFixed(2) + "元");

    //#region 绑定购物车列表
    var BindDate_Shopcart = function () {
        var shoppingCart_list = $('#shoppingCart_list');
        GetWcf({
            _api: "Order.get_shoppingcartgoods_list"
        }, function (jsonString) {
            if (jsonString.status == 1 && typeof (jsonString.info) == "object" && jsonString.info.shoppingcart_list != null && jsonString.info.shoppingcart_list.length > 0) {
                for (var i = 0; i < jsonString.info.shoppingcart_list.length; i++) {
                    jsonString.info.shoppingcart_list[i].vchPicURL = jsonString.info.shoppingcart_list[i].vchPicURL.toString().replace("{0}", "normal");
                }
                $("#good_totals").html($(".Good_Total_Count").eq(0).text());
                var goodsTotal = $(".Hid_Good_Total_price").eq(0).val() || 0;

                $("#goodsTotal").html(parseFloat(goodsTotal).toFixed(2) + "元");
                window.shoppingcart_list = jsonString.info.shoppingcart_list;
                shoppingCart_list.setTemplate($('#shoppingCart_list_template').html());
                shoppingCart_list.processTemplate(jsonString.info.shoppingcart_list, null, { append: false });
                shoppingCart_list.trigger('create').listview("refresh");
            } else {
                $("#good_totals").html("0");
                $("#goodsTotal").html("0.00元");
                shoppingCart_list.setTemplate("<li style='text-align:center;'>暂无商品信息！</li>");
                shoppingCart_list.processTemplate(jsonString.info.shoppingcart_list, null, { append: false });
                shoppingCart_list.listview("refresh");
            }
        }, true, {
            "ref_loading": shoppingCart_list, "ref_loading_text": '<li style="text-align:center; background:url(../images/loading.gif) no-repeat center center; height:80px;"></li>'
        });
    };
    BindDate_Shopcart();
    //#endregion

    //#region 设置购物车数商品量
    var Set_shoppingcartgoodsnum = function (shoppingcarid, gid, num, onum, obj) {
        GetWcf({
            _api: "Order.set_shoppingcartgoodsnum",
            _url: "/" + shoppingcarid + "/" + gid + "/" + num
        }, function (jsonString) {
            if (jsonString.status == 1) {
                $("#error_" + product_id).text("");
                Get_shoppingcartgoodsnum_Fun();
                $("#good_totals").html($(".Good_Total_Count").eq(0).text());
                var goodsTotal = $(".Hid_Good_Total_price").eq(0).val() || 0;
                $("#goodsTotal").html(parseFloat(goodsTotal).toFixed(2) + "元");
                if (onum != num) {
                    $(obj).attr("onum", num);
                }

            } else {
                setMesage(jsonString.msg, product_id);
                $(obj).val(onum);
                obj.val(onum).slider("refresh");
            }
        }, true);
    }
    //#endregion

    //#region 改变值调用方式
    var product_id = 0; //商品ID
    var p_num = 0; //当前的数量
    var onum = 0; //原来的数量
    var ShopCartID = 0; //购物车ID
    var Change_Project_object = function (obj, product_id, p_num, ShopCartID) {
        if (onum != p_num) {
            Set_shoppingcartgoodsnum(ShopCartID, product_id, p_num, onum, obj);
        }
    }
    //#endregion

    //#region 改变数量框里的值
    var changeNum = function () {
        $("#shoppingCart_list div[role=application] a").live("touchend mouseup", function () {
            var Find_Number_object = $(this).parent().parent().find("input[type=number]");
            ShopCartID = Find_Number_object.attr("ShopCartID")
            product_id = Find_Number_object.attr("product_id");
            onum = Find_Number_object.attr("onum") || 0;
            p_num = Find_Number_object.val();
            Change_Project_object(Find_Number_object, product_id, p_num, ShopCartID);
        });

        $("#shoppingCart_list input[type=number]").live("blur", function () {
            ShopCartID = $(this).attr("ShopCartID");
            product_id = $(this).attr("product_id");
            onum = $(this).attr("onum") || 0;
            p_num = $(this).val();

            Change_Project_object($(this), product_id, p_num, ShopCartID);

        });
    } ();
    //#endregion

    //#region 删除购物车
    var del_ShoppingCart = function () {
        $("#shoppingCart_list a.Del_id").live("click", function () {
            var $obj = $(this);
            var intShopCartID = $(this).attr("delete_id");
            product_id = $(this).attr("product_id");
            GetWcf({
                _api: "Order.del_shoppingcart",
                _url: "/" + intShopCartID
            }, function (jsonString) {
                if (jsonString.status == 1) {
                    Get_shoppingcartgoodsnum_Fun();
                    $obj.parents("li").fadeOut(500, function () {
                        $(this).remove();
                        $('#shoppingCart_list').trigger('create').listview("refresh");
                    });
                    //BindDate_Shopcart();
                } else {
                    $("#error_" + product_id).text(jsonString.msg);
                }
            }, true);
        });
    } ();
    //#endregion

    //#region 提交订单
    Unbind_bind("#ShoppingCart_btn", "click", function (e) {
        if (parseInt($("#good_totals").text()) > 0) {
            $('html, body').animate({
                scrollTop: $(document).height()
            },
                1500);

            window.location.href = window.WebRoot + "CheckOut/orderconfirm.aspx";
            //Change_Url(window.WebRoot + "CheckOut/orderconfirm.aspx");
        } else {
            $("#tis_Tip").empty().append('<li class="error-text">您还没有购买商品！</li>');
        }
    });
    //#endregion
}
//#endregion

//#region 默认收货人信息存储
var De_Con_Object = "";
var Default_Consignee_information_Fun = function (De_object_Info) {
    De_Con_Object = De_object_Info;
    LS.set("county_id", De_object_Info.county_id); //区域ID
    LS.set("current_addressid", De_object_Info.id); //收货人信息ID
}
//#endregion

//#region  支付方式信息存储
var Payment_info_Object = function (payment_text_name, payment_Id) {
    LS.set("payment_text_name", payment_text_name); //付款名称 payment_text_name  如在线支付
    LS.set("payment_Id", payment_Id);
}
//#endregion

//#region  删除支付方式信息存储
var Delete_Payment_info_Object = function (payment_text_name, payment_Id) {
    LS.remove(payment_text_name); //付款名称 payment_text_name  如在线支付
    LS.remove(payment_Id);
}
//#endregion

//#region  配送方式信息存储
var Delivery_info_Object = function (delivery_array) {
    for (var i = 0; i < delivery_array.slides.length; i++) {
        //alert("aa:" + delivery_array.slides[i] + delivery_array.values[i]);
        LS.set(delivery_array.slides[i], delivery_array.values[i]);
    }
}
//#endregion

//#region  配送方式信息删除
var Delelt_Delivery_info_Object = function (delivery_array) {
    for (var i = 0; i < delivery_array.slides.length; i++) {
        LS.remove(delivery_array.slides[i]);
    }
}
//#endregion

//#region 计算总金额
var Final_Price = function () {
    var goodsTotal = $(".Hid_Good_Total_price").eq(0).val() || 0;
    $("#Total_Price").text(parseFloat(goodsTotal).toFixed(2));
    var _Final_price = parseFloat(goodsTotal) + parseFloat($("#Y_Price").text());
    $("#Final_Price").text(parseFloat(_Final_price).toFixed(2) + "元");
}
//#endregion

//#region 订单实体类
var orderEntity = {
    createNew: function () {
        var order = {};
        order.buyer_uid = $.cookie("m_uid"); //买家字符串ID
        order.addressid = LS.get("current_addressid") || "no_c"; //收货地址ID
        order.payid = LS.get("payment_Id") || "no_c"; //支付方式id
        order.logisticsid = LS.get("delivery_Id") || "no_c"; //配送方式id

        var isorInvice = LS.get("isorInvice") || "0"; //发票抬头类型
        var invoice_Type = LS.get("invoice_Type"); //发票分类
        var FaTHeader = LS.get("FaTHeader"); //发票抬头
        var remark = $("#remark").val(); //订单备注
        var posttimetype = LS.get("delivery_sh_time_id"); //配送时间类型
        //alert(typeof (posttimetype));
        //alert(typeof(isorInvice) + ":" + typeof(invoice_Type) + ":" + typeof(FaTHeader) + ":" + typeof(remark));
        //alert(isorInvice + ":" + invoice_Type + ":" + FaTHeader + ":" + remark);


        order.titletype = isorInvice;

        if (invoice_Type != null) {
            order.invoicecategory = invoice_Type;
        }
        if (FaTHeader != null) {
            order.invoicetitle = FaTHeader;
        }
        if (remark != "") {
            order.remark = remark;
        }
        if (posttimetype != "null") {
            order.posttimetype = posttimetype;
        }

        return order;
    },
    init_Judge: function (orderEntity_c) {
        if (orderEntity_c.addressid === "no_c") {
            $("#Y_Price").text("0");
            return false;
        } else if (orderEntity_c.payid === "no_c") {
            $("#Y_Price").text("0");
            return false;
        } else if (orderEntity_c.logisticsid === "no_c") {
            $("#Y_Price").text("0");
            return false;
        } else {
            return true;
        }
    }
}
//#endregion

//#region 计算运费
var calculation_shipping_costs_Fun = function () {
    var orderEntity_c = orderEntity.createNew();
    //alert(orderEntity.init_Judge(orderEntity_c));
    if (orderEntity.init_Judge(orderEntity_c)) {
        PostWcf({
            _api: "Order.get_temporder_info",
            _data: JSON.stringify(orderEntity_c)
        }, function (json) {
            $("#Y_Price").text(parseFloat(json.info.total_freight).toFixed(2));
            $("#Total_Price").text(parseFloat(json.info.total_goods_fee).toFixed(2));
            $("#Final_Price").text(parseFloat(json.info.total_order_fee).toFixed(2) + "元");
            //Final_Price();
        }, true);
    }
};
//#endregion

//#region 去结算页面
function orderconfirm_Fun() {
    //#region  收货人信息显示
    GetWcf({
        _api: "Member.get_defaultaddress_info"
    }, function (jsonString) {
        var address_default = $('#address_default');
        var address_message = $('#address_message');
        if (jsonString.status == 1 && typeof (jsonString.info) == "object" && jsonString.info.contact_name != null) {
            Default_Consignee_information_Fun(jsonString.info);
            address_default.removeAttr("href").attr("href", window.WebRoot + "CheckOut/addresslist.aspx");
            address_default.setTemplate($('#address_default_template').html());
            address_default.processTemplate(jsonString.info, null, { append: false });
            address_message.listview('refresh');
        } else {
            address_default.removeAttr("href").attr("href", window.WebRoot + "CheckOut/address_add.aspx");
            address_default.setTemplate("<p>暂无收货信息，请添加！</p>");
            address_default.processTemplate(jsonString.info, null, { append: false });
            address_message.listview('refresh');
        }

        var paymentlist_p = $("#paymentlist_p");
        var delivery_text_name_p = $("#delivery_text_name_p");
        var delivery_sh_time_text_p = $("#delivery_sh_time_text_p");
        var delivery_fk_time_text_p = $("#delivery_fk_time_text_p");
        var regionid = LS.get("county_id");
        var paygroupid = LS.get("payment_Id");

        //#region 选支付方式时判断
        $("#paymentlist_a").click(function () {
            if (regionid === null) {
                alert("请选择收货人信息！");
                return;
            } else {
                window.location.href = window.WebRoot + "CheckOut/paymentlist.aspx";
                //Change_Url(window.WebRoot + "CheckOut/paymentlist.aspx");
            }
        });
        //#endregion

        //#region  支付方式显示
        if (LS.get("payment_text_name") == null) {
            paymentlist_p.html("请选择支付方式");
        } else {
            paymentlist_p.html(LS.get("payment_text_name"));
        }
        //#endregion

        //#region 配送时判断
        $("#deliverylist_a").click(function () {
            if (paygroupid === null) {
                alert("请选择支付方式！");
                return;
            } else {
                window.location.href = window.WebRoot + "CheckOut/deliverylist.aspx";
                //Change_Url(window.WebRoot + "CheckOut/deliverylist.aspx");
            }
        });
        //#endregion

        //#region  配送方式显示
        if (LS.get("delivery_text_name") == null) {
            delivery_text_name_p.html("请选择配送方式");
        } else {
            $("#delivery_text_name_p").html(LS.get("delivery_text_name"));
            //alert(LS.get("delivery_fk_time_text") +":"+ (LS.get("delivery_fk_time_text") === "null"));
            if (LS.get("delivery_sh_time_text") === "null") {
                delivery_sh_time_text_p.html("");
            } else {
                delivery_sh_time_text_p.html("送货日期：" + LS.get("delivery_sh_time_text"));
            }
            if (LS.get("delivery_fk_time_text") != null) {
                delivery_fk_time_text_p.html("付款方式：" + LS.get("delivery_fk_time_text"));
            } else {
                delivery_fk_time_text_p.html("");
            }
        }
        //#endregion
    }, true);
    //#endregion

    //#region  发票信息显示
    //alert(typeof (LS.get("isorInvice")) + LS.get("isorInvice") + ":" + typeof (LS.get("FaTHeader")) + LS.get("FaTHeader"));
    if (LS.get("isorInvice") == null || LS.get("isorInvice") == "0") {
        $("#invoice_Type_Text").html("不需要发票");
    } else {
        $("#invoice_Type_Text").html("发票类型：" + LS.get("invoice_Type_Text"));
    }
    if (LS.get("FaTHeader") != null) {
        if (LS.get("FaTHeader") != "-1") {
            $("#invoice_Theader_Text").html("发票抬头：" + LS.get("FaTHeader"));
        }
    }
    //#endregion

    Final_Price();

    //#region 提交订单
    var submitting;
    Unbind_bind("#orderConfirm_btn", "click", function () {
        if (submitting) {
            return false;
        }
        var $this = $(this);
        $("span.ui-btn-text", $this).text("提交中，请稍后……");
        var orderEntity_c = orderEntity.createNew();
        if (orderEntity.init_Judge(orderEntity_c)) {
            submitting = true;
            PostWcf({
                _api: "Order.add_order_info",
                _data: JSON.stringify(orderEntity_c)
            }, function (json) {
                if (json.status === 1 && typeof (json.info) == "object" && json.info != null) {
                    $("span.ui-btn-text", $this).text("提交订单");
                    LS.clear(); //先清再存
                    var delivery_array = {
                        slides: [
                            "make_ocode", //订单号
                            "make_total_order", //应付金额
                            "make_paytype", //支付方式
                            "make_logisticstype", //配送方式
                            "make_posttimetype" //送货时间
                        ],
                        values: [
                            json.info.ocode,
                            json.info.total_order,
                            json.info.paytype,
                            json.info.logisticstype,
                            json.info.posttimetype
                        ]
                    };
                    Delivery_info_Object(delivery_array);
                    submitting = false;
                    window.location.href = window.WebRoot + "CheckOut/makeorder.aspx";
                    //Change_Url(window.WebRoot + "CheckOut/makeorder.aspx");
                } else if (json.status == "-2") {
                    alert(json.msg);
                    window.location.href = window.WebRoot + "CheckOut/shoppingcart.aspx";
                    //Change_Url(window.WebRoot + "CheckOut/shoppingcart.aspx");
                } else {
                    alert(json.msg);
                    $("span.ui-btn-text", $this).text("提交订单");
                }

            }, true);
        }
        else {
            if (submitting == false) {
                return false
            }
            alert("信息还不完全！");
            submitting = true;
            $("span.ui-btn-text", this).text("提交订单");
        }
    });

    //#endregion
}
//#endregion

//#region 收货人列表信息页面
function addresslist_Fun() {

    GetWcf({
        _api: "Member.get_address_list"
    }, function (jsonString) {
        var addresslist_cont = $('#addresslist_cont');
        if (jsonString.status == 1 && typeof (jsonString.list) == "object" && jsonString.list != null && jsonString.list.length > 0) {
            var selected_addressId = LS.get("current_addressid");
            for (var i = 0; i < jsonString.list.length; i++) {
                //alert((jsonString.list[i].id.toString() === selected_addressId.toString()) + ":" + jsonString.list[i].id + ":" + selected_addressId);
                if (jsonString.list[i].id.toString() === selected_addressId.toString()) {
                    jsonString.list[i].get_def = true;
                } else {
                    jsonString.list[i].get_def = false;
                }
            }
            addresslist_cont.setTemplate($('#addresslist_cont_template').html());
            addresslist_cont.processTemplate(jsonString.list, null, { append: false });
            addresslist_cont.trigger('create');
        } else {
            //alert(jsonString.msg);
            addresslist_cont.setTemplate("<p>暂无收货信息！</p>");
            addresslist_cont.processTemplate(jsonString.list, null, { append: false });
            addresslist_cont.trigger('create');
        }

    }, true, {
        "ref_loading": $('#addresslist_cont'), "ref_loading_text": '<div style="text-align:center; background:#ffffff url(../images/loading.gif) no-repeat center center; height:60px;"></div>'
    });

    //#region 点击给radio赋值
    $("[name = radio_choice_add]:radio").live('change', function () {
        $("[name = radio_choice_add]:radio").attr("checked", false).checkboxradio("refresh");
        $(this).attr("checked", true).checkboxradio("refresh");   // 绑定事件及时更新checkbox的checked值
        //alert($("[name = radio_choice_add]:radio:checked").attr("value"));

    });
    //#endregion

    //#region 设置默认收货地址
    $("#addresslist_btn").live("click", function () {
        $("#frmAddress_list").validate({
            errorElement: "span",
            rules: {
                radio_choice_add: {
                    required: true
                }
            },
            messages: {
                radio_choice_add: {
                    required: "请选择收货地址"
                }
            },
            submitHandler: function (form) {
                //alert($("[name = radio_choice_add]:radio:checked").attr("value"));
                var address_id = $("[name = radio_choice_add]:radio:checked").attr("value") || 0;
                //alert(address_id);
                $("#Add_mesage").css("display", "none").text("");
                if (address_id == 0) {
                    $("#Add_mesage").css("display", "block").text("请选择收货地址");
                    return;
                }
                GetWcf({
                    _api: "Member.set_defaultaddress",
                    _url: "/" + address_id
                }, function (jsonString) {
                    if (jsonString.status == 1) {
                        Delete_Payment_info_Object("payment_text_name", "payment_Id");
                        var delivery_array = {
                            slides: [
                                "delivery_text_name", //配送方式名称
                                "delivery_Id", //配送方式ID
                                "delivery_sh_time_text", //送货时间的名称
                                "delivery_sh_time_id", //送货时间的值
                                "delivery_fk_text", //付款类型名称  如现金
                                "delivery_fk_id"//付款类型值
                            ]
                        };
                        Delelt_Delivery_info_Object(delivery_array);
                        LS.set("current_addressid", address_id); //设置默认收货地址
                        window.location.href = window.WebRoot + "CheckOut/orderconfirm.aspx";
                        //Change_Url(window.WebRoot + "CheckOut/orderconfirm.aspx");
                    } else {
                        alert(jsonString.msg);
                    }
                }, true);
            }
        });
    });
    //#endregion

}
//#endregion

//#region 支付方式
function paymentlist_Fun() {
    //#region 绑定支付方式信息
    var regionid = LS.get("county_id");
    if (regionid == null) {
        $('#field_pay_list').setTemplate("<p>暂无支付方式信息！</p>");
        $('#field_pay_list').processTemplate(jsonString.list, null, { append: false });
        $('#field_pay_list').trigger('create');
    } else {
        GetWcf({
            _api: "Order.get_payment_list",
            _url: "/" + regionid
        }, function (jsonString) {
            if (jsonString.status == 1 && typeof (jsonString.list) == "object" && jsonString.list.length > 0) {
                $('#field_pay_list').setTemplate($('#jTemplate').html());
                $('#field_pay_list').processTemplate(jsonString.list, null, { append: false });
                $('#field_pay_list').trigger('create');
                $("[name = radio-pay-1]:radio").attr("checked", false).checkboxradio("refresh");
                $("[name = radio-pay-1]:radio:first").attr("checked", true).checkboxradio("refresh");
            } else {
                $('#field_pay_list').setTemplate("<p>暂无支付方式信息！</p>");
                $('#field_pay_list').processTemplate(jsonString.list, null, { append: false });
                $('#field_pay_list').trigger('create');
            }
        }, true);
    }
    //#endregion

    //#region 点击给radio赋值
    $("[name = radio-pay-1]:radio").live('change', function () {
        $("[name = radio-pay-1]:radio").attr("checked", false).checkboxradio("refresh");
        $(this).attr("checked", true).checkboxradio("refresh");   // 绑定事件及时更新checkbox的checked值
    });
    //#endregion

    //#region 提交支付方式
    $("#paymentlist_sub_btn").live('click', function () {
        Payment_info_Object($("[name = radio-pay-1]:radio:checked").parent().find("label").attr("text"), $("[name = radio-pay-1]:radio:checked").attr("value"));
        var delivery_array = {
            slides: [
                "delivery_text_name", //配送方式名称
                "delivery_Id", //配送方式ID
                "delivery_sh_time_text", //送货时间的名称
                "delivery_sh_time_id", //送货时间的值
                "delivery_fk_text", //付款类型名称  如现金
                "delivery_fk_id"//付款类型值
            ]
        };
        Delelt_Delivery_info_Object(delivery_array);
        window.location.href = window.WebRoot + "CheckOut/orderconfirm.aspx";
        //Change_Url(window.WebRoot + "CheckOut/orderconfirm.aspx");
    });
    //#endregion
}
//#endregion

//#region 配送方式
function deliverylist_Fun() {
    //#region  控制送货时间
    var sh_type_radio_checked = function () {
        var sh_type_radio_value = $("[name = radio-type-1]:radio:checked").attr("value");
        if (sh_type_radio_value === "1") {
            $("#sh_time").css("display", "block");
            $("[name = radio-date-1]:radio").attr("checked", false).checkboxradio("refresh");
            $("[name = radio-date-1]:radio:first").attr("checked", true).checkboxradio("refresh");
        } else {
            $("#sh_time").css("display", "none");
            $("[name = radio-date-1]:radio").attr("checked", false).checkboxradio("refresh");
        }
    };
    //#endregion

    //#region  控制货到付款就有付款方式
    var payment_Id = LS.get("payment_Id");
    if (payment_Id == "0") {
        $("#fk_type").css("display", "block");
        $("[name = radio-pay-1]:radio").attr("checked", false).checkboxradio("refresh");
        $("[name = radio-pay-1]:radio:first").attr("checked", true).checkboxradio("refresh");
    } else {
        $("#fk_type").css("display", "none");
        $("[name = radio-pay-1]:radio").attr("checked", false).checkboxradio("refresh");
    }
    //#endregion

    //#region 绑定配送方式信息
    var regionid = LS.get("county_id");
    var paygroupid = LS.get("payment_Id");
    GetWcf({
        _api: "Order.get_logistics_list",
        _url: "/" + regionid + "/" + paygroupid
    }, function (jsonString) {
        if (jsonString.status == 1 && typeof (jsonString.list) == "object" && jsonString.list.length > 0) {
            $('#deliverylist_cont').setTemplate($('#deliverylist_cont_template').html());
            $('#deliverylist_cont').processTemplate(jsonString.list, null, { append: false });
            $('#deliverylist_cont').trigger('create');
            //没有任何默认值时指定
            $("[name = radio-type-1]:radio").attr("checked", false).checkboxradio("refresh");
            $("[name = radio-type-1]:radio:first").attr("checked", true).checkboxradio("refresh");   // 绑定事件及时更新checkbox的checked值
            sh_type_radio_checked();
        } else {
            $('#deliverylist_cont').setTemplate("<p>暂无配送方式信息！</p>");
            $('#deliverylist_cont').processTemplate(jsonString.list, null, { append: false });
            $('#deliverylist_cont').trigger('create');
        }

    }, true);
    //#endregion

    //#region 点击给radio赋值
    $("[name = radio-type-1]:radio").live('change', function () {
        $("[name = radio-type-1]:radio").attr("checked", false).checkboxradio("refresh");
        $(this).attr("checked", true).checkboxradio("refresh");   // 绑定事件及时更新checkbox的checked值

        sh_type_radio_checked();
    });
    $("[name = radio-date-1]:radio").live('change', function () {
        $("[name = radio-date-1]:radio").attr("checked", false).checkboxradio("refresh");
        $(this).attr("checked", true).checkboxradio("refresh");   // 绑定事件及时更新checkbox的checked值
    });
    $("[name = radio-pay-1]:radio").live('change', function () {
        $("[name = radio-pay-1]:radio").attr("checked", false).checkboxradio("refresh");
        $(this).attr("checked", true).checkboxradio("refresh");   // 绑定事件及时更新checkbox的checked值
    });
    //#endregion

    //#region 提交支付方式
    $("#deliverylist_sub_btn").live('click', function () {
        var delivery_array = {
            slides: [
                "delivery_text_name", //配送方式名称
                "delivery_Id", //配送方式ID
                "delivery_sh_time_text", //送货时间的名称
                "delivery_sh_time_id", //送货时间的值
                "delivery_fk_text", //付款类型名称  如现金
                "delivery_fk_id"//付款类型值
            ],
            values: [
                $("[name = radio-type-1]:radio:checked").parent().find("span.ui-btn-text").text() || "null",
                $("[name = radio-type-1]:radio:checked").attr("value") || "null",
                $("[name = radio-date-1]:radio:checked").parent().find("span.ui-btn-text").text() || "null",
                $("[name = radio-date-1]:radio:checked").attr("value") || "null",
                $("[name = radio-pay-1]:radio:checked").parent().find("span.ui-btn-text").text() || "null",
                $("[name = radio-pay-1]:radio:checked").attr("value") || "null"
            ]
        };
        Delivery_info_Object(delivery_array);
        window.location.href = window.WebRoot + "CheckOut/orderconfirm.aspx";
        //Change_Url(window.WebRoot + "CheckOut/orderconfirm.aspx");
    });
    //#endregion
}
//#endregion

//#region 发票信息
function invoice_Fun() {
    var FaTtype_Status = function () {
        $("[name = FaTtype]:radio").attr("checked", false).checkboxradio("refresh");
        $("[name = FaTtype]:radio:first").attr("checked", true).checkboxradio("refresh");
    }

    //#region 给默认赋值
    var invoice_default_status = function () {
        $("[name = IsNoInvoice]:radio").attr("checked", false).checkboxradio("refresh");
        $("[name = IsNoInvoice]:radio:first").attr("checked", true).checkboxradio("refresh");

        $("#FaTHeader,#invoice_Type").css("display", "none");
        $("[name = FaTtype]:radio").attr("checked", false).checkboxradio("refresh");
        $("#FaTHeader").val("");
        $("#Cah_Mesag").css("display", "none").text("");
    };
    //#endregion

    //#region 否
    invoice_default_status();
    //#endregion

    //#region 个人
    var invoice_Personal_Status = function () {
        $("#FaTHeader").css("display", "none").val("");
        $("#Cah_Mesag").css("display", "none").text("");
        FaTtype_Status();
        $("#invoice_Type").css("display", "block");
    }
    //#endregion

    //#region 公司
    var invoice_company_Status = function () {
        FaTtype_Status();
        $("#FaTHeader,#invoice_Type").css("display", "block");
    }
    //#endregion
    Unbind_bind("[name = IsNoInvoice]:radio", "click", function () {
        $("[name = IsNoInvoice]:radio").attr("checked", false).checkboxradio("refresh");
        $(this).attr("checked", true).checkboxradio("refresh");
        var current_Status = $(this).attr("value");
        if (current_Status === "0") {
            invoice_default_status();
        } else if (current_Status === "1") {
            invoice_Personal_Status();
        } else if (current_Status === "2") {
            invoice_company_Status();
        }
    });

    //#region  提交发票信息
    Unbind_bind("#invoice_btn", "click", function () {
        var isorInvice, FaTHeader, invoice_Type; //是否要发票、发票抬头、发票类型
        isorInvice = $("[name = IsNoInvoice]:radio:checked").attr("value") || "-1";
        FaTHeader = $("#FaTHeader").val() || "-1";
        invoice_Type = $("[name = FaTtype]:radio:checked").attr("value") || "-1";
        var di_no = $("#FaTHeader").attr("style").toString();
        if (di_no.indexOf("block") != "-1") {
            if ($("#FaTHeader").val() == "") {
                $("#Cah_Mesag").css("display", "block").text("请填写发票抬头");
                return;
            } else {
                $("#Cah_Mesag").css("display", "none").text("");
            }
        }
        //alert($("[name = FaTtype]:radio:checked").text());
        var delivery_array = {
            slides: [
                "isorInvice", //是否要发票
                "FaTHeader", //发票抬头
                "invoice_Type", //发票类型
                "invoice_Type_Text"
            ],
            values: [
                isorInvice,
                FaTHeader,
                invoice_Type,
                $("[name = FaTtype]:radio:checked").parent().find("span.ui-btn-text").text()
            ]
        };
        Delivery_info_Object(delivery_array); //发票信息存储
        window.location.href = window.WebRoot + "CheckOut/orderconfirm.aspx";
        //Change_Url(window.WebRoot + "CheckOut/orderconfirm.aspx");
    });
    //#endregion
}
//#endregion

//#region 获取省市区数据
var proviceA = "", cityA = "", townA = "";
function GetPrCiTownAjaxDate() {
    GetWcf({
        _api: "Order.get_allregion_list"
    }, function (jsonString) {
        if (jsonString.status == 1 && typeof (jsonString.info) == "object" && jsonString.info.length > 0) {
            proviceA = jsonString.info[0];
            cityA = jsonString.info[1];
            townA = jsonString.info[2];
        } else {
            alert(jsonString.msg);
        }
    }, true, {
        async: false
    });
}
//#endregion

//#region 获取省
function ProViceCityTown_Function() {
    var s1P = [];
    var s1 = jQuery("#PCR select#s1s");
    s1.empty();
    for (var i = 0, len = proviceA.length; i < len; i++) {
        s1P[i] = "<option value='" + proviceA[i].id + "'>" + proviceA[i].name + "</option>";
    }
    $(s1P.join('')).appendTo(s1);
    $("#PCR select#s1s").selectmenu('refresh');
    var myselect = $("#PCR select#s1s");
    myselect[0].selectedIndex = 0;
    myselect.selectmenu("refresh");
    getCity();
}
//#endregion

//#region 获取市
function getCity() {
    var s1 = jQuery("#PCR select#s1s").val();
    var s2 = jQuery("#PCR select#s2s");
    var s2C = [];
    s2.empty();
    for (var i = 0, len = cityA.length; i < len; i++) {
        if (s1 == cityA[i].pid) {
            s2C[i] = "<option value='" + cityA[i].id + "'>" + cityA[i].name + "</option>";
        }
    }
    $(s2C.join('')).appendTo(s2);
    $("#PCR select#s2s").selectmenu('refresh');
    var myselect = $("#PCR select#s2s");
    myselect[0].selectedIndex = 0;
    myselect.selectmenu("refresh");
    getTown();
}
//#endregion

//#region 获取区
function getTown() {
    var s2 = jQuery("#PCR select#s2s").val();
    var s3 = jQuery("#PCR select#s3s");
    var s3C = [];
    s3.empty();
    for (var i = 0, len = townA.length; i < len; i++) {
        //if (s2 == townA[i].pid && townA[i].name != '市辖区') {
        if (s2 == townA[i].pid) {
            s3C[i] = "<option value='" + townA[i].id + "'>" + townA[i].name + "</option>";
        }
    }
    $(s3C.join('')).appendTo(s3);
    $("#PCR select#s3s").selectmenu('refresh');
    var myselect = $("#PCR select#s3s");
    myselect[0].selectedIndex = 0;
    myselect.selectmenu("refresh");
}
//#endregion

//#region 给省市区绑定事件
function BindClick_Pro_City_Town_Event_Fun() {
    GetPrCiTownAjaxDate();
    ProViceCityTown_Function();
    $("#s1s").live("change", function () {
        getCity();
    });
    $("#s2s").live("change", function () {
        getTown();
    });
}
//#endregion

//#region 点击给radio赋值
var address_add_update_Object = {};
address_add_update_Object.addressRadioChange = function () {
    $("[name = radio-choice-1]:radio").live('change', function () {
        $("[name = radio-choice-1]:radio").attr("checked", false).checkboxradio("refresh");
        $(this).attr("checked", true).checkboxradio("refresh");   // 绑定事件及时更新checkbox的checked值
    });
};
//#endregion

//#region 验证
address_add_update_Object.address_valite_c = function (id_obj) {
    $("#frmAddress_Add").validate({
        errorElement: "span",
        rules: {
            email: {
                required: true
            },
            addr: {
                required: true
            },
            zipCode: {
                required: true,
                number: true,
                rangelength: [6, 6]
            },
            mobilePhone: {
                required: true,
                number: true,
                rangelength: [11, 11]
            }
        },

        messages: {
            email: {
                required: "请填写收货人姓名"
            },
            addr: {
                required: "请填写详细的的收货地址"
            },
            zipCode: {
                required: "请填写邮政编码",
                number: "请填写正确的邮政编码",
                rangelength: "邮政编码只能是{0}位"
            },
            mobilePhone: {
                required: "请填写手机号码",
                number: "请填写正确的手机号码",
                rangelength: "手机号码只能是{0}位"
            }
        },
        submitHandler: function (form) {
            var email = $("#email").val();
            var s1s = $("#s1s option:selected").val(); //省
            var s1s_Text = $("#s1s option:selected").text();
            var s2s = $("#s2s option:selected").val(); //市
            var s2s_Text = $("#s2s option:selected").text();
            var s3s = $("#s3s option:selected").val(); //区
            var s3s_Text = $("#s3s option:selected").text();
            var addr = $("#addr").val();
            var zipCode = $("#zipCode").val();
            var type_add = $("[name = radio-choice-1]:radio:checked").attr("value");
            var mobilePhone = $("#mobilePhone").val();
            //alert(s1s+s1s_Text+s2s+s2s_Text+s3s+s3s_Text+addr+zipCode+type_add+mobilePhone);

            var jobj = { "addr": addr, "city": s2s_Text, "city_id": s2s, "contact_name": email, "county": s3s_Text, "county_id": s3s, "id": id_obj, "mobile": mobilePhone, "phone": "-", "province": s1s_Text, "province_id": s1s, "type": type_add, "zip": zipCode };


            PostWcf({
                _api: "Member.set_address_info",
                _data: JSON.stringify(jobj)
            }, function (json) {
                if (json.status == 1) {
                    if (id_obj > 0) { LS.set("current_addressid", id_obj); } else {
                        LS.set("current_addressid", json.info);
                    }
                    window.location.href = window.WebRoot + "CheckOut/addresslist.aspx";
                    //Change_Url(window.WebRoot + "CheckOut/addresslist.aspx");
                } else
                    $("#Cah_Mesag").css("display", "block").text(json.msg);
            }, true);
        }
    });
}
//#endregion

//#region 添加收货人信息
function address_add_Fun() {
    BindClick_Pro_City_Town_Event_Fun();
    address_add_update_Object.addressRadioChange();
    address_add_update_Object.address_valite_c("0");
}
//#endregion

//#region 修改收货人信息
function address_edit_Fun() {
    BindClick_Pro_City_Town_Event_Fun();
    //alert(window.location.search);
    var address_id = window.location.search.toString().replace("?address_id=", "");
    //#region 绑定收货人详细信息
    GetWcf({
        _api: "Member.get_address_info",
        _url: "/" + address_id
    }, function (jsonString) {
        if (jsonString.status == 1 && typeof (jsonString.info) == "object" && jsonString.info.contact_name != null) {
            $("#acc_id").val(jsonString.info.id);
            $("#email").val(jsonString.info.contact_name);
            //alert(jsonString.info.province_id);
            $("#s1s option[value=" + jsonString.info.province_id + "]").attr("selected", true); //省
            $("#s1s").selectmenu('refresh').trigger("change");
            $("#s2s option[value=" + jsonString.info.city_id + "]").attr("selected", true); //市
            $("#s2s").selectmenu('refresh').trigger("change");
            $("#s3s option[value=" + jsonString.info.county_id + "]").attr("selected", true); //区
            $("#s3s").selectmenu('refresh');

            //alert(jsonString.info.city_id);

            $("#addr").val(jsonString.info.addr);
            $("#zipCode").val(jsonString.info.zip);
            $("input[type='radio'][name=radio-choice-1][value=" + jsonString.info.type + "]").attr("checked", true).checkboxradio("refresh");
            $("#mobilePhone").val(jsonString.info.mobile);
        } else {
            $("#Cah_Mesag").text(jsonString.msg);
        }
    }, true, {
        async: false
    });
    //#endregion
    address_add_update_Object.addressRadioChange();
    //alert($("#acc_id").val());
    address_add_update_Object.address_valite_c($("#acc_id").val());
}
//#endregion

//#region 订单成功页面
var makeorder_Fun = function () {

    var make_oid = LS.get("make_ocode") || "no_c";
    var make_total_order = LS.get("make_total_order") || "no_c";
    var make_paytype = LS.get("make_paytype") || "no_c";
    var make_logisticstype = LS.get("make_logisticstype") || "no_c";
    var make_posttimetype = LS.get("make_posttimetype") || "no_c";
    var ocode = getParameter('ocode') || LS.get("make_ocode") || "no_c";
    var make_Nub = function (canstring, cansb) {
        if (cansb === "no_c") {
            $("#" + canstring).hide().text("");
            $("#" + canstring).prev().hide();
            $("#" + canstring).parent().hide();
        } else {
            if (canstring === "make_total_order") { $("#" + canstring).show().text(parseFloat(cansb).toFixed(2) + "元"); } else {
                $("#" + canstring).show().text(cansb);
            }
        }
    }

    make_Nub("make_oid", make_oid); //订单号
    make_Nub("make_total_order", make_total_order); //应付金额
    make_Nub("make_paytype", make_paytype); //支付方式
    make_Nub("make_logisticstype", make_logisticstype); //配送方式
    make_Nub("make_posttimetype", make_posttimetype); //送货时间

    $("#checkOrderDetail").attr("href", $("#orderdetail_url").val() + make_oid);

    GetWcf({
        _api: "Order.get_order_info",
        _url: ocode
    }, function (jsonString) {
        if (jsonString.status == 1 && typeof (jsonString.info) == "object" && jsonString.info != null) {
            if (jsonString.info.paystatusid === 0) {//未付款
                var url = $("#online_pay").attr("url");
                $("#online_pay").css("display", "block")
                    .attr("href", url.format([jsonString.info.ocode, jsonString.info.paytypeid]));
            }
            if (jsonString.info.paytype === "货到付款") {
                $("#online_pay").hide();
            }

        }
    }, false, {});

    Unbind_bind("#checkOrderDetail", "click", function () {
        window.location.href = window.WebRoot + "CheckOut/orderdetail.aspx?ocode=" + make_oid;
        //Change_Url(window.WebRoot + "CheckOut/orderdetail.aspx?ocode=" + make_oid);
    });
}
//#endregion

//#region 查看订单详细页
function orderdetail_Fun() {
    var ocode = getParameter('ocode') || LS.get("make_ocode") || "no_c";
    var make_paytype = LS.get("make_paytype") || "no_c";
    //alert(ocode);

    if (ocode != "no_c") {
        //#region 获取订单用户信息
        var orderdetail_template_container = $("#orderdetail_template_container");
        GetWcf({
            _api: "Order.get_order_info",
            _url: ocode
        }, function (jsonString) {
            if (jsonString.status == 1 && typeof (jsonString.info) == "object" && jsonString.info != null) {
                if (jsonString.info.paystatusid === 0) {//未付款
                    var btnOrderPay = $(".zaixian");
                    var url = btnOrderPay.attr("url");
                    btnOrderPay.css("display", "inline-block")
                        .attr("href", url.format([jsonString.info.ocode, jsonString.info.paytypeid]));
                };
                if (jsonString.info.statusid == 0 || jsonString.info.statusid == 1) {
                    $(".cancels_btn").css("display", "inline-block");
                };
                if (jsonString.info.paytype === "货到付款") {
                    $(".zaixian").hide();
                };
                orderdetail_template_container.setTemplate($('#orderdetail_template').html());
                orderdetail_template_container.processTemplate(jsonString.info, null, { append: false });
                orderdetail_template_container.listview('refresh');
            } else {
                orderdetail_template_container.setTemplate("<li>暂无用户信息</li>");
                orderdetail_template_container.processTemplate(jsonString.info, null, { append: false });
                orderdetail_template_container.listview('refresh');
            }
        }, true, {
            "ref_loading": orderdetail_template_container, "ref_loading_text": '<li style="text-align:center; background:url(../images/loading.gif) no-repeat center center; height:80px;"></li>'
        });
        //#endregion

        //#region 获取订单商品信息
        var ordergoods_list_template_container = $("#ordergoods_list_template_container");
        GetWcf({
            _api: "Order.get_ordergoods_list",
            _url: ocode
        }, function (jsonString) {
            if (jsonString.status == 1 && typeof (jsonString.list) == "object" && jsonString.list != null) {
                for (var i = 0; i < jsonString.list.length; i++) {
                    jsonString.list[i].pic_url = jsonString.list[i].pic_url.toString().replace("{0}", "normal");
                }
                ordergoods_list_template_container.setTemplate($('#ordergoods_list_template').html());
                ordergoods_list_template_container.processTemplate(jsonString.list, null, { append: false });
                ordergoods_list_template_container.listview('refresh');
            } else {
                ordergoods_list_template_container.setTemplate("<li>赞无商品信息</li>");
                ordergoods_list_template_container.processTemplate(jsonString.info, null, { append: false });
                ordergoods_list_template_container.listview('refresh');
            }
        }, true, {
            "ref_loading": ordergoods_list_template_container, "ref_loading_text": '<li style="text-align:center; background:url(../images/loading.gif) no-repeat center center; height:80px;"></li>'
        });
        //#endregion
    }
}
//#endregion

//#region 近N个月
var nearly_N_month = function (n) {
    var currentDate = new Date();

    var year = currentDate.getFullYear();
    var month = currentDate.getMonth() + 1 - n;
    var day = currentDate.getDate();
    var hour = currentDate.getHours();
    var min = currentDate.getMinutes();

    return year + "-" + month + "-" + day + " " + hour + ":" + min + ":00";
}
//#endregion

//#region 绑定订单列表
var BindOrderlist = function (nc) {
    var begintime = nearly_N_month(nc).toString(), endtime = nearly_N_month(0).toString();
    var orderlist_template_container = $("#orderlist_template_container");
    GetWcf({
        _api: "Order.get_order_list",
        _url: "/" + begintime + "/" + endtime
    }, function (jsonString) {
        if (jsonString.status == 1 && typeof (jsonString.list) == "object" && jsonString.list != null) {
            for (var i = 0; i < jsonString.list.length; i++) {
                jsonString.list[i].created = timeDate(jsonString.list[i].created);
            }
            orderlist_template_container.setTemplate($('#orderlist_template').html());
            orderlist_template_container.processTemplate(jsonString.list, null, { append: false });
            orderlist_template_container.listview('refresh');
        } else {
            orderlist_template_container.setTemplate("<li>暂无用户信息</li>");
            orderlist_template_container.processTemplate(jsonString.list, null, { append: false });
            orderlist_template_container.listview('refresh');
        }
    }, true, {
        "ref_loading": orderlist_template_container, "ref_loading_text": '<li style="text-align:center; background:url(../images/loading.gif) no-repeat center center; height:80px;"></li>'
    });
}
//#endregion

//#region 菜单选中
var changNav = {
    cangeStyle: function (tabs) {
        $("#oneMonth,#twoMonth").removeClass("ui-btn-up-e").addClass("ui-btn-up-c");
        var tabs = tabs || LS.get("tabs_order");
        $("#" + tabs).removeClass("ui-btn-up-c").addClass("ui-btn-up-e");
    },
    cange: function (obj) {
        $("#oneMonth,#twoMonth").removeClass("ui-btn-up-e").addClass("ui-btn-up-c");
        $(obj).removeClass("ui-btn-up-c").addClass("ui-btn-up-e");

    },
    trige: function () {
        LS.set("tabs_order", "oneMonth");
        changNav.cangeStyle(LS.get("tabs_order"));
        Unbind_bind("#oneMonth,#twoMonth", "click", function () {
            var id = $(this).attr("id");
            changNav.cangeStyle(id);
            LS.set("tabs_order", id);
            if (id === "oneMonth") {
                BindOrderlist(1);
            } else {
                BindOrderlist(2);
            }
        });
    }
}
//#endregion

//#region 订单列表页
function orderlist_Fun() {
    BindOrderlist(1);
    changNav.trige();
}
//#endregion

//#region 分类跳转到 商品列表
function ShowDetails(cust, id) {

    if (cust != null) {//alert(cust.child == null);
        if (cust.child == null) { Change_Url(window.WebRoot + "Product/productlist.aspx?categoryId=" + id); } else {
            Change_Url("#Product_SubCategory_Page");
            //alert($('#sub_category_template').html());
            $('#sub_categoryList').setTemplate($('#sub_category_template').html());
            $("#sub_categoryList").processTemplate(cust, null, { append: false });
            $("#sub_categoryList").listview("refresh");
            Unbind_bind(".cidA", "click", function () {
                Change_Url(window.WebRoot + "Product/productlist.aspx?categoryId=" + $(this).attr("id"));
            });
        }
    }
}
//#endregion

//#region 分类
var Category = {
    date_cate_list: null,
    bind_Template: function (jsonString) {
        //#region 给模板赋值
        $('#categoryList').setTemplate($('#categoryList_template').html());
        $('#categoryList').processTemplate(jsonString, null, { append: false });
        $("#categoryList").trigger("create");
        //#endregion
    },
    bindDate: function () {
        //alert(Category.date_cate_list == null);
        if (Category.date_cate_list == null) {
            GetWcf({
                _api: "Goods.get_goodscategory_list"
            }, function (jsonString) {
                if (jsonString.status == 1 && typeof (jsonString.info) == "object" && jsonString.info.length > 0) {
                    Category.date_cate_list = jsonString.info;
                    Category.bind_Template(jsonString.info);
                } else {
                    alert(jsonString.msg);
                }
            }, true, { "ref_loading_c": $('.loading_list'), "ref_loading_text_c": '<div style="text-align:center; background:url(../images/loading.gif) no-repeat center center; height:80px;"></div>' });
        }
    }
};
//#endregion

//#region 订单支付
function CheckOut_Onlinepayment() {
    //$.jTemplatesDebugMode(true);

    //#region 支付 列表 项目绑定
    function payListItemLister() {
        Unbind_bind($("#payList").find(".orderPayment"), "click", function () {
            var payId = $(this).attr("_payid");
            GetWcf({
                _api: "Payment.order_payment",
                _url: ocode + "/" + payId
            }, function (result) {
                if (result instanceof Object && result.status == 1) {
                    window.location = result.info;
                } else {
                    alert("网络异常，请稍后重试！");
                }
            });
        });
    };
    //#endregion

    var ocode = parseInt(GetUrlParam("ocode") || 0);
    var paygroup = parseInt(GetUrlParam("paygroup") || 0);
    if (!isNaN(ocode) && !isNaN(paygroup)) {
        GetWcf({
            _api: "BaseData.get_pay_list",
            _url: paygroup
        }, function (result) {
            window.result = result;
            if (result instanceof Object && result.list instanceof Array) {
                var payTitle = result.data;
                var payList = result.list;
                if (payList.length > 0) {
                    var $payList = $("#payList");
                    //$payList.setTemplateElement("payList_template");
                    $payList.setTemplateURL("/PageTemplate/PayListItem.tpl");
                    $payList.processTemplate(result);
                    $payList.listview("refresh");
                    payListItemLister();
                }

            } else {
                alert("获取数据出错！");
            }
        }, true);
    }
}
//#endregion

//#region 调用 Page Function

//#region Page函数列表
// 命名规则，funName = pageId
// pageId = url 域名之后的 值，trim 前后的 反斜杠，然后替换所有反斜杠为 下划线
// 比如： http://localhost:38839/User/Info 页面id：User_Info_Page
var PageFuns = {
    Index_Page: function () {
        Index_Fun();
    },
    Member_Login_Page: function (addUrl) {
        Login_Fun(addUrl);
    },
    Registration_Page: function (addUrl) {
        Register_Fun(addUrl);
    },
    Product_List_Page: function () {
        GoodProduct.currentPage = 1;
        GoodProduct.GoodProductList();
        GoodProduct.Salec_Price_newTime_Fun();
    },
    GoodsTopic_Page: function () {
        GoodTopic.currentPage = 1;
        GoodTopic.GoodProductList();
        GoodTopic.Salec_Price_newTime_Fun();
    },
    CheckOut_Address: function () {
        myAccount_Fun();
        LoingOut();
    },
    Product_Detail_Page: function () {
        productDetail_Fun();
    },
    ForgotPassword_Page: function () {
        Forgetpassword();
    },
    ForgotPassword_Result_Page: function () {
        ForgotPassword_Result();
    },
    CheckOut_Shoppingcart_Page: function () {
        shoppingcart_Fun();
    },
    CheckOut_OrderConfirm_Page: function () {
        orderconfirm_Fun();
        calculation_shipping_costs_Fun();
    },
    CheckOut_Shoppingcart_AddressList_Page: function () {
        addresslist_Fun();
    },
    CheckOut_Shoppingcart_PaymentList_Page: function () {
        paymentlist_Fun();
    },
    CheckOut_Shoppingcart_DeliveryList_Page: function () {
        deliverylist_Fun();
    },
    CheckOut_Shoppingcart_Invoice_Page: function () {
        invoice_Fun();
    },
    CheckOut_Add_Address_Page: function () {
        address_add_Fun();
    },
    CheckOut_Edit_Address_Page: function () {
        address_edit_Fun();
    },
    CheckOut_Makeorder_Page: function () {
        makeorder_Fun();
    },
    Member_OrderDetail_Page: function () {
        orderdetail_Fun();
    },
    Member_OrderList_Page: function () {
        orderlist_Fun();
    },
    Product_Category_Page: function () {
        Category.bindDate();
    },
    Product_SubCategory_Page: function () {
        Category.bindDate();
    },
    CheckOut_Onlinepayment_Page: function () {
        CheckOut_Onlinepayment();
    },
    NoticeDetail_Page: function () {
        noticedetail();
    }
};
//#endregion

//#region 页面函数对象
function PageFun() { }
//#endregion

//#region 获取函数
PageFun.GetFun = function (pageId) {

    var fun;

    if (typeof pageId == "undefined")
        fun = PageFuns.Index_Page;
    else {
        $.each(PageFuns, function (key, val) {
            var regexp = new RegExp(key, "ig");
            if (regexp.test(pageId) && typeof val == "function")
                fun = val;
        });
    }

    return fun;
};
//#endregion

//#region 页面函数初始化
//如果页面是手动打开，无需传入 pageid
PageFun.Init = function (pageId, objToPage) {
    Unbind_bind(".gotop", "tap", function () {
        $.mobile.silentScroll(0);
    });
    Get_shoppingcartgoodsnum_Fun();
    //判断页面是不是第一次打开
    if (typeof pageId == "undefined") {
        pageId = $(document.body).find("div[data-role = 'page']").eq(0).attr("id");
        window.mobile.pages["MainPage"] = pageId;
    } else {
        if (window.mobile.pages["MainPage"] == pageId) {
            //return;
        }
    }
    var addUrl = '';
    if (typeof objToPage != "undefined" && typeof objToPage.toPage[0] != "undefined") {
        addUrl = objToPage.toPage[0].baseURI;
    } else {
        addUrl = window.location.href;
    }
    var fun = PageFun.GetFun(pageId);
    var cacheFun = window.mobile.pages[pageId];

    //if (typeof cacheFun == "undefined") {
    if (true) {
        if (typeof fun == "function") {
            fun(addUrl);
            window.mobile.pages[pageId] = fun;
        }
    } else {

    }
};
//#endregion

//#endregion

//#region swipeup & swipedown 扩展方法
(function () {
    var supportTouch = $.support.touch,
        scrollEvent = "touchmove scroll",
        touchStartEvent = supportTouch ? "touchstart" : "mousedown",
        touchStopEvent = supportTouch ? "touchend" : "mouseup",
        touchMoveEvent = supportTouch ? "touchmove" : "mousemove";

    $.event.special.swipeupdown = {
        setup: function () {
            var thisObject = this;
            var $this = $(thisObject);

            $this.bind(touchStartEvent, function (event) {
                var data = event.originalEvent.touches ?
                        event.originalEvent.touches[0] :
                        event,
                    start = {
                        time: (new Date).getTime(),
                        coords: [data.pageX, data.pageY],
                        origin: $(event.target)
                    },
                    stop;

                function moveHandler(event) {
                    if (!start) {
                        return;
                    }

                    var data = event.originalEvent.touches ?
                        event.originalEvent.touches[0] :
                        event;
                    stop = {
                        time: (new Date).getTime(),
                        coords: [data.pageX, data.pageY]
                    };

                    //                    // prevent scrolling
                    //                    if (Math.abs(start.coords[1] - stop.coords[1]) > 10) {
                    //                        event.preventDefault();
                    //                    }
                }

                $this
                    .bind(touchMoveEvent, moveHandler)
                    .one(touchStopEvent, function (event) {
                        $this.unbind(touchMoveEvent, moveHandler);
                        if (start && stop) {
                            if (stop.time - start.time > 200 && stop.time - start.time < 1000 &&
                                Math.abs(start.coords[1] - stop.coords[1]) > 30 &&
                                Math.abs(start.coords[0] - stop.coords[0]) < 75) {
                                start.origin
                                    .trigger("swipeupdown")
                                    .trigger(start.coords[1] > stop.coords[1] ? "swipeup" : "swipedown");
                            }
                        }
                        start = stop = undefined;
                    });
            });
        }
    };

    $.each({
        swipedown: "swipeupdown",
        swipeup: "swipeupdown"
    }, function (event, sourceEvent) {
        $.event.special[event] = {
            setup: function () {
                $(this).bind(sourceEvent, $.noop);
            }
        };
    });

})();
//#endregion

//#region 绑定事件
$(function () {
    PageFun.Init();
    Unbind_bind(document, "pagechange", function (event, data) {
        Log($("#" + data.toPage[0].id));
        PageFun.Init(data.toPage[0].id, data);
    });

});
//#endregion