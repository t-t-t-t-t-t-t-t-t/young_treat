<template>
	<view class="body">
		<view class="circle">
			
		</view>
		<image class="pic" :src="AIpic" mode=""></image>
	</view>
</template>

<script>
	export default {
		name:"AISever",
		data() {
			return {
				AIpic:getApp().globalData.srcRoot + "aiSever.png",
			};
		}
	}
</script>

<style lang="scss" scoped>
.body{
	position: relative;
	width: 120rpx;
	height: 120rpx;
	border-radius: 50%;
	// overflow: hidden;
	background-color: #A9DEE2;
	box-shadow: 0 0 20rpx rgba(169, 222, 226, 0.8);
	.pic{
		width: 90%;
		height: 90%;
		margin: 5%;
	}
	.circle{
		width: 100%;
		height: 100%;
		border: 3px solid #A9DEE2;
		border-radius: 50%;
		position: absolute;
		top:0;
		left: 0;
		animation: emit 1.2s infinite;
	}
	
	@keyframes emit {
		0%{}
		100%{
			border-width: 1px;
			opacity: 0;
			transform: scale(1.4);
		}
	}
}
</style>