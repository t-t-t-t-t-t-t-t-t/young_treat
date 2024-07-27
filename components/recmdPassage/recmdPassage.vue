<!-- 论坛里的推荐文章 -->
<template>
	<view class="body" @tap="navToDetail()">
		<!-- 日期 -->
		<view class="date">
			{{passage_info.createTime.substring(0,10)}}
		</view>
		<view class="passage">
			<!-- 左边的文字 -->
			<view class="left">
				<!-- 文章标题 -->
				<view class="title">
					{{passage_info.title}}
				</view>
				<!-- 浏览量及排名 -->
				<view class="leftBottom">
					<text class="access_num">浏览 {{passage_info.hit||passage_info.hitNum}}</text>
					<text class="createTime">点赞 {{passage_info.loveNum}}</text>
				</view>
			</view>
			<!-- 右边的图片 -->
			<view class="pic">
				<image class="image" mode="aspectFill" :src="passage_info.image"></image>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		name:"recmdPassage",
		props:{
			passage_info:{
				type:Object,
			}
		},
		data() {
			return {
				
			};
		},
		methods:{
			//跳转到文章详情页面
			navToDetail(){
				uni.navigateTo({
					url:"/pages/passageInfo/passageInfo"+`?id=${this.passage_info.id}`
				})
			}
		},
	}
</script>

<style lang="scss" scoped>
	.body{
		padding: 20rpx 30rpx;
		margin: 30rpx 20rpx;
		background-color: #fff;
		border-radius: 30rpx;
		box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
		.date{
			color: #aaa;
			font-size: 30rpx;
			margin-bottom: 20rpx;
		}
		.passage{
			position: relative;
			display: flex;
			justify-content: space-between;
			.left{
				width: 360rpx;
				padding-top: 26rpx;
				padding-right: 10rpx;
				.title{
					font-size: 34rpx;
					overflow: hidden;
					//最多显示3行
					display: -webkit-box;
					-webkit-line-clamp: 3; /* 设置显示行数 */
					-webkit-box-orient: vertical;
				}
				
				//浏览量和日期显示在文章底部
				.leftBottom{
					position: absolute;
					line-height: 40rpx;
					font-size: 26rpx;
					color: #999;
					bottom: 10rpx;
					.access_num{
						padding-right: 30rpx;
					}
				}
			}
			.pic{
				.image{
					width: 280rpx;
					height: 210rpx;
					border-radius: 20rpx;
				}
			}
		}
	}

</style>