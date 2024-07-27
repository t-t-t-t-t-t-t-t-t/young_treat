<template>
	<view class="body">
		<!-- 头部 -->
		<view class="Myheader" :style="{height: h}">
			<myNavigationBar titleName="小羊同学" needMenu="1" bgc="#fafffa" :ifcheck="false"></myNavigationBar>
		</view>
		<!-- 聊天内容 -->
		<view class="content" v-show="chatList.length>1">
			<!-- 一行聊天内容 -->
			<view class="piece" v-for="(item,index) in chatList" :key="index">
				<!-- AI的回答 -->
				<view class="AI" v-if="item.role==='assistant'">
					<image class="AIavatar" :src="AIavatar" mode="aspectFit"></image>
					<view class="answer">
						{{item.content!==null?item.content:"小羊头脑风暴了..."}}
					</view>
				</view>
				<!-- 用户的提问 -->
				<view class="user" v-else>
					<view class="query">
						{{item.content}}
					</view>
					<view class="Useravatar">
						<image class="pic" :src="userInfo.profile" mode="aspectFit"></image>
					</view>
				</view>
			</view>
			<!-- AI正在思考中 -->
			<view class="piece" v-show="ifThinking">
				<view class="AI">
					<image class="AIavatar" :src="AIavatar" mode="aspectFit"></image>
					<!-- <view class="answer">
						小羊正在思考中...
					</view> -->
					<view class="loader1">

					</view>
				</view>
			</view>
		</view>
		<!-- 输入框 -->
		<view class="bottom">
			<textarea class="inpt" v-model="question" placeholder="请在此输入您的问题" placeholder-style="color:#aaa;"
				@linechange="changeHeight" :style="{height:inptHeight}" :show-confirm-bar="false">
			</textarea>
			<!-- 发送按钮 or 加载中按钮(禁止点击) -->
			<view class="btn" @tap="getAnser(question)" v-if="!ifThinking">
				<icon class="iconfont icon-fabu1"></icon>
			</view>
			<view class="btn2" v-else>
				<view class="loader2">
				</view>
			</view>
		</view>

		<!-- 重新登录提示窗 -->
		<u-modal v-model="reLogin" :content="tips" confirm-color="#70BCB2" title="温馨提示" :title-style="{color:'#fa5353'}"
			@confirm="goToLogin()">
		</u-modal>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				//用户个人信息
				userInfo: {},
				//AI的头像
				AIavatar: getApp().globalData.srcRoot + "aiSever2.png",
				//输入框的内容
				question: "",
				//输入框的高度
				inptHeight: "40rpx",
				//对话内容的列表    type为1表示是AI的回答，type为2表示是用户的提问
				chatList: [{
					role: "assistant",
					content: "您好,我是小羊.请问有什么可以帮助您的吗?"
				}],
				//是否正在加载AI回答
				ifThinking: false,
				//聊天内容底部位置
				pos: 0,
			};
		},
		methods: {
			//调整页面位置
			justifyPageScroll() {
				uni.createSelectorQuery().select(".content").boundingClientRect(rects => {
					let distance = rects.bottom; // 返回元素的距顶高度
					this.pos += distance;
					uni.pageScrollTo({
						scrollTop: this.pos,
						success: (res) => {
							console.log("位置调整成功!")
						},
						fail: (e) => {
							console.log("位置调整失败!")
						}
					})
				}).exec();
			},
			//当文本输入框行数改变时,改变它的高度
			changeHeight(e) {
				//行数 >= 2 时,增加高度为60rpx;否则,高度为40rpx 
				if (e.detail.lineCount >= 2) {
					if (this.inptHeight === "40rpx")
						this.inptHeight = "60rpx";
				} else {
					this.inptHeight = "40rpx";
				}
			},
			//调用AI接口获取回答
			getAnser(question) {
				question = question.trim();
				if (question === "") return;
				//修改AI状态为 思考中
				this.ifThinking = true;
				//清空输入框内容
				this.question = "";
				//追加用户的提问内容
				let addObj = {
					content: question,
					role: "user",
					createTime: "",
				}
				this.chatList.push(addObj);
				this.justifyPageScroll();

				uni.request({
					url: getApp().globalData.baseUrl + "/aidialogue/dialogue",
					method: "POST",
					data: {
						userId: this.userInfo.id,
						content: question
					},
					header: {
						authentication: getApp().globalData.authentication,
					},
					success: (res) => {
						if (res.statusCode != 200) {
							console.log("AI回答获取失败");
							return;
						}
						//追加AI的回答
						this.chatList = [...this.chatList, ...res.data.data.dialogueContent]
						//调整页面位置
						this.justifyPageScroll();
					},
					fail: (err) => {
						console.log("AI回答获取失败")
					},
					complete: () => {
						//修改AI的思考状态
						this.ifThinking = false;
					}
				})
			},
			//获取用户个人信息 并 开启AI对话
			openChat() {
				return new Promise((resolve, reject) => {
					//获取用户个人信息 并 开启AI对话
					uni.request({
						url: getApp().globalData.baseUrl + "/user/info",
						header: {
							authentication: getApp().globalData.authentication,
						},
						success: (res) => {
							//如果登录凭证过期则显示模态框，让用户回去重新登录
							if (res.statusCode == 401) {
								this.reLogin = true;
								return;
							}
							if (res.statusCode != 200) {
								console.log("用户信息获取失败");
								return;
							}
							this.userInfo = res.data.data;
							console.log("用户信息获取成功！")
							resolve(res.data);
						},
						fail: (err) => {
							console.log("用户信息获取失败");
							reject(err)
						}
					})
				})
			}
		},
		onLoad() {
			this.openChat()
				.then(() => {
					//根据用户id开启对话
					uni.request({
						url: getApp().globalData.baseUrl + `/aidialogue/${this.userInfo.id}`,
						header: {
							authentication: getApp().globalData.authentication,
						},
						success: (res) => {
							if (res.statusCode != 200) {
								console.log("开启对话失败!");
								return;
							}
							console.log("开启对话成功!")
						},
						fail: (err) => {
							console.log("开启对话失败!");
						}
					})
					//获取用户的所有历史对话记录
					uni.request({
						url: getApp().globalData.baseUrl + `/aidialogue/myall/${this.userInfo.id}`,
						header: {
							authentication: getApp().globalData.authentication,
						},
						success: (res) => {
							if (res.statusCode != 200) {
								console.log("获取所有对话内容失败!");
								return;
							}
							this.chatList = res.data.data.dialogueContent;
							// 如果长度记录为2及以上,则先删除前两条用于初始化的数据
							if (this.chatList.length >= 2) this.chatList.splice(0, 2);
							this.chatList.unshift({
								role: "assistant",
								content: "您好,我是小羊.请问有什么可以帮助您的吗?",
								createTime: ""
							}, )
							console.log("获取所有对话内容成功!")
							//调整页面位置
							setTimeout(() => {
								uni.createSelectorQuery().select(".content").boundingClientRect(
									rects => {
										let distance = rects.bottom; // 返回元素的距顶高度
										this.pos += distance;
										uni.pageScrollTo({
											scrollTop: this.pos,
											duration: 10,
											success: (res) => {
												console.log("位置调整成功!")
											},
											fail: (e) => {
												console.log("位置调整失败!")
											}
										})
									}).exec();
							}, 10)

						},
						fail: (err) => {
							console.log("获取所有对话内容失败!");
						}
					})
				})
		},
	}
