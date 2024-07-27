<!-- 论坛里的热搜文章 -->
<template>
	<view>
		<view class="passage" @tap="navToDetail()">
			<!-- 左边的文字 -->
			<view class="left">
				<!-- 浏览量及排名 -->
				<text class="order" :style=" order>3?'background-color:#A9DEE2':'' ">{{order<=9?'0'+order:order}}</text>
				<text class="access_num">{{passage_info.hit}} 浏览</text>
				<!-- 文章标题 -->
				<view class="title">
					{{passage_info.title}}
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
		name:"passage",
		props:{
			passage_info:{
				type:Object,
			},
			order:{
				type:String,
				default:"01",
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
.passage{
	display: flex;
	justify-content: space-between;
	padding: 30rpx 40rpx 30rpx;
	.left{
		width: 360rpx;
		
		.order{
			background-color: #70BCB2;
			padding: 5rpx 18rpx;
			border-radius: 10rpx;
			font-size: 30rpx;
			color: #fff;
			margin-right: 20rpx;
		}
		
		.access_num{
			line-height: 40rpx;
			font-size: 26rpx;
			color: #999;
		}
		
		.title{
			font-size: 32rpx;
			margin-top: 0.6em;
			overflow: hidden;
			//最多显示4行
			display: -webkit-box;
			-webkit-line-clamp: 4; /* 设置显示行数 */
			-webkit-box-orient: vertical;
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
</style>