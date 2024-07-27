<template>
	<view class="body">
		<!-- 头部 -->
		<view class="Myheader" :style="{height: h}">
			<myNavigationBar titleName="健康状态报告" :needMenu="1" :ifcheck="false"></myNavigationBar>
		</view>
		<view class="colorBlock" :style="{top: h }"></view>
		<!-- 个人信息 -->
		<view class="userInfo" :style="{marginTop: h}">
			<view><strong>姓名：</strong>{{infoList.name}}</view>
			<view>
				<view style="margin: 20rpx 0;">
					<strong>性别：</strong>{{infoList.gender}}
				</view>
				<view>
					<strong>日期：</strong>{{now.getFullYear()}}年{{now.getMonth() + 1}}月{{now.getDate()}}日
				</view>
			</view>
		</view>
		<!-- 报告结果 -->
		<view class="result">
			<view class="diagnoseImg" style="padding: 20rpx 0;margin-top: 70rpx;">
				<view class="picBlock" v-for="(item,index) in tongueImg" :key="index">
					<image :src='item.img' mode="aspectFill" class="pics"></image>
					<view class="picText">{{item.part}}</view>
				</view>
			</view>
			<view class="healthStatus" style="margin-top: 40rpx;">
				<view class="right">
					<text class="title">
						健康状态：
					</text>
					<view class="detail">
						{{result.result}}
					</view>
				</view>
			</view>
			<view class="resultTitleContent">
				<view class="resultTitleItem" @tap="changeResult(0)">
					<image class="resultTitleImg" src="../../static/src/tongueDiagnosis1.png" mode="aspectFit"></image>
					<text class="name">舌象辨识</text>
				</view>
				<view class="resultTitleItem" @tap="changeResult(1)">
					<image class="resultTitleImg" src="../../static/src/tongueDiagnosis2.png" mode="aspectFit"></image>
					<text class="name">健康分析</text>
				</view>
				<view class="resultTitleItem" @tap="changeResult(2)">
					<image class="resultTitleImg" src="../../static/src/tongueDiagnosis3.png" mode="aspectFit"></image>
					<text class="name">调理方案</text>
				</view>
			</view>

			<view v-if="swiperCurrent==0" class="content">
				<view class="card">
					<view class="left">
						<view class="title">
							舌色与说明
						</view>
					</view>
					<view class="right">
						<view class="detail">
							<strong>具体舌色：</strong>
							{{result.tongueColour.type}}
							<strong>舌色含义具体说明：</strong>
							{{result.tongueColour.explain}}
						</view>
					</view>
				</view>
				<view class="card">
					<view class="left">
						<view class="title">
							苔色与说明
						</view>
					</view>
					<view class="right">
						<view class="detail">
							<strong>具体苔色：</strong>
							{{result.tongueFurColour.type}}
							<strong>苔色含义具体说明：</strong>
							{{result.tongueFurColour.explain}}
						</view>
					</view>
				</view>
				<view class="card">
					<view class="left">
						<view class="title">
							苔质与说明
						</view>
					</view>
					<view class="right">
						<view class="detail" v-for="(item,index) in result.tongueFurQuality" :key="index">
							<strong>具体苔质：</strong>
							{{item.type}}
							<strong>苔质含义具体说明：</strong>
							{{item.explain}}
						</view>
					</view>
				</view>
				<view class="card">
					<view class="left">
						<view class="title">
							舌形与说明
						</view>
					</view>
					<view class="right">
						<view class="detail" v-for="(item,index) in result.tongueShape" :key="index">
							<strong>具体舌形：</strong>
							{{item.type}}
							<strong>舌形含义具体说明：</strong>
							{{item.explain}}
						</view>
					</view>
				</view>
			</view>
			<view v-else-if="swiperCurrent==1" class="content">
				<view class="card">
					<view class="left">
						<view class="title">
							体质报告
						</view>
					</view>
					<view class="right">
						<view class="detail" v-for="(item,index) in result.corporeityResult.resultList" :key="index">
							<strong>体质名称：{{item.typeName}}</strong>
							<strong>总体特征：</strong>{{item.features}}
							<strong>发病倾向：</strong>{{item.inclination}}
							<strong>食疗建议：</strong>{{item.dietaryAdvice}}
							<strong>食疗建议-宜</strong>{{item.dietaryAdviceSuitable}}
							<strong>食疗建议-忌：</strong>{{item.dietaryAdviceAvoid}}
							<strong>病症：</strong>{{item.commonDiseases}}
							<strong>调理思路：</strong>{{item.conditioning}}
						</view>
					</view>
				</view>
			</view>
			<view v-else-if="swiperCurrent==2" class="content">
				<view class="card">
					<view class="left">
						<view class="title">
							调理建议
						</view>
					</view>
					<view class="right">
						<view class="detail">
							<strong>食疗调理建议：</strong>{{result.suggest.food}}
							<strong>食疗宜食：</strong>{{result.suggest.foodBetter}}
							<strong>食疗忌食：</strong>{{result.suggest.foodWorse}}
							<strong>中医调理建议：</strong>{{result.suggest.medicine}}
						</view>
					</view>
				</view>
				<view class="card">
					<view class="left">
						<view class="title">
							调理方案
						</view>
					</view>
					<view class="right">
						<view class="detail">
							<strong>疾病标签：</strong>{{result.program.diseaseTags}}
							<strong>症状介绍：</strong>{{result.program.symptomsIntroduction}}
							<strong>备注：</strong>
							{{result.program.remarks}}
						</view>
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				swiperCurrent: 0,
				infoList: {
					name: '饭醉分子',
					gender: '男',
					age: '20',
				},
				result: {},
				//图片资源
				tongueImg: [{
						part: '舌面',
						img: ''
					},
					{
						part: '舌下',
						img: ''
					}
				],
				//日期对象
				now: "",
			}
		},
		methods: {
			changeResult(idx) {
				this.swiperCurrent = idx;
			}
		},
		onLoad(option) {
			//获取当前日期
			this.now = new Date();
			const eventChannel = this.getOpenerEventChannel();
			eventChannel.on('getTongueDiagnosis', (res) => {
				console.log("接收到上一个页面传来的数据成功")
				console.log(res)
				this.result = res
			})
			eventChannel.on('getTongueImg', (res) => {
				console.log("图片", res)
				for (let i = 0; i < res.length; i++) {
					this.tongueImg[i].img = res[i];
				}
				if (res.length == 1) {
					this.tongueImg.splice(1, 1)
				}
			})
			uni.request({
				url: getApp().globalData.baseUrl + "/user/info",
				method: 'GET',
				header: {
					authentication: getApp().globalData.authentication,
				},
				success: (res) => {
					console.log("获取用户信息成功", res)
					this.infoList = res.data.data
				},
				fail: (error) => {
					console.log("获取用户信息失败", error)
				}
			})
		}
	}
