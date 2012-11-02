define(function (require, exports, module) {

	exports.initialize = function(){

		var $=require("jquery");
		var jQuery=$;
		var Backbone=require("backbone");
		var _=require("underscore");
		
		var viewContent=Backbone.View.extend({
			initialize: function () {
				this.render();
				Core.RefreshPage();
			},	
			render: function () {
				Core.PageChange(this.el,require("/templates/register.tpl"),{});
				return this;
			}
		});
		
		var uView = new viewContent({ el: $("#Index_Content") });
		
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
	
	};

});