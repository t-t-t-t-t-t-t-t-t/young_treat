<template>
	<view class="body">
		<!-- 自定义头部 -->
		<view class="Myheader" :style="{height:h}">
			<myNavigationBar titleName="登录" :needMenu="0"></myNavigationBar>
		</view>
		<!-- logo图片 -->
		<image 
		:src="picUrl" 
		mode=""
		class="logo"></image>
		<!-- 手机号（微信号）登录按钮 -->
		<button type="primary" class="wx_login" open-type="getPhoneNumber" @click="wechatLogin()">
			<!-- 手机图标 -->
			<image :src="phonePic" mode=""></image>
			微信登录
		</button>
		<!-- 其他登录方式 -->
		<view class="other_login">
			<!-- 文字分隔 -->
			<view class="caption">
				<text>—————其他登录方式—————</text>
			</view>
			<view class="tourist">
				<view class="circle" @click="isAlert=true;">
					<image :src="touristPic" mode=""></image>
				</view>
				游客登录
			</view>
			<!-- 警告提示 -->
			<u-alert-tips :show="isAlert" type="warning" close-able="true" @close="isAlert=false"
			 :title="alertTitle" :description="alertDesc" show-icon="true" class="alert">
			 </u-alert-tips>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				//是否显示警告提示框
				isAlert:false,
				alertTitle:"抱歉，暂未开放游客登录功能",//警告标题
				alertDesc:"Sorry, visitor login function is not available.",//警告描述
				//logo图片url
				picUrl:getApp().globalData.srcRoot+"logo.png",
				//手机图标
				phonePic:getApp().globalData.srcRoot+"phone.png",
				//游客图标
				touristPic:getApp().globalData.srcRoot+"user_unselected.png",
			};
		},
		created() {
			//检查是否已经登录了
			try {
				const value = uni.getStorageSync('authentication');
				if (value) {
					console.log("已登录");
					getApp().globalData.authentication = value;
					uni.switchTab({
						url:"/pages/home/home"
					});
				}
			} catch (e) {
				console.log("需要登录");
			}
		},
		methods:{
			wechatLogin(){
				//调用微信登录api
				uni.login({
					provider: 'weixin', // 指定为登录微信小程序
					onlyAuthorize:true, // 微信登录仅请求授权认证
					success: function (res) {
						//向后端服务器发送请求
						uni.request({
							url:getApp().globalData.baseUrl + "/user/login",
							method:"POST",
							data:{
								code:res.code,//用户授权临时票据(code)
							},
							//收到开发者服务器成功返回的回调函数
							success:(res)=>{
								if(res.statusCode!=200){
									console.log('登录失败，错误信息：'+res.errMsg);
									return;
								}
								uni.setStorage({
									key:"authentication",
									data:res.data.data.token,
									success: () => {
										getApp().globalData.authentication = res.data.data.token;
										uni.switchTab({
											url:"/pages/home/home"
										});
									},
									fail: (err) => {
										console.log('登录失败，错误信息：' + err);
									}
								});
							},
							//接口调用失败的回调函数
							fail: (err) => {
								console.log('登录失败，错误信息：' + err);
							}
						})
					},
					fail: (err) => {
						// 登录授权失败
						console.log('登录授权失败，错误信息：' + err);
					},
				});
			}
		}
	}
</script>

<style lang="scss" scoped>
.body{
	.logo{
		display: block;
		margin: 50rpx auto;
		height: 450rpx;
		width: 400rpx;
	}
	.wx_login{
		width: 600rpx;
		height: 100rpx;
		border-radius: 50rpx;
		line-height: 100rpx;
		background-color: #70BCB2;
		margin-bottom: 50rpx;
		font-size: 36rpx;
		image{
			display: inline-block;
			width: 48rpx;
			height:50rpx;
			margin-right: 10rpx;
			vertical-align: middle;
		}
	}
	.other_login{
		font-size: 32rpx;
		text-align: center;
		color:#777;
		padding: 0 30rpx;
		.caption{
			color: #ccc;
		}
		.circle{
			width: 100rpx;
			height: 100rpx;
			margin: 50rpx auto 10rpx;
			color: #aaa;
			border-radius: 50%;
			border: 2px solid #ccc;
			image{
				margin-top: 25%;
				width: 50%;
				height: 50%;
			}
		}
	}
	
	.alert{
		margin: 30rpx;
	}
}
</style>