</script>

<style lang="scss" scoped>
	.body {
		display: flex;
		flex-direction: column;
		height: 100vh;

		.Myheader {
			position: relative;
			margin-bottom: 50rpx;
		}


		.colorBlock {
			height: 333rpx;
			width: 750rpx;
			border-radius: 0 0 50% 50%;
			background-color: #a9dee2;
			position: absolute;
			top: 60px;
			z-index: -1;
		}

		.userInfo {
			margin: 35rpx 86rpx;

			strong {
				display: inline-block;
				font-weight: 600;
			}

		}

		.result {
			display: flex;
			justify-content: center;
			flex-wrap: wrap;

			.resultTitleContent {
				height: 200rpx;
				width: 100%;

				padding: 20rpx;
				box-sizing: border-box;

				display: flex;
				justify-content: space-evenly;
				align-items: center;

				.resultTitleItem {
					width: 30%;
					height: 100%;
					padding: 20rpx;
					box-sizing: border-box;

					display: flex;
					flex-direction: column;
					align-items: center;
					background-color: #fff;
					box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.3);
					border-radius: 17.5rpx;

					.resultTitleImg {
						$size: 80rpx;
						height: $size;
						width: $size;
					}

					.name {
						font-weight: 900;
					}
				}
			}

			.diagnoseImg {
				width: 631rpx;
				margin-bottom: 44rpx;
				padding: 20rpx;
				border-radius: 17.5rpx;
				background-color: #fff;
				box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.3);
				display: flex;
				justify-content: center;
				margin-top: 140rpx;
				position: relative;

				.picBlock {
					width: 193.5rpx;
					height: 193.5rpx;
					padding: 0 22rpx;
					display: flex;
					flex-wrap: wrap;
					justify-content: center;

					.pics {
						width: 149rpx;
						height: 149rpx;
					}

					.picText {
						width: 180rpx;
						text-align: center;
					}
				}


			}

			.healthStatus {
				width: 631rpx;
				margin-bottom: 44rpx;
				padding: 20rpx;
				border-radius: 17.5rpx;
				background-color: #fff;
				box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.3);
				display: flex;
				justify-content: center;
				margin-top: 140rpx;
				position: relative;

				.left {
					$height: 140rpx;
					position: absolute;
					top: -120rpx;
					left: -20rpx;
					height: $height;
					z-index: 12;
					display: flex;
					flex-wrap: nowrap;
					align-items: center;

					.title {
						font-size: 40rpx;
						margin-bottom: 8rpx;
						font-weight: 600;
						margin-left: 20rpx;
						color: #a9dee2;
					}
				}

				.right {
					width: 100%;
					padding: 18rpx 0;

					.title {
						font-size: 40rpx;
						margin-bottom: 8rpx;
						font-weight: 600;
					}

					.detail {
						font-size: 30rpx;

						strong {
							font-weight: 600;
							font-size: 35rpx;
							margin-top: 20rpx;
						}
					}
				}
			}


			.card {
				width: 631rpx;

				padding: 20rpx;

				border-radius: 17.5rpx;
				background-color: #efefef;
				margin-bottom: 44rpx;
				display: flex;
				justify-content: center;
				margin-top: 140rpx;
				position: relative;

				.left {
					$height: 140rpx;
					position: absolute;
					top: -120rpx;
					left: -20rpx;
					height: $height;
					z-index: 12;
					display: flex;
					flex-wrap: nowrap;
					align-items: center;

					.title {
						font-size: 40rpx;
						margin-bottom: 8rpx;
						font-weight: 600;
						margin-left: 20rpx;
						color: #a9dee2;
					}
				}

				.right {
					width: 100%;
					padding: 18rpx 0;

					.title {
						font-size: 40rpx;
						margin-bottom: 8rpx;
						font-weight: 600;
					}

					.detail {
						font-size: 30rpx;

						strong {
							font-weight: 600;
							font-size: 35rpx;
							margin-top: 20rpx;
						}
					}
				}

			}
		}


	}
</style>