</script>

<style lang="scss" scoped>
	.body {
		min-height: 100vh;

		.content {
			padding: 30rpx 30rpx 300rpx;

			.piece {
				font-size: 30rpx;
				letter-spacing: 0.1em;
				margin: 40rpx 0;

				.AI {
					display: flex;

					.AIavatar {
						width: 70rpx;
						height: 80rpx;
						margin-right: 15rpx;
					}

					.answer {
						background-color: #efefef;
						padding: 20rpx;
						border-radius: 20rpx;
						box-shadow: 0 2px 4px rgba(0, 0, 0, .12);
						max-width: 480rpx;
					}

					/* HTML: <div class="loader"></div> */
					.loader1 {
						margin-top: 12rpx;
						width: 80rpx;
						height: 40rpx;
						color: #000;
						border: 2rpx solid currentColor;
						border-right-color: transparent;
						padding: 3rpx;
						background:
							repeating-linear-gradient(90deg, currentColor 0 10rpx, #0000 0 15rpx) 0/0% no-repeat content-box content-box;
						position: relative;
						animation: l5 2s infinite steps(6);
					}

					.loader1::before {
						content: "";
						position: absolute;
						top: -2rpx;
						bottom: -2rpx;
						left: 100%;
						width: 10rpx;
						background:
							linear-gradient(#0000 calc(50% - 7rpx), currentColor 0 calc(50% - 5rpx),
								#0000 0 calc(50% + 5rpx), currentColor 0 calc(50% + 7rpx), #0000 0) left /100% 100%,
							linear-gradient(currentColor calc(50% - 5rpx), #0000 0 calc(50% + 5rpx), currentColor 0) left /2rpx 100%,
							linear-gradient(#0000 calc(50% - 5rpx), currentColor 0 calc(50% + 5rpx), #0000 0) right/2rpx 100%;
						background-repeat: no-repeat;
					}

					@keyframes l5 {
						100% {
							background-size: 120%
						}
					}
				}

				.user {
					display: flex;
					justify-content: flex-end;

					.Useravatar {
						width: 70rpx;
						height: 70rpx;
						border-radius: 50%;
						margin-left: 15rpx;
						overflow: hidden;

						.pic {
							height: 100%;
							width: 100%;
						}
					}

					.query {
						color: #fff;
						background-color: #81c8bf;
						padding: 20rpx;
						border-radius: 20rpx;
						box-shadow: 0 2px 4px rgba(0, 0, 0, .12);
						max-width: 480rpx;
					}
				}
			}
		}

		.bottom {
			position: fixed;
			display: flex;
			align-items: center;
			bottom: 0rpx;
			width: 100%;
			padding: 20rpx 30rpx 20rpx 50rpx;
			box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
			background-color: #fff;

			.inpt {
				height: 40rpx;
				width: 480rpx;
				padding: 20rpx 30rpx;
				border-radius: 40rpx;
				line-height: 1.1em;
				letter-spacing: 0.1em;
				font-size: 30rpx;
				background-color: #efefef;
			}

			.btn,
			.btn2 {
				margin-left: 20rpx;
				border-radius: 35rpx;
				width: 110rpx;
				height: 70rpx;
				line-height: 70rpx;
				text-align: center;
				color: #fff;
				background-color: #81c8bf;

				.iconfont {
					font-size: 40rpx;
				}
			}

			.btn2 {
				display: flex;
				justify-content: center;
				align-items: center;
				background-color: #A9DEE2;
			}

			/* HTML: <div class="loader2"></div> */
			.loader2 {
				width: 44rpx;
				aspect-ratio: 1;
				--_c: no-repeat radial-gradient(farthest-side, #fff 92%, #0000);
				background:
					var(--_c) top,
					var(--_c) left,
					var(--_c) right,
					var(--_c) bottom;
				background-size: 12rpx 12rpx;
				animation: l7 1s infinite;
			}

			@keyframes l7 {
				to {
					transform: rotate(.5turn)
				}
			}
		}
	}
</style>