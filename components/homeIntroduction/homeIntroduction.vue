<template>
	<view class="body">
		<!-- 文字标题 -->
		<view class="title">
			<view class="english">
				INTRODUCE
			</view>
			<view class="chinese">
				养趣文化馆
			</view>
		</view>
		<!-- 分割线 -->
		<view class="line">
			
		</view>
		<view class="text">
			养生文化，不只是一种生活方式，更是一种对自己的深情对话。它呼吁我们拥抱大自然的馈赠，敬畏生命的奇迹，从容面对岁月的流转。在这美丽的旋律中，我们与自己共舞，品味生命的芬芳，感悟幸福的真谛。
		</view>
	</view>
</template>

<script>
	export default {
		name:"homeIntroduction",
		data() {
			return {
				
			};
		}
	}
</script>

<style lang="scss">
.body{
	padding: 0rpx 30rpx 40rpx;
	background-color: #eee;
	.title{
		text-align: center;
		font-size: 90rpx;
		font-weight: 550;
		.english{
			color: #ddd;
			line-height: 230rpx;
		}
		.chinese{
			color: #222;
			position: relative;
			top: -120rpx;
			font-size: 60rpx;
		}
	}
	
	.line{
		width: 100rpx;
		height: 6rpx;
		background-color: #aaa;
		margin: -80rpx auto 50rpx;
	}
	
	.text{
		font-size: 34rpx;
		text-indent: 2em;
		line-height: 1.5em;
		color: #777;
	}
}
</style>