<template>
	<view class="body">
		<!-- 自定义头部栏 -->
		<view class="Myheader" :style="{height:h}">
			<myNavigationBar titleName="养趣正文" :needMenu="1" :ifcheck="false"></myNavigationBar>
		</view>
		<scroll-view class="bodyWrap" :style="{marginTop:h}" scroll-y style="height: 100%;width: 100%;"
			refresher-enabled @scroll="onpageScroll" :scroll-top="scrollTop" scroll-with-animation
			@refresherrefresh="onpullDownRefresh()" @scrolltolower="onreachBottom" :refresher-triggered="isRefresh">
			<!-- 帖子内容 -->
			<view class="postArea">
				<!-- 头部头像以及username 日期 -->
				<view class="head">
					<!-- 头像 -->
					<view class="profile-pic">
						<image class="image"
							:src="postInfo.profile!=null?postInfo.profile:'https://c-ssl.duitang.com/uploads/item/202003/09/20200309170801_nuuuH.jpeg'"
							alt="" />
					</view>
					<!-- 右边 -->
					<view class="right">
						<!-- 作者 -->
						<view class="username">
							{{postInfo.authorName}}
						</view>
						<!-- 日期 -->
						<view class="time">
							{{postInfo.createTime}}
						</view>
					</view>
				</view>
				<!-- 文字 -->
				<view class="words">
					{{postInfo.content}}
				</view>
				<!-- 图片 -->
				<view class="pic_mode2" v-if="imageLen==1">
					<image :src="url" alt="" v-for="(url,index) in postInfo.image" :key="index" mode="widthFix"
						class="pic2" />
				</view>
				<view class="pic_mode3" v-else-if="imageLen==4">
					<image :src="url" alt="" v-for="(url,index) in postInfo.image" :key="index" mode="aspectFill"
						class="pic3" />
				</view>
				<view class="pic_mode1" v-else-if="imageLen>0">
					<image :src="url" alt="" v-for="(url,index) in postInfo.image" :key="index" mode="aspectFill"
						class="pic1" />
				</view>
			</view>
			<view style="height: 6%;" class="tabContainer">
				<u-tabs-swiper ref="uTabs" :list="list" :current="current" @change="tabsChange" :is-scroll="false"
					swiperWidth="750" active-color="#b4dce1"></u-tabs-swiper>
			</view>
			<!-- 用来给上面的那个Bar切换,不可见但是必须要有 -->
			<swiper class="contents" :refresher-triggered="isRefresh" :current="swiperCurrent" @transition="transition"
				@animationfinish="animationfinish">
				<swiper-item class="swiper-item" v-for="(review_pieces,i) in review_pieces_arr" :key="i">
				</swiper-item>
			</swiper>
			<!-- 加载动画-->
			<view class="loader" v-if="review_pieces_arr[current]===undefined">
			</view>
			<!-- 评论区 -->
			<view class="reviews" v-for="(item, index) in review_pieces_arr[current]" :key="item.id">
				<reviews :item="item" @update="switchReviewLove(current,index)"></reviews>
			</view>
			<bottomLoading :isLoading="isLoading[current]"></bottomLoading>
			<view class="bottmBlock"></view>
		</scroll-view>
		<!-- 底部栏 -->
		<view :class="['bottomBar',isFocus?'active':'']">
			<view class="wrap-left">
				<!-- 发送 -->
				<input type="text" placeholder="说点什么..." v-model="myReview.content" confirm-type="send" @blur="blured"
					@focus="focused" />
				<button @click=sendReview>发送</button>
			</view>
			<view class="wrap-right">
				<!-- 喜欢 -->
				<view class="love" @click="switchLove()">
					<image :src="postInfo.isLoved?'/static/src/loved.png':'/static/src/love.png'" class="icon">
					</image>
					{{postInfo.loveNum}}
				</view>
				<!-- 转发 -->
				<view class="forward">
					<image :src="forward_url" class="icon"></image>
					{{postInfo.forwardNum}}
					<!-- 隐藏在文字下方的分享按钮 -->
					<button open-type="share" class="share" @click="switchShare">1</button>
				</view>
				<!-- 评论 -->
				<view class="comments">
					<image :src="comments_url" class="icon"></image>
					{{postInfo.postNum}}
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	import reviews from '../../components/reviews/reviews.vue';

	export default {
		components: {
			reviews
		},
		data() {
			return {
				// 自定义头部的高度
				h: "70px",
				// 当前帖子ID
				postID: "",
				// 当前帖子信息数组
				postInfo: {
					profile: '',
					image: {}
				},
				// 所有评论
				review_pieces_arr: [],
				//获取第几页的数据
				pageNum: [],
				//每次获取多少条数据
				pageSize: 10,
				//下拉加载的提示状态
				isLoading: [],
				// 加载动画
				isRefresh: false,
				// 输入框
				isFocus: false,
				love_url: "/static/src/love.png",
				forward_url: "/static/src/forward.png",
				comments_url: "/static/src/comments.png",
				//导航菜单列表
				list: [{
						name: '最热'
					},
					{
						name: '最新'
					},
				],
				// 因为内部的滑动机制限制，需将tabs组件和swiper组件的current用不同变量赋值
				current: 0, // tabs组件的current值，表示当前活动的tab选项
				swiperCurrent: 0, // swiper组件的current值，表示当前那个swiper-item是活动的
				scrollTop: 0, //滚动条距离顶部的距离
				oldScrollTop: 0,
				myReview: {
					content: ''
				},
				//用户凭证
				authentication: getApp().globalData.authentication,
				//点赞url
				loveUrl: getApp().globalData.baseUrl + "/square/love",
				//转发url
				forwardUrl: getApp().globalData.baseUrl + "/square/forward",
				reviewUrl: getApp().globalData.baseUrl + "/square/comment"
			};
		},
		onLoad(option) {
			this.h = getApp().globalData.height;
			this.postID = option.id;
			console.log(this.postID);
			this.getPost();
			for (let i = 0; i < 2; i++) {
				this.isLoading[i] = 0;
				this.pageNum[i] = 1;
				this.review_pieces_arr[i] = [];
				this.getReview(1, 6, i);
			}

		},
		methods: {
			getPost() {
				//发送请求得到帖子
				console.log(this.postID);
				uni.request({
					url: getApp().globalData.baseUrl + "/square/" + this.postID,
					data: {
						id: this.postID
					},
					header: {
						authentication: getApp().globalData.authentication,
					},
					success: (res) => {
						let post = res.data.data;
						Object.assign(this.postInfo, post) // 赋值
						console.log("获取帖子信息成功！");
						console.log(this.postInfo);
					},
					fail: (error) => {
						console.log("获取帖子信息失败！");
						console.log(error);
					}
				})
			},
			// 改变点赞的状态
			switchLove() {
				// 发送点赞请求
				uni.request({
					url: this.loveUrl,
					method: "POST",
					data: {
						squareId: this.postID,
					},
					header: {
						authentication: this.authentication
					},
					success: (res) => {
						if (res.statusCode != 200) {
							console.log("点赞失败！" + res.errMsg);
							return;
						}
						this.updatePost()
					},
					fail: (err) => {
						console.log("点赞失败！");
						console.log(err);
					}
				});
			},
			switchShare() {
				//获取分享描述内容保存到全局变量中

				getApp().globalData.desc = this.postInfo;
				//发送转发请求
				uni.request({
					url: this.forwardUrl,
					method: "POST",
					data: {
						squareId: this.postID,
					},
					header: {
						authentication: this.authentication
					},
					success: (res) => {
						if (res.statusCode != 200) {
							console.log("转发失败！" + res.errMsg);
							return;
						}
						this.updatePost()
					},
					fail: (err) => {
						console.log("转发失败！");
						console.log(err);
					}
				});
			},
			getReview(page, size, listType) {
				//显示加载框//得到评论
				uni.showToast({
					title: "正在加载中",
					icon: "loading",
					mask: true,
					duration: 3000
				});
				//发送请求
				uni.request({
					url: getApp().globalData.baseUrl + "/square/comment",
					method: 'GET',
					data: {
						squareId: this.postID,
						page: page,
						pageSize: size,
						listType: listType
					},
					header: {
						authentication: getApp().globalData.authentication,
					},
					success: (res) => {
						let pieces = res.data.data.records
						this.isRefresh = false;
						if (pieces.length === 0) {
							this.isLoading.splice(listType, 1, 2)
							console.log("没有惹~")
							return;
						}
						this.review_pieces_arr[listType] = [...this.review_pieces_arr[listType], ...pieces]
						console.log("获取评论信息成功！");
						console.log(this.review_pieces_arr[listType]);
						this.isLoading.splice(listType, 1, 0);
						//停止当前页面下拉刷新
						uni.stopPullDownRefresh();
						//隐藏加载框
						uni.hideToast()
					},
					fail: (error) => {
						console.log("获取评论信息失败！");
						console.log(error);
					}
				})
			},
			ApisendReview() {
				return new Promise((resolve, reject) => {
					uni.request({
						url: this.reviewUrl,
						method: "POST",
						data: {
							content: this.myReview.content,
							squareId: this.postID
						},
						header: {
							authentication: getApp().globalData.authentication,
						},
						success: (res) => {
							//如果登录凭证过期则显示模态框，让用户回去重新登录
							if (res.statusCode == 401) {
								this.reLogin = true;
								return;
							}
							resolve(res.data)
						},
						fail: (err) => {
							reject(err)
						}
					})
				})
			},
			ApiGetNewReview() {
				return new Promise((resolve, reject) => {
					uni.request({
						url: getApp().globalData.baseUrl + "/square/comment",
						method: 'GET',
						data: {
							squareId: this.postID,
							page: 1,
							pageSize: 1,
							listType: 1
						},
						header: {
							authentication: getApp().globalData.authentication,
						},
						success: (res) => {
							resolve(res.data)
						},
						fail: (error) => {
							reject(error)
						}
					})
				})
			},
			sendReview() {
				this.ApisendReview().then(res => {
					console.log("发送评论", res);
					this.ApiGetNewReview().then(res => {
						console.log("得到新发出去的评论", res.data.records[0])
						for (let i = 0; i < 2; i++) { // 给最热和最新的第一个插入最新发送的消息
							this.review_pieces_arr[i].unshift(res.data.records[0])
						}
						this.myReview.content = "";
						console.log("评论发布成功！");
					})
				})
			},
			onpullDownRefresh() {
				this.review_pieces_arr[this.current] = [];
				this.pageNum[this.current] = 1;
				this.getReview(1, 6, this.current);
				this.isRefresh = true;
				//显示加载框
				uni.showToast({
					title: "正在加载中",
					icon: "loading",
					mask: true,
					duration: 3000
				});
				console.log("刷新成功");
			},
			onreachBottom() {
				if (this.isLoading[this.current] == 2) {
					console.log("无了")
					return;
				}
				console.log("触底了~");
				//页码加1
				this.pageNum[this.current]++;
				//获取更多帖子
				this.isLoading.splice(this.current, 1, 1);
				this.getReview(this.pageNum[this.current], this.pageSize, this.current);
				//修改 下拉加载状态
			},
			switchReviewLove(current, pos) {
				if (this.review_pieces_arr[current][pos].isLoved == true) {
					this.review_pieces_arr[current][pos].loveNum--;
				} else {
					this.review_pieces_arr[current][pos].loveNum++;
				}
				this.review_pieces_arr[current][pos].isLoved = !this.review_pieces_arr[current][pos].isLoved;
				//触发视图更新
				this.review_pieces_arr.push([]);
				this.review_pieces_arr.pop();
			},
			//轮播图和导航菜单相关方法
			// tabs通知swiper切换
			tabsChange(index) {
				this.swiperCurrent = index;
			},
			// swiper-item左右移动，通知tabs的滑块跟随移动
			transition(e) {
				let dx = e.detail.dx;
				this.$refs.uTabs.setDx(dx);
			},
			// 由于swiper的内部机制问题，快速切换swiper不会触发dx的连续变化，需要在结束时重置状态
			// swiper滑动结束，分别设置tabs和swiper的状态
			animationfinish(e) {
				let current = e.detail.current;
				this.$refs.uTabs.setFinishCurrent(current);
				this.swiperCurrent = current;
				this.current = current;
			},
			onpageScroll(event) {
				//记录scroll  位置
				this.oldScrollTop = event.detail.scrollTop
				// // 滚动距离超过2000时显示 "置顶" 按钮
				// if(event.detail.scrollTop>2000){
				// 	this.ifToTop = true;
				// }
				// // 滚动距离小于600时隐藏 "置顶" 按钮
				// else if(event.detail.scrollTop<400){
				// 	this.ifToTop = false;
				// }
			},
			focused() {
				this.isFocus = true;
			},
			blured() {
				if (!this.myReview.content) {
					this.isFocus = false;
				}
			}
		},
		computed: {
			imageLen: function() {
				return this.postInfo.image.length
			}
		}
	}
