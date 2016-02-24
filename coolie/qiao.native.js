/**
 * qiao.native.js
 * 注：牛股王app和js交互代码
 */
define(function (require, exports, module) {
    'use strict';
    
    var qiao = require('qiao.util.js');
    
	/**
	 * 初始化
	 * 需要在每个页面初始化时调用
	 */
	exports.init = function(){
		if(window.WebViewJavascriptBridge){
			exports.bridge = WebViewJavascriptBridge;
			exports.bridge.init(function(message, responseCallback){});
		}else{
			document.addEventListener('WebViewJavascriptBridgeReady', function() {
				exports.bridge = WebViewJavascriptBridge;
				exports.bridge.init(function(message, responseCallback){});
			}, false);
		}
	};
	exports.ios = function(doit){
		if(exports.bridge){
			doit(exports.bridge);
		}else{
			if(!exports.iosid){
				exports.iosid = setTimeout(function(){
					if(exports.bridge){
						clearTimeout(exports.iosid);
						doit(exports.bridge);
					}
				}, 50);
			}
		}
	};
	
	/**
	 * 获取usertoken
	 */
	exports.utoken = function(callback){
		if(qiao.search('debug')){
			if(callback) callback(qiao.search('utoken'));
		}else if(typeof android != 'undefined'){
			if(callback && android.getUserToken) callback(android.getUserToken());
		}else{
			exports.ios(function(bridge){
				var msg = JSON.stringify({
					methodtype : 'getUserToken'
				});
				
				bridge.send(msg, function(responseData) {
					var utoken = '';
					
					if(responseData){
						var json = JSON.parse(responseData);
						if(json) utoken = json.usertoken;
					}
					
					if(callback) callback(utoken);
				});
			});
		}
	};
	
	/**
	 * 获取gm相关token
	 */
	exports.gmflowno = 1;
	exports.getGMToken = function(callback){
		if(qiao.search('debug')){
			if(callback) callback({
				niuguToken	: 'i6aoORWJ07DGgfTVELASS2YxtqqJdO5Ypv4Wy7CPW-Q*',
				tradeToken	: '0GYXSTBL6JOOOOH63ASQ',
				flowno		: exports.gmflowno++
			});
		}else if(typeof android != 'undefined'){
			if(callback && android.getGMToken){
				var jsonstr = android.getGMToken();
				if(jsonstr) callback(JSON.parse(jsonstr));
			}
		}else{
			exports.ios(function(bridge){
				var msg = JSON.stringify({
					methodtype : 'getGMToken'
				});
				
				bridge.send(msg, function(responseData) {
					if(callback) callback(responseData ? JSON.parse(responseData) : {});
				});
			});
		}
	};
	
	/**
	 * 返回页面的时候是否刷新当前页面
	 * type=1，刷新
	 * type=0，不刷新
	 */
	exports.initRefresh = function(type){
		if(typeof android != 'undefined'){
			if(android.initRefresh) android.initRefresh(type);
		}else{
			exports.ios(function(bridge){
				var msg = JSON.stringify({
					methodtype : 'initRefresh',
					type : type
				});
				
				bridge.send(msg);
			});
		}
	};
	
	/**
	 * 关闭当前页面
	 */
	exports.closePage = function(){
		if(typeof android != 'undefined'){
			if(android.closePage) android.closePage();
		}else{
			exports.ios(function(bridge){
				var msg = JSON.stringify({
					methodtype : 'closePage'
				});
				
				bridge.send(msg);
			});
		}
	};
	
	/**
	 * 跳转到登录页面
	 */
	exports.login = function(){
		if(typeof android != 'undefined'){
			if(android.login) android.login();
		}else{
			exports.ios(function(bridge){
				var msg = JSON.stringify({
					methodtype : 'login'
				});
				
				bridge.send(msg);
			});
		}
	};
	
	/**
	 * 跳转到港美股账户页
	 */
	exports.toGMDetail = function(fundaccount){
		if(typeof android != 'undefined'){
			if(android.toGMDetail) android.toGMDetail(fundaccount);
		}else{
			exports.ios(function(bridge){
				var msg = JSON.stringify({
					methodtype : 'toGMDetail',
					fundaccount: fundaccount
				});
				
				bridge.send(msg);
			});
		}
	};
	
	/**
	 * 跳转到A股实盘开户页面
	 */
	exports.toOpenAccount = function(){
		if(typeof android != 'undefined'){
			if(android.toOpenAccount) android.toOpenAccount();
		}else{
			exports.ios(function(bridge){
				var msg = JSON.stringify({
					methodtype : 'toOpenAccount'
				});
				
				bridge.send(msg);
			});
		}
	};
	
	/**
	 * 跳转到绑定手机页面
	 */
	exports.bindMobile = function(){
		if(typeof android != 'undefined'){
			if(android.bindMobile) android.bindMobile();
		}else{
			exports.ios(function(bridge){
				var msg = JSON.stringify({
					methodtype : 'bindMobile'
				});
				
				bridge.send(msg);
			});
		}
	};
	
	/**
	 * 拨打电话
	 */
	exports.telPhone = function(tel){
		if(tel){
			if(typeof android != 'undefined'){
				if(android.telPhone) android.telPhone(tel);
			}else{
				location.href = 'tel:' + tel; 
			}
		}
	};
	
	/**
	 * 获取相机相册权限
	 */
	exports.getCameraPhoto = function(callback){
		if(qiao.search('debug')){
			callback({});
		}else if(typeof android != 'undefined'){
//			android.getCameraPhoto();
			callback({});
		}else{
			exports.ios(function(bridge){
				var msg = JSON.stringify({
					methodtype : 'getCameraPhoto'
				});
				
				bridge.send(msg, function(responseData) {
					if(callback) callback(responseData ? JSON.parse(responseData) : '');
				});
			});
		}
	};
	
	/**
	 * 设置标题
	 */
	exports.setTitle = function(title){
		if(title){
			if(typeof android != 'undefined'){
				if(android.setWebTitle) android.setWebTitle(title);
			}else{
				exports.ios(function(bridge){
					var msg = JSON.stringify({
						methodtype : 'settitle',
						title : title
					});
					
					bridge.send(msg);
				});
			}
		}
	};
	
	/**
	 * 初始化分享
	 * title，分享标题
	 * content，分享描述
	 * url，分享地址
	 * type，
	 */
    exports.initShare = function(title, content, url, type){
    	if(typeof android != 'undefined'){
    		if(android.initShare) android.initShare(title, content, url, type);
    	}else{
    		exports.ios(function(bridge){
    			var msg = JSON.stringify({
    				methodtype 		: 'initShare',
    				shareTitle 		: title,
    				shareContent 	: content,
    				shareUrl	 	: url,
    				type 			: type
    			});
				
				bridge.send(msg);
			});
    	}
    };
});