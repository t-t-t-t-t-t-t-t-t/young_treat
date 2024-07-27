export default{
	data() {
		return {
			//自定义头部的高度
			h:"60px",
			//重新登录 模态框
			reLogin:false, //是否显示 重新登录 模态框
			tips:"登录凭证已过期，请重新登录！", //模态框提示内容
		};
	},
	//全局函数
	methods: {
		//跳转至登录页面
		goToLogin(){
			//清除已过期的本地code数据
			uni.removeStorage({
				key:"authentication",
				success: () => {
					uni.redirectTo({
						url:"/pages/login/login"
					});
					this.reLogin = false;
				}
			});
		},
	},
	onLoad(){
		//初始化自定义头部组件的高度
		this.h = getApp().globalData.height;
	},
	//分享给好友
	onShareAppMessage(res) {
		const currentPage = getCurrentPages().pop();
		if(res.from==="menu"){
			return{
			  title: '养趣社区',
			  path: currentPage.route,
			}
		}
		return {
		  title: '养趣社区',
		  path: currentPage.route,
		  //分享描述信息
		  desc: getApp().globalData.desc,
		  // imageUrl:"/static/logo.png"
		}
	},
	//分享到朋友圈
	onShareTimeline(){
		
	}
}