<template>
	<view class="body">
		<view class="pic">
			<icon class="iconfont" :class="item.icon"></icon>
		</view>
		<view class="text">
			{{item.text}}
		</view>
	</view>
</template>

<script>
	export default {
		name:"functionButton",
		props:{
			item:{
				type:Object,
				default:{
					icon:"icon-shuimian",
					text:"睡眠专辑"
				}
			}
		},
		data() {
			return {
				
			};
		}
	}
</script>

<style lang="scss" scoped>
.body{
	width: 150rpx;
	text-align: center;
	font-size: 30rpx;
	padding: 20rpx 10rpx;
	.pic{
		.iconfont{
			font-size: 80rpx;
			color: #70BCB2;
		}
		margin-bottom: 16rpx;
	}
}
</style>