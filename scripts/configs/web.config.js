define(function(require, exports, module) {

	//#region restful Url
	var restful = {
		"Member.GetInfo" : "Member.svc/get_member_info",
		"Member.Login" : "Member.svc/login",
		"Member.logout" : "Member.svc/logout",
		"Member.ReLogin" : "Member.svc/relogin",
		"Member.Register" : "Member.svc/register",
		"Goods.goodList" : "goods.svc/get_goods_list",
		"Member.GetMember.Info" : "Member.svc/get_member_info",
		"Goods.GetProductDetail.Info" : "goods.svc/get_goods_info",
		"Goods.goodspic.Info" : "goods.svc/get_goodspic_list",
		"Goods.shoppingcartgoodsnum" : "order.svc/get_shoppingcartgoodsnum",
		"Order.get_payment_list" : "basedata.svc/get_payment_list",
		"BaseData.get_pay_list" : "basedata.svc/get_pay_list",
		"Order.get_logistics_list" : "basedata.svc/get_logistics_list",
		"Member.get_defaultaddress_info" : "member.svc/get_defaultaddress_info",
		"Member.get_address_list" : "member.svc/get_address_list",
		"Order.get_allregion_list" : "basedata.svc/get_allregion_list",
		"Member.set_address_info" : "member.svc/set_address_info",
		"Member.get_address_info" : "member.svc/get_address_info",
		"Member.set_defaultaddress" : "member.svc/set_defaultaddress",
		"Order.get_shoppingcartgoods_list" : "order.svc/get_shoppingcartgoods_list",
		"Order.set_shoppingcartgoodsnum" : "order.svc/set_shoppingcartgoodsnum",
		"Order.add_goodstoshoppingcar" : "order.svc/add_goodstoshoppingcar",
		"Order.del_shoppingcart" : "order.svc/del_shoppingcart",
		"Order.get_temporder_info" : "order.svc/get_temporder_info",
		"Order.add_order_info" : "order.svc/add_order_info",
		"Order.get_order_info" : "order.svc/get_order_info",
		"Order.get_ordergoods_list" : "order.svc/get_ordergoods_list",
		"Order.get_order_list" : "order.svc/get_order_list",
		"Goods.get_goodscategory_list" : "goods.svc/get_goodscategory_list",
		"Member.reset_member_loginpassword" : "member.svc/reset_member_loginpassword",
		"Payment.order_payment" : "Payment.svc/order_payment",
		"Order.orderpayment_success" : "Order.svc/orderpayment_success",
		"Cms.get_columndata_list" : "Cms.svc/get_columndata_list",
		"Cms.get_columndata_info" : "Cms.svc/get_columndata_info",
		"Cms.get_notice_list" : "Cms.svc/get_notice_list",
		"Cms.get_notice_info" : "Cms.svc/get_notice_info"
	};
	//#endregion

	//#region 所有邮箱列表
	var emails = {
		'qq.com' : 'http://mail.qq.com',
		'gmail.com' : 'http://mail.google.com',
		'sina.com' : 'http://mail.sina.com.cn',
		'163.com' : 'http://mail.163.com',
		'126.com' : 'http://mail.126.com',
		'yeah.net' : 'http://www.yeah.net/',
		'sohu.com' : 'http://mail.sohu.com/',
		'tom.com' : 'http://mail.tom.com/',
		'sogou.com' : 'http://mail.sogou.com/',
		'139.com' : 'http://mail.10086.cn/',
		'hotmail.com' : 'http://www.hotmail.com',
		'live.com' : 'http://login.live.com/',
		'live.cn' : 'http://login.live.cn/',
		'live.com.cn' : 'http://login.live.com.cn',
		'189.com' : 'http://webmail16.189.cn/webmail/',
		'yahoo.com.cn' : 'http://mail.cn.yahoo.com/',
		'yahoo.cn' : 'http://mail.cn.yahoo.com/',
		'eyou.com' : 'http://www.eyou.com/',
		'21cn.com' : 'http://mail.21cn.com/',
		'188.com' : 'http://www.188.com/',
		'foxmail.coom' : 'http://www.foxmail.com'
	};
	//#endregion

	//Ajax 使用 LocalStore 缓存
	window.UseLocalStorage = true;
	//使用调试
	window.Debug = true;
	//代码测试中
	window.Testing = false;

	//module.exports = {
	return {
		SystemType : "WebSite",
		WebRoot : '/',
		JsRoot : '/scripts/',
		PicRoot : '/images/',
		//WcfRoot: "http://api.muyingzhijia.me/",
		WcfRoot : "http://192.168.100.41:9201/",
		Restful : restful,
		EmailGroup : emails
	};

});
