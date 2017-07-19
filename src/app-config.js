
var XLINK_APP_ID="2e0fa6b22db1ee00"
var XLINK_SERVER="http://wx.xlink.cn"

var WECHAT_APP_ID="wx01fca666dc60594f"

var APP_URL="http://www.you-best-link.com/WechatDevice/MilkMixer/index.html"

export default {

	wxAppId:WECHAT_APP_ID,

	getOpenIdUrl:function(code){
		return XLINK_SERVER + '/v2/wechat_gateway/' + XLINK_APP_ID + '/get_open_id?code=' + code
	},

	getUserAuthorizeUrl:function(openid){
		return XLINK_SERVER + '/v2/wechat_gateway/' + XLINK_APP_ID + '/wx_access_token?open_id=' + openid + '&resource=wechat'
	},

	getDevicesUrl:function(openid){
		return XLINK_SERVER + '/v2/wechat_gateway/' + XLINK_APP_ID + '/wx_device_list?access_token=XLINKUserAccessToken&open_id=' + openid;
	},

	getJsApiSignUrl:function(nonceStr,timeStamp){

		return XLINK_SERVER + '/v2/wechat_gateway/' + XLINK_APP_ID + '/url_signature?nonceStr=' + nonceStr + '&timestamp=' + timeStamp + '&url=' + encodeURIComponent(window.location.href)
	},

	getOauthUrl:function(){
		var url="https://open.weixin.qq.com/connect/oauth2/authorize?appid=" + WECHAT_APP_ID;
		url+="&redirect_uri="+encodeURIComponent(APP_URL)+"&response_type=code&scope=snsapi_base&state=123456#wechat_redirect";
		return url;
	}

}