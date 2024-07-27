<template>
	<view class="body">
		<!-- 自定义头部栏 -->
		<view class="Myheader" :style="{height:h}">
			<myNavigationBar :titleName="fromList.title" :needMenu="1" ref="nav"></myNavigationBar>
		</view>
		<view class="result" v-if="!tag">
			<view style="color: red;font-size: 40rpx;margin: 120rpx 0 40rpx;" v-show="getRes">
				<icon class="iconfont icon-a-zhuhe1" style="margin-right:20rpx;font-size: 40rpx;"></icon>
				恭喜您成功获得称号：
			</view>
			<view class="tag" v-for="(item,index) in result" :key="index">
				{{item}}
			</view>
			<view style="margin-top: 100rpx;">
				<image :src="pic" mode="aspectFit"></image>
			</view>
		</view>
		<view class="questionnaire" v-else>
			<view>
				{{fromList.introduce}} 。
			</view>
			<view class="line"></view>
			<form @submit="formSubmit" class="questionnaireContent">
				<radio-group class="questions" v-for="(item,index) in fromList.questions" :name="item.id" :key="index">
					<view class="itemTitle"><text
							style="position: absolute;left: 23rpx;">{{index+1}}.</text>{{item.content}}</view>
					<view class="choicesContent">
						<view class="choices" v-for="(choiceItem,idx) in item.choices" :key="idx">
							<label class="radio">
								<radio :value="choiceItem.choiceOrder" style="transform:scale(0.7)" />
								<text style="margin-left: 10rpx;">{{choiceItem.choice}}</text>
							</label>
						</view>
					</view>
				</radio-group>
				<button class="submit" form-type="submit">提交问卷</button>
			</form>
		</view>
		<!-- 已经填写过 提示窗 -->
		<u-modal v-model="show" content="您已填写过此问卷,是否重新填写" confirm-color="#70BCB2" title="温馨提示"
			:title-style="{color:'#fa5353'}" @confirm="tag = true" @cancel="goback()" :show-cancel-button="true">
		</u-modal>
	</view>
</template>
<script>
	import {
		getQuestionnaire,
		submitQuestionnaire
	} from '@/util/questionnaireApi.js'
	import {
		getUserTag
	} from "@/util/userApi.js"
	export default {
		data() {
			return {
				fromList: [],
				answers: [],
				show: false, //是否显示模态框
				tag: false,
				getRes: false,
				result: [],
				pic: getApp().globalData.srcRoot + "aiSever.png",
			}
		},
		methods: {
			// 返回上一页
			goback() {
				this.$refs.nav.goBack();
			},
			//提交问卷
			formSubmit(e) {
				console.log(e.detail.value);
				this.answers = Object.values(e.detail.value)
				for (let i = 0; i < this.answers.length; i++) {
					if (!this.answers[i]) {
						uni.showToast({
							icon: 'error',
							title: `请填写第${i+1}项`
						})
						return;
					}
				}
				submitQuestionnaire(this.answers).then(async res => {
					console.log("提交成功", res)
					//展示体质测试结果
					return getUserTag();

				}).then(res => {
					console.log("获取用户标签成功", res);
					this.tag = true;
					this.getRes = true;
					this.result = res.data.marks;
					console.log(res, "获取用户标签成功")
				}).catch(err => {
					console.log("提交失败", err)
				})

			}
		},
		onLoad() {
			// 检测是否填写过问卷
			getUserTag().then(res => {
				console.log("获取用户标签成功", res);
				if (!res.data.marks.length) {
					console.log("用户还没标签", res);
					this.tag = true;
					return;
				}
				console.log("用户有标签可以不用填问卷");
				this.show = true;
				this.getRes = true;
				this.result = res.data.marks
			}).catch(err => {
				console.log("获取用户标签失败", err);
			})
			// 获取问卷内容
			getQuestionnaire().then(res => {
				console.log("获取问卷成功", res)
				this.fromList = res.data.records[0];
			}).catch(err => {
				console.log("获取问卷失败", err)
			})
		}
	}
</script>

<style lang="scss" scoped>
	.result {
		padding: 40rpx;
		text-align: center;
		color: #fff;

		.tag {
			font-size: $main-fontsize;
			margin: 30rpx auto;
			padding: 12rpx 20rpx;
			background-color: $main-bgc;
			border-radius: 10rpx;
			width: 200rpx;
		}
	}

	.questionnaire {
		font-size: $main-fontsize;
		padding: 50rpx 40rpx;
		box-sizing: border-box;
		letter-spacing: 3rpx;

		.questionnaireTitle {
			font-weight: 900;
			text-align: center;
			color: $main-bgc;
			font-size: 40rpx;

			margin-bottom: 50rpx;
		}

		.line {
			height: 3rpx;
			width: 100%;
			border-bottom: 3rpx dashed black;
			margin: 60rpx 0 30rpx;
		}

		.questionnaireContent {
			height: auto;
			width: 100%;

			.questions {
				display: block;
				margin-bottom: 60rpx;
				margin-left: 20rpx;

				.itemTitle {
					font-weight: 900;
					line-height: 46rpx;
					margin-bottom: 24rpx;
				}

				.choicesContent {
					display: flex;
					flex-direction: column;
					border: 2rpx solid #0000004a;
					margin-right: 20rpx;

					.choices {
						border-bottom: 2rpx solid #0000004a;
						padding: 14rpx;
						display: flex;
						align-items: center;

						&:last-child {
							border-bottom: none;
						}
					}

				}
			}

			.submit {
				background-color: $main-bgc;
				color: #fff;
			}
		}
	}
</style>