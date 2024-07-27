<template>
	<view>
		<view class="reviewArea">
			<!-- 头部头像以及username-->
			<view class="head">
				<!-- 头像 -->
				<view class="profile-pic">
					<image class="image"
						:src="item.profile!=null?item.profile:'https://c-ssl.duitang.com/uploads/item/202003/09/20200309170801_nuuuH.jpeg'"
						alt="" />
				</view>
				<!-- 右边 -->
				<view class="right">
					<!-- 作者 -->
					<view class="username">
						{{item.userName}}
					</view>
					<!-- 喜欢 -->
					<view class="love" @click="switchLove()">
						<image :src="item.isLoved?loved_url:love_url" class="icon"></image>
						{{item.loveNum}}
					</view>
				</view>
			</view>
			<!-- 文字 -->
			<view class="words">
				{{item.content}}
			</view>
			<!-- 日期 -->
			<view class="bottom">
				<view class="time">
					{{item.createTime}}
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		props: {
			//帖子的信息
			item: {
				type: Object,
				require: true,
			}
		},
		data() {
			return {
				love_url: "/static/src/love.png",
				loved_url: "/static/src/loved.png",
			};
		},
		methods: {
			 switchLove() {
				 uni.request({
					url: getApp().globalData.baseUrl + `/square/comment/love`,
					header: {
						authentication: getApp().globalData.authentication,
					},
					method: 'POST',
					data: {
						squareCommentId: this.$props.item.id
					},
					success: (res) => {
						//获取帖子列表
						console.log("点赞成功")
						this.$emit('update', this.item.id)// 更新这条评论
					},
					fail: (error) => {
						console.log("点赞失败！" + error);
					}
				})
			}
		},
	}
</script>

<style lang="scss" scoped>
	.reviewArea {
		background-color: #fff;
		margin: 0;

		// box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
		.head {
			display: flex;
			align-items: center;
			padding: 28rpx 33rpx;

			.profile-pic {
				width: 63rpx;
				height: 63rpx;
				border-radius: 50%;
				overflow: hidden;

				.image {
					width: 100%;
					height: 100%;
				}
			}

			.right {
				margin-left: 15rpx;
				display: flex;
				justify-content: space-between;
				align-items: center;
				width: 90%;

				.username {
					font-family: Source Han Sans;
					font-size: 31rpx;
					font-weight: 400;
					line-height: 1.5em;
					color: #696969;
				}

				.love {
					padding: 20rpx 5rpx;
					width: 100rpx;
					color: #ADADAD;

					.icon {
						width: 50rpx;
						height: 50rpx;
						margin-right: 5rpx;
						vertical-align: bottom;
					}

					line-height: 50rpx;
				}

			}

		}

		.words {
			padding: 0 100rpx;
			font-family: Source Han Sans;
			font-size: 28rpx;
			line-height: 1.5em;
			color: #000;
		}

		.bottom {
			display: flex;
			justify-content: space-between;
			margin: 20rpx 37rpx 0;
			padding: 20rpx 0;
			border-bottom: 1px solid #e5e5e5;
			color: #ADADAD;

			.time {
				padding: 0 63rpx;
				font-family: Source Han Sans;
				font-size: 21.5rpx;
				color: #6c6c6c;
			}
		}
	}
</style>