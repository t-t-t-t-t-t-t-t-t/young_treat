<template>
	<view class="mainCard" @tap="choosePic()">
		<view class="title">
			<view class="square"></view>
			<view class="titleText">
				中医体质健康状态
			</view>
		</view>
		<!-- 拍照上传主体 -->
		<image :src="tempUrl" mode="aspectFit" class="photo"></image>
		<!-- 操作指引 -->
		<view class="process">
			<view class="processBlock">
				<image src="../../static/src/wenhao.png" mode="aspectFit" class="processIcon"></image>
				<view class="textBlock">
					查看示例
				</view>
			</view>
			<image src="../../static/src/youjiantou.png" mode="aspectFit" class="next"></image>
			<view class="processBlock">
				<image src="../../static/src/chidouren.png" mode="aspectFit" class="processIcon"></image>
				<view class="textBlock">
					伸出舌头
				</view>
			</view>
			<image src="../../static/src/youjiantou.png" mode="aspectFit" class="next"></image>
			<view class="processBlock">
				<image src="../../static/src/paizhao.png" mode="aspectFit" class="processIcon"></image>
				<view class="textBlock">
					拍照
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		name: "tongueCard",
		data() {
			return {
				//临时图片的路径
				tempUrl: getApp().globalData.srcRoot + "photography.png",
			};
		},
		methods: {
			//“点击拍照”按钮触发选择照片功能
			choosePic() {
				uni.chooseImage({
					count: 1,
					success: (res) => {
						this.tempUrl = res.tempFilePaths[0];
						uni.uploadFile({
							url: getApp().globalData.baseUrl + '/common/upload', //仅为示例，非真实的接口地址
							filePath: this.tempUrl,
							name: 'file',
							success: (uploadFileRes) => {
								console.log("照片选择成功！");
								console.log(uploadFileRes.data)
								let save = JSON.parse(uploadFileRes.data)
								console.log(save.data)
								this.$emit("update", save.data);
							}
						});
					},
					fail: (err) => {
						console.log("照片选择失败！");
					}
				})
			},
		}
	}
</script>

<style lang="scss" scoped>
	.mainCard {
		height: 800rpx;
		width: 688.5rpx;
		margin: 44rpx 0;
		padding: 26rpx 0;
		border-radius: 17.5rpx;
		box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.3);

		.title {
			display: flex;
			flex-wrap: nowrap;
			align-content: center;
		}

		.square {
			background-color: #008a98;
			width: 17.5rpx;
			height: 58rpx;

		}

		.titleText {
			margin-left: 19rpx;
			font-size: 35rpx;
			line-height: 58rpx;
			color: #3d3d3d;
		}

		.photo {
			padding: 11rpx 37rpx;
			width: 615rpx;
			height: 340rpx;
			border-radius: 17.5rpx;
		}

		.process {
			margin-top: 66.5rpx;
			height: 140rpx;
			display: flex;
			justify-content: center;
			align-items: center;

			.processBlock {
				width: 156rpx;
				text-align: center;

				.processIcon {
					width: 131.5rpx;
					height: 131.5rpx;
				}

				.textBlock {
					width: 156rpx;
					text-align: center;
				}
			}

			.next {
				width: 42rpx;
				height: 42rpx;
				margin: 0 15rpx;
			}
		}
	}
</style>