</script>

<style lang="scss" scoped>
	.body {
		display: flex;
		flex-direction: column;
		// background-color: #eef1ee;
		height: 100vh;

		.bodyWrap {
			width: 100%;
			background-color: #fff;
			position: relative;

			.postArea {
				background-color: #fff;
				position: relative;
				margin: 0;

				.head {
					display: flex;
					padding: 28rpx 33rpx;

					.profile-pic {
						width: 105rpx;
						height: 105rpx;
						border-radius: 50%;
						overflow: hidden;

						.image {
							width: 100%;
							height: 100%;
						}
					}

					.right {
						margin-left: 15rpx;

						.username {
							font-family: Source Han Sans;
							font-size: 38.5rpx;
							font-weight: 500;
							line-height: 1.5em;
							color: #3D3D3D;
						}

						.time {
							font-family: Source Han Sans;
							font-size: 28rpx;
							color: #777;
						}
					}

				}

				.words {
					padding: 0 37rpx;
					font-family: Source Han Sans;
					font-size: 31.5rpx;
					line-height: 1.5em;
					color: #3D3D3D;
					padding-bottom: 20rpx;
				}

				.pic_mode1 {
					display: flex;
					flex-wrap: wrap;
					padding: 0rpx 27rpx 18rpx;

					.pic1 {
						width: 207rpx;
						height: 207rpx;
						margin: 6rpx;
					}
				}

				.pic_mode2 {
					padding: 0rpx 27rpx 18rpx;

					.pic2 {
						width: 400rpx;
						margin: 10rpx;
					}
				}

				.pic_mode3 {
					display: flex;
					flex-wrap: wrap;
					padding: 0rpx 200rpx 18rpx 27rpx;

					.pic3 {
						width: 210rpx;
						height: 210rpx;
						margin: 6rpx;
					}
				}


			}

			.contents {
				position: relative;
				height: 0%;
				width: 100%;

			}

			.bottmBlock {
				height: 20vh;
				width: 100%;
			}

			.tabContainer {}

			.loader {
				--c1: #673b14;
				--c2: #f8b13b;
				width: 40px;
				height: 80px;
				border-top: 4px solid var(--c1);
				border-bottom: 4px solid var(--c1);
				background: linear-gradient(90deg, var(--c1) 2px, var(--c2) 0 5px, var(--c1) 0) 50%/7px 8px no-repeat;
				display: grid;
				overflow: hidden;
				animation: l5-0 2s infinite linear;
				margin: 60rpx auto;

				@keyframes l5-0 {
					80% {
						transform: rotate(0)
					}

					100% {
						transform: rotate(0.5turn)
					}
				}

				@keyframes l5-1 {

					10%,
					70% {
						background-size: 100% 205%, var(--s, 0) 100%
					}

					70%,
					100% {
						background-position: top, center
					}
				}

				&::before,
				&::after {
					content: "";
					grid-area: 1/1;
					width: 75%;
					height: calc(50% - 4px);
					margin: 0 auto;
					border: 2px solid var(--c1);
					border-top: 0;
					box-sizing: content-box;
					border-radius: 0 0 40% 40%;
					-webkit-mask:
						linear-gradient(#000 0 0) bottom/4px 2px no-repeat,
						linear-gradient(#000 0 0);
					-webkit-mask-composite: destination-out;
					mask-composite: exclude;
					background:
						linear-gradient(var(--d, 0deg), var(--c2) 50%, #0000 0) bottom /100% 205%,
						linear-gradient(var(--c2) 0 0) center/0 100%;
					background-repeat: no-repeat;
					animation: inherit;
					animation-name: l5-1;
				}

				&::after {
					transform-origin: 50% calc(100% + 2px);
					transform: scaleY(-1);
					--s: 3px;
					--d: 180deg;
				}
			}
		}


		.bottomBar {
			$BarHeight: 90rpx;
			$paddingSize: 3%;
			$inputHeight: $BarHeight*0.7;
			$leftWidth: (100% - $paddingSize * 2)*0.5;
			$rightWidth: (100% - $paddingSize * 2) - $leftWidth;
			padding: 0 $paddingSize;
			height: $BarHeight;
			box-sizing: border-box;
			width: 100%;
			position: fixed;
			bottom: 0rpx;
			z-index: 20;
			display: flex;
			justify-content: space-between;
			flex-wrap: nowrap;
			align-items: center;
			border-top: 1px solid #e5e5e5;
			box-shadow: 0 0 10rpx 10rpx #e5e5e5;
			background-color: #fff;
			color: #ADADAD;

			&.active {
				$leftWidth: (100% - $paddingSize * 2);
				$inputWidth: 0.8;
				$gap: 0.02;

				.wrap-left {
					width: $leftWidth;
					display: flex;
					justify-content: space-between;

					input {
						width: $leftWidth* $inputWidth;
					}

					button {
						display: block;
						width: $leftWidth*(1 - $gap - $inputWidth);
						height: $inputHeight;
						border-radius: $inputHeight;
						line-height: $inputHeight;
						background-color: #a9dee2;
						font-weight: 500;
						font-size: 28rpx;
					}
				}

				.wrap-right {
					display: none;
				}
			}

			.wrap-left {
				height: $BarHeight;
				width: $leftWidth;
				display: flex;
				align-items: center;
				transition: all .5s;

				input {
					height: $inputHeight;
					line-height: $inputHeight;
					padding: 0rpx 20rpx;
					width: 100%;
					font-family: 思源黑体;
					font-size: 30rpx;
					border-radius: $inputHeight;
					background-color: #e5e5e5;
				}

				button {
					display: none;
				}

			}

			.wrap-right {
				height: $BarHeight;
				width: $rightWidth;
				display: flex;
				justify-content: space-evenly;
				align-items: center;
				position: relative;
				$height: 60rpx;

				.love,
				.forward,
				.comments {
					line-height: $height;
					height: $BarHeight;
					display: flex;
					flex-wrap: nowrap;
					align-items: center;
					position: relative;

					.icon {
						width: $height;
						height: $height;
						padding: 0;
						vertical-align: bottom;
					}
				}

				.forward {
					.share {
						height: $height;
						width: $height;
						font-size: 1rpx;
						font-weight: 0;
						position: absolute;
						opacity: 0;
					}
				}
			}
		}
	}
</style>