<template>
	<view class="body" v-show="item!==''">
		<!-- 自定义头部栏 -->
		<view class="Myheader" :style="{height: h}">
			<myNavigationBar :titleName="title" :needMenu="1" bgc="#fbfffd" :ifcheck="false"></myNavigationBar>
		</view>
		<!-- 头部标题、作者、时间 -->
		<view class="head">
			<!-- 文章标题 -->
			<view class="title">
				{{item.title}}
			</view>
			<!-- 作者 -->
			<view class="author">
				<text class="icon">原创</text>
				<text class="name">{{item.authorName}}</text>
			</view>
			<!-- 发布时间 -->
			<view class="date">
				<icon class="iconfont icon-shijian" style="margin-right: 10rpx;"></icon>{{item.createTime}}
			</view>
		</view>
		<!-- 文章内容 -->
		<view class="passageContent">
			<rich-text :nodes="item.content"></rich-text>
		</view>
		<!-- 文章阅读量底注 -->
		<view class="hitNum">
			阅读 {{item.hit}}
		</view>
		<!-- 底部栏（分享、点赞） -->
		<view class="bottom">
			<!-- 作者头像 -->
			<u-avatar :src="item.profile" size="70"></u-avatar>
			<!-- 作者名 -->
			<view class="authorName">
				{{item.authorName}}
			</view>
			<!-- 分享按钮 -->
			<view class="btn">
				<view class="icon">
					<icon class="iconfont icon-fenxiang"></icon>
				</view>
				<view class="txt">
					分享
				</view>
				<button class="btnToShare" :plain="true" open-type="share" @tap="switchShare(item.title)"></button>
			</view>
			<!-- 收藏按钮 -->
			<view class="btn" @tap="collectPass(item.id)">
				<view class="icon">
					<icon class="iconfont" :class="ifcollect?'icon-shoucang1':'icon-shoucang'"></icon>
				</view>
				<view class="txt">
					收藏
				</view>
			</view>
			<!-- 点赞按钮 -->
			<view class="btn" @tap="lovePass(item.id)">
				<view class="icon">
					<icon class="iconfont" :class="ifloved?'icon-zan':'icon-icon'"></icon>
				</view>
				<view class="txt">
					{{item.loveNum<=999?item.loveNum:"999+"}}
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	//导入事件总线
	import { EventBus } from '@/main';
	export default {
		data() {
			return {
				// 文章页面的标题
				title:"养趣原创",
				//文章内容的对象
				item:"",
				//是否已收藏
				ifcollect:false,
				//是否已点赞
				ifloved:false,
			}
		},
		onLoad(option) {
			//拿到传过来的文章id
			let id = option.id;
			this.getPassageInfo(id);
		},
		methods: {
			//根据id查询文章
			getPassageInfo(id){
				uni.request({
					url:getApp().globalData.baseUrl+`/article/${id}`,
					header:{
						authentication:getApp().globalData.authentication,
					},
					success: (res) => {
						if(res.statusCode!==200){
							console.log("获取文章详情信息失败！");
							return;
						}
						this.item = res.data.data;
						this.ifloved = this.item.loved;
						this.ifcollect = this.item.collected;
						this.loveNum = this.item.loveNum
						console.log("获取文章详情信息成功！")	
					},
					fail: (err) => {
						console.log("获取文章详情信息失败！")
					},
				})
			},
			//改变分享状态
			switchShare(desc){
				//获取分享描述内容保存到全局变量中
				getApp().globalData.desc = desc;
				//发送转发请求
				uni.request({
					url:getApp().globalData.baseUrl+"/article/forward",
					method:"POST",
					data:{
						articleId:this.item.id,
					},
					header:{
						authentication:getApp().globalData.authentication
					},
					success: (res) => {
						if(res.statusCode!=200){
							console.log("转发失败！"+res.errMsg);
							return;
						}
						console.log("转发成功！");
					},
					fail: (err) => {
						console.log("转发失败！");
						console.log(err);
					}
				});
			},
			//收藏文章
			collectPass(id){
				//改变收藏状态
				if(this.ifcollect){
					this.ifcollect = false;
				}
				else this.ifcollect = true;
				//发送请求
				uni.request({
					url:getApp().globalData.baseUrl+"/article/concelltion",
					method:"POST",
					data:{
						articleId:id
					},
					header:{
						authentication:getApp().globalData.authentication
					},
					success: (res) => {
						if(res.statusCode!=200){
							console.log("（取消）收藏操作失败！"+res.errMsg);
							return;
						}
						console.log("（取消）收藏成功！");
						//向用户页面传值
						EventBus.$emit('update', id,this.ifcollect);
					},
					fail: (err) => {
						console.log("（取消）收藏失败！");
						console.log(err);
					}
				});
			},
			//点赞文章
			lovePass(id){
				if(this.ifloved){
					this.ifloved = false;
					this.item.loveNum--;
					console.log("取消点赞成功！");
				}
				else this.ifloved = true;
				//发送请求
				uni.request({
					url:getApp().globalData.baseUrl+"/article/love",
					method:"POST",
					data:{
						articleId:id
					},
					header:{
						authentication:getApp().globalData.authentication
					},
					success: (res) => {
						if(res.statusCode!=200){
							console.log("（取消）点赞失败！"+res.errMsg);
							return;
						}
						if(this.ifloved){
							this.item.loveNum++;
						}
						//向用户页面传值
						EventBus.$emit('update', id);
						console.log("（取消）点赞成功！");
						
					},
					fail: (err) => {
						console.log("（取消）点赞失败！");
						console.log(err);
					}
				})
			}
		}
	}
</script>

<style lang="scss" scoped>
.body{
	padding-bottom: 20rpx;
	.head{
		color: #aaa;
		font-size: 30rpx;
		line-height: 2em;
		padding: 30rpx;
		.title{
			color: #000;
			font-size: 40rpx;
			margin: 26rpx 0;
			line-height: 1.5em;
		}
		.author{
			.icon{
				background-color: #eee;
				padding: 6rpx 10rpx;
				margin-right: 20rpx;
			}
			.name{
				color: #70BCB2;
			}
		}
	}
	.hitNum{
		font-size: 30rpx;
		color: #aaa;
		margin: 100rpx 30rpx 0;
	}
	.bottom{
		padding: 30rpx 0rpx 30rpx 30rpx;
		display: flex;
		align-items: center;
		.authorName{
			width: 230rpx;
			margin-left: 20rpx;
			margin-right: 70rpx;
		}
		.btn{
			position: relative;
			width: 85rpx;
			font-size: 26rpx;
			text-align: center;
			margin: 0 16rpx;
			padding: 10rpx;
			color: #70BCB2;
			.iconfont{
				font-size: 50rpx;
			}
			.btnToShare{
				position: absolute;
				width: 100%;
				height: 100%;
				top: 0;
				left: 0;
				border: none;
			}
		}
	}
}
</style>
