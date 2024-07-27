<!-- 下拉刷新时底部的加载提示 -->
<template>
	<view class="loading" :style="{'background-color':bgc,'padding-top':'20rpx'}">
		<view class="loader" v-if="isLoading===1" style="margin:20rpx auto"></view> 
		<view v-else-if="isLoading===2">
			<view class="bg-txt">别再往下滑了~</view>
			<image class="pic" :src="picUrl" mode="aspectFit" style="height: 70rpx;z-index: 1;"></image>
		</view>
		<view v-else style="height: 40rpx;">
			
		</view>
	</view>
</template>

<script>
	export default {
		name:"bottomLoading",
		props:{
			isLoading:{
				type:Number,
				default:0 //0表示没加载  1表示加载中  2表示没有更多数据了
			},
			//背景颜色
			bgc:{
				type:String,
				default:"#fff"
			}
		},
		data() {
			return {
				//图片资源路径
				picUrl:getApp().globalData.srcRoot + "mascot.png",
			};
		}
	}
</script>

<style lang="scss" scoped>
.loading{
	position: relative;
	text-align: center;
	font-size: 28rpx;
	color: #bbb;
	line-height: 56rpx;
	padding-bottom: 10rpx;
	.icon{
		width: 30rpx;
		height: 30rpx;
		margin-right: 10rpx;
		vertical-align: middle;
	}
	.bg-txt{
		position: relative;
		padding-left: 80rpx;
		bottom: 10rpx;
		font-size: 30rpx;
		z-index: 0;
	}
	.pic{
		position: absolute;
		width: 100%;
		right: 90rpx;
		top:0
	}
	
	.loader {
	  width: 15px;
	  aspect-ratio: 1;
	  background: #000;
	  border-radius: 50%;
	  animation: l6 1s infinite linear alternate;
	}
	@keyframes l6 {
	    0%  {box-shadow: 15px 0,-25px 0}
	    50% {box-shadow: 15px 0,-15px 0}
	    100%{box-shadow: 25px 0,-15px 0}
	}
}
</style>