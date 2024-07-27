<!-- 视频内容组件 -->
<template>
	<view class="body">
		<!-- 视频框 -->
		<view class="videoBox">
			<video class="video" :src="video.playUrl" :poster="video.cover" :title="video.title" :show-mute-btn="true"
			:enable-play-gesture="true"></video>
		</view>
		<!-- 视频信息以及点赞等操作 -->
		<view class="bottom">
			<!-- 作者头像 -->
			<u-avatar class="avatar" :src="avatarUrl" size="80" mode="circle"></u-avatar>
			<!-- 标题和日期 -->
			<view class="text">
				<view class="title">
					{{video.title}}
				</view>
				<!-- 作者名和日期 -->
				<view class="date">
					养趣youngtreat&nbsp; · &nbsp;{{video.createTime.substring(0,10)}}
				</view>
			</view>
			<!-- 视频操作 -->
			<view class="operation">
				<!-- 点赞 -->
				<view class="btn" @tap="loveVideo()">
					<view class="icon">
						<icon class="iconfont" :class="IsLoved?'icon-zan':'icon-icon'"></icon>
					</view>
					<view class="txt">
						{{loveNum <= 999 ? loveNum : "999+"}}
					</view>
				</view>
				<!-- 转发 -->
				<view class="btn">
					<view class="icon">
						<icon class="iconfont icon-fenxiang"></icon>
					</view>
					<view class="txt">
						分享
					</view>
					<button class="btnToShare" :plain="true" open-type="share" @tap="shareVideo()"></button>
				</view>
				
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		name:"myVideo",
		props:{
			video:Object,
		},
		data() {
			return {
				// 头像url
				avatarUrl:"https://hamster-test.oss-cn-shenzhen.aliyuncs.com/yangtreatLOGO.png",
				// 是否点赞
				IsLoved:false,
				// 点赞数
				loveNum: 0,
			};
		},
		created() {
			this.IsLoved = this.video.isLoved;
			this.loveNum = this.video.loveNum;
		},
		methods:{
			//分享视频
			shareVideo(){
				//获取分享描述内容保存到全局变量中
				getApp().globalData.desc = this.video.title;
			},
			//点赞视频
			loveVideo(){
				uni.request({
					url:getApp().globalData.baseUrl + "/video/love",
					header:{
						authentication:getApp().globalData.authentication
					},
					method:'POST',
					data:{
						videoId:this.video.videoId
					},
					success: (res) => {
						if(res.statusCode!==200){
							console.log("(取消)点赞视频失败！");
							return;
						}
						this.IsLoved = !this.IsLoved;
						if(this.IsLoved){
							console.log("点赞视频成功！");
							this.loveNum ++;
						}
						else{
							console.log("取消点赞视频成功！");
							this.loveNum --;
						}
						
					},
					fail: (err) => {
						console.log("(取消)点赞视频失败！");
					}
				})
			}
		}
	}
</script>

<style lang="scss" scoped>
.body{
	.videoBox{
		.video{
			width: 670rpx;
			height: 380rpx;
			margin: 0 10rpx;
			border-radius: 20rpx;
		}
	}
	.bottom{
		display: flex;
		margin-top: 20rpx;
		.text{
			width: 400rpx;
			margin-left: 16rpx;
			.title{
				//最多显示两行
				display: -webkit-box;
				overflow: hidden;
				text-overflow: ellipsis;
				-webkit-box-orient: vertical;
				-webkit-line-clamp: 2;
				font-size: 28rpx;
			}
			.date{
				font-size: 23rpx;
				color: #ccc;
				margin-top: 10rpx;
			}
		}
		.operation{
			flex:1;
			display: flex;
			justify-content: flex-end;
			.btn{
				position: relative;
				width: 70rpx;
				font-size: 23rpx;
				text-align: center;
				margin: 0 10rpx;
				
				color: #70BCB2;
				.iconfont{
					font-size: 40rpx;
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
}
</style>