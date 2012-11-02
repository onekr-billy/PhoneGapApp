var yearid = jQuery('#select-choice-year');    //年所在的控件
var monthid = jQuery('#select-choice-month');    //月所在的控件
var dayid = jQuery('#select-choice-day');    //天所在的控件
var myDate = new Date();
var year = myDate.getFullYear();
var month = myDate.getMonth() + 1;
var day = myDate.getDate();
function InitYear() {
    jQuery('#select-choice-year').append('<option value="" selected="selected">年</option>');
    for (var i = year; i <= (year + 5); i++) {
        jQuery('#select-choice-year').append('<option value="' + i + '">' + i + '</option>');
    }
    jQuery('#select-choice-year').selectmenu('refresh');
    InitMonth();
    InitDate();
}
function InitMonth() {
    jQuery('#select-choice-month').html('');
    jQuery('#select-choice-month').append('<option value="" selected="selected">月</option>');
    for (var i = 1; i <= 12; i++) {
        jQuery('#select-choice-month').append('<option value="' + i + '">' + i + '</option>');
    }

    jQuery('#select-choice-month').change();
    jQuery('#select-choice-month').selectmenu('refresh');
}
function InitDate() {
    var yearValue = jQuery('#select-choice-year').val()
    var monthValue = parseInt(jQuery('#select-choice-month').val())
    var dayvalue =
    jQuery('#select-choice-day').html('');
    //alert(yearValue + monthValue);
    if (monthValue == 0) {
        monthValue = $.cookie("c_babybirth_month");
    }
    if (monthValue == 1 || monthValue == 3 || monthValue == 5 || monthValue == 7 || monthValue == 8 || monthValue == 10 || monthValue == 12) {
        dayvalue = 31;
    } else if (monthValue == 4 || monthValue == 6 || monthValue == 11 || monthValue == 9) {
        dayvalue = 30;
    } else if (monthValue == 2) {

        if (yearValue % 4 == 0 && (yearValue % 4 != 0 || yearValue % 400 == 0)) { //闰年
            dayvalue = 29;
        } else {
            dayvalue = 28;
        }

    }
    //alert(dayvalue);
    jQuery('#select-choice-day').append('<option value="" selected="selected">日</option>');
    for (var i = 1; i <= dayvalue; i++) {
        jQuery('#select-choice-day').append('<option value="' + i + '">' + i + '</option>');
    }
    jQuery('#select-choice-day').selectmenu('refresh');
}