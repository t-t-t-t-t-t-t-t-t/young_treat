<template>
	<view class="body">
		<!-- 头部 -->
		<view class="Myheader" :style="{height: h}">
			<myNavigationBar titleName="AI舌诊" :needMenu="1"></myNavigationBar>
		</view>
		<!-- 色条 -->
		<view class="colorBlock"></view>
		<!-- 滑动菜单 -->
		<view class="tabContainer">
			<u-tabs-swiper ref="uTabs" :list="list" :current="current" :is-scroll="false" swiperWidth="750"
				active-color="#b4dce1"></u-tabs-swiper>
		</view>
		<swiper :current="swiperCurrent" @transition="transition" @animationfinish="animationfinish" class="contents">
			<swiper-item class="swiper-item" v-for="(name,index) in list" :key="index">
				<!-- 舌面、舌下 -->
				<tongueCard @update="updateTempUrls"></tongueCard>
			</swiper-item>
		</swiper>
		<button class="next" @tap="nextStep">{{buttonText}}</button>
		
		<!-- 重新登录提示窗 -->
		<u-modal v-model="reLogin" :content="tips" confirm-color="#70BCB2" title="温馨提示" 
		:title-style="{color:'#fa5353'}" @confirm="goToLogin()">
		</u-modal>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				list: [{
						name: '舌面图'
					},
					{
						name: '舌下图'
					}
				],

				//临时文件数组
				tempUrls: [],
				// 因为内部的滑动机制限制，需将tabs组件和swiper组件的current用不同变量赋值
				current: 0, // tabs组件的current值，表示当前活动的tab选项
				swiperCurrent: 0, // swiper组件的current值，表示当前哪个swiper-item是活动的
				buttonText: '下一步'
			}
		},
		methods: {
			//点击“下一步”或者“查看报告”后的跳转
			nextStep() {
				if (this.swiperCurrent >= 1) {
					const that = this;
					// let resultData = {
					// 	code: 1,
					// 	msg: "OK",
					// 	data: {
					// 		msg: "",
					// 		code: "0000",
					// 		data: {
					// 			notifyCode: "931509205200932864",
					// 			explanation: "舌淡红而有齿痕，代表脾虚或气虚，加上外感风热或风寒化热入里则出现薄黄苔，表示邪热未甚。",
					// 			result: "1.脾虚或气虚；2.外感风热/风寒化热。",
					// 			medicineTotal: 92,
					// 			subDiagProject: "",
					// 			subDiagProjectDetail: "",
					// 			subImage: "",
					// 			tongueImage: ' https: //file.youlai.cn/cnkfile1/M00/1A/34/o4YBAFo7cdyAfvktAAHzASFNYSQ33.jpeg',
					// 			tongueColour: {
					// 				type: "淡红舌",
					// 				explain: "舌色淡红润泽，白中透红。为气血调和的征象，常见于正常人，疾病时见之多属病轻。"
					// 			},
					// 			tongueFurColour: {
					// 				type: "黄苔",
					// 				explain: "由于热邪熏灼，故苔现黄色，苔色愈黄，邪热愈甚。主里证、热证。淡黄色为热轻，深黄苔为热重，焦黄苔为热极"
					// 			},
					// 			tongueFurQuality: [{
					// 				type: "厚腻苔",
					// 				explain: "厚苔：不能透过舌苔见到舌体。腻苔：苔质颗粒细腻致密，紧贴舌面，不容易刮掉。厚腻苔是由胃气挟湿浊、痰湿、食滞等邪气熏蒸所致；当痰湿浊邪化热时，还可在苔色上反映出来，如苔黄厚腻，为湿热、痰热、暑温等邪内蕴。"
					// 			}],
					// 			tongueShape: [{
					// 				type: "瘦薄舌",
					// 				explain: "舌体瘦小而薄。主气血不足、阴虚火旺"
					// 			}],
					// 			ext: {
					// 				coronaVirusDisease: 26.894,
					// 				coronaVirusDiseaseDelta: 26.894
					// 			},
					// 			suggest: {
					// 				food: "桑叶薄荷饮材料：桑叶5克，菊花5克，薄荷3克，苦竹叶30克。做法：将上药用清水洗净，放入茶壶内，用开水泡十分钟即可，随时饮用。功效：本品对风热感冒既有辛凉解表作用，又可做为预防茶剂饮用。",
					// 				foodWorse: "风热外感者忌食桂圆、大枣、荔枝、樱桃、狗肉、羊肉、胡椒、花椒、砂仁、丁香、鸡蛋、甲鱼以及生姜、肉桂、辣椒、荜茇、吴茱萸、荜澄茄、大茴香、小茴香等调味品和鹅肉、牛肉、阿胶、人参、黄芪、胎盘等。",
					// 				foodBetter: "宜多吃有助于散风清热的食品，如绿豆、萝卜、白菜、薄荷、鲜梨。",
					// 				medicine: "治疗风热感冒常选用菊花、薄荷、桑叶等。代表方剂为银翘散、桑菊饮。风热感冒要多饮水、饮食宜清淡。"
					// 			},
					// 			program: {
					// 				diseaseTags: "外感风热",
					// 				symptomsIntroduction: "外感风热是风热之邪犯表、肺气失和所致。症状表现为发热重、 微恶风、 头胀痛、 有汗、 咽喉红肿疼痛、 咳嗽、 痰黏或黄、 鼻塞黄涕、 口渴喜饮、 舌尖边红、 苔薄白微黄。风寒化热是指外感风寒治疗不及时或治疗不对症导致风寒入里， 转为热证， 在中医属于变症， 属于病由外入里。治疗宜辛凉解表。 ",
					// 				remarks: "外感风热不适宜艾灸，可尝试以下治法：\n1. 可用皮肤针叩刺大椎穴， 然后拔罐；\n2. 有咳嗽症状的可在肺俞穴上拔罐， 留罐10分钟后取下， 另配合针刺太渊穴、 尺泽穴宣肃肺气兼泻肺热；\n3. 有咽痛症状的可配合手部咽痛穴或在少商穴处放血。 ",
					// 				clinicalExperience: "",
					// 				specificProgram: []
					// 			},
					// 			tongueImageResult: null,
					// 			corporeityResult: {
					// 				recordNo: "202403231221209827761045504",
					// 				recordStatus: 3,
					// 				resultList: [{
					// 						typeCode: "a_yang_asthenia",
					// 						typeName: "阳虚质",
					// 						directionCode: "basic",
					// 						directionName: "基本是",
					// 						features: "阳气不足，以畏寒怕冷、手足不温等虚寒表现为主要特征，体型偏瘦。",
					// 						inclination: "易患痰饮、腹泻、肥胖、失眠、骨质疏松、低血压、耳鸣、痹症等病症。",
					// 						dietaryAdvice: "阳虚质宜多食用甘温补脾阳、肾阳为主的食物",
					// 						dietaryAdviceSuitable: "减少食盐的摄入，以避免肥胖、肿胀、小便不利、高血压；少用抗生素和清热解毒类中药，以保护阳气；饮食上要多吃些令身体温暖的食物。\n如： 常用的有动物肉、 带鱼、 黄鳝、 虾、 韭菜、 南瓜、 黄豆芽、 茴香、 洋葱、 香菜、 胡萝卜、 山药、 荔枝、 龙眼、 榴莲、 樱桃、 杏、 大枣、 核桃、 栗子、 腰果、 松子等。 ",
					// 						dietaryAdviceAvoid: "不宜吃生冷、苦寒、黏腻食物，如田螺、螃蟹、西瓜、冷冻饮品等，即使在盛夏也不要吃寒凉之物。",
					// 						commonDiseases: "总是手脚发凉，胃脘部（小腹附近）总是怕冷，衣服比别人穿得多，耐受不了冬天的寒冷，夏天耐受不了空调房间的冷气，喜欢安静，吃凉的东西总会感到不舒服，容易大便稀溏，小便颜色清，量多。",
					// 						conditioning: "阳虚质者多生内寒，治以温暖散寒，故总体采用补肾温阳之法。",
					// 						healthPlanId: null,
					// 						ratio: 70
					// 					},
					// 					{
					// 						typeCode: "b_yin_asthenia",
					// 						typeName: "阴虚质",
					// 						directionCode: "basic",
					// 						directionName: "基本是",
					// 						features: "阴液少，以口燥咽干、手足心热等虚热表现为主要特征，体型偏瘦。",
					// 						inclination: "易患结核病、色斑、肿瘤、高血压、高脂血症、糖尿病、便秘等病症。",
					// 						dietaryAdvice: "阴虚质平时多吃滋补肾阴食物",
					// 						dietaryAdviceSuitable: "保证充足的睡眠时间，以藏养阴气，特别是秋冬季，更要注意保护阴精，多吃滋补机体阴气的食物。\n如： 芝麻、 绿豆、 鸭肉、 猪肉、 猪皮、 兔肉、 牛奶、 豆腐、 乌贼、 龟、 鳖、 螃蟹、 牡砺、 蛤俐、 海哲、 海参、 苦瓜、 甘蔗、 木耳、 银耳等。 ",
					// 						dietaryAdviceAvoid: "不宜吃温燥、辛辣、香浓的食物，同时阴虚质亚健康者应忌吃煎炸炒爆食品和脂肪含量过高食物。",
					// 						commonDiseases: "手脚心发热，平时总感觉口燥咽干，鼻头发干，总是感觉口渴爱吃冷饮，舌头发红，口干，唾液少，经常感觉头晕眼花，视物模糊耳鸣，失眠，大便干燥，小便短涩。",
					// 						conditioning: "阴虚质者多生内热，治以滋润脏腑，消除内热，故总体采用滋补肾阴之法。",
					// 						healthPlanId: null,
					// 						ratio: 30
					// 					}
					// 				]
					// 			}
					// 		}
					// 	}
					// };
					// uni.navigateTo({ //页面跳转
					// 	url: `/subPages/diagnoseResult/diagnoseResult`,
					// 	success: function(res) {
					// 		// 向下一个页面传数据
					// 		uni.hideLoading()
					// 		res.eventChannel.emit('getTongueImg', that.tempUrls) // 传舌头图片
					// 		res.eventChannel.emit('getTongueDiagnosis', resultData.data.data)
					// 	}
					// })
					// return;
					//显示加载框
					uni.showLoading({
						title: '正在生成报告'
					});
					console.log('舌头图片', this.tempUrls)
					this.getTongueDiagnosisData().then(data => {
						uni.hideLoading();
						if (!data.data) { // 识别出错
							console.log('识别出错')
							uni.hideLoading()
							uni.showToast({
								icon: 'error',
								title: data.msg || '识别出错，请重新上传图片',
							})
							setTimeout(() => {
								uni.hideToast()
								uni.reLaunch({
									url: '/subPages/tongueDiagnosis/tongueDiagnosis'
								})
							}, 3000)
							return;
						}
						// 识别成功
						console.log("得到数据后执行的", data)
						uni.navigateTo({ //页面跳转
							url: `/subPages/diagnoseResult/diagnoseResult`,
							success: function(res) {
								// 向下一个页面传数据
								console.log('传给另一个页面的结果', data.data.data)
								uni.hideLoading()
								console.log(that.tempUrls);
								res.eventChannel.emit('getTongueImg', that.tempUrls) // 传舌头图片
								res.eventChannel.emit('getTongueDiagnosis', data.data.data) // 传舌诊断结果
							}
						})
					}).catch(err => {
						console.log(err)
					})
					return;
				}
				if (!this.tempUrls[0]) {
					return;
				}
				this.swiperCurrent++;
				if (this.swiperCurrent == 1) {
					this.buttonText = '查看报告';
				}
			},
			getTongueDiagnosisData() {
				return new Promise((resolve, reject) => {
					uni.request({
						url: getApp().globalData.baseUrl + "/tongueanalysis/my/analysis",
						method: 'POST',
						data: {
							tongueFrontImgPath: this.tempUrls[0],
							tongueBottomImgPath: this.tempUrls[0]
						},
						header: {
							authentication: getApp().globalData.authentication,
						},
						success: (res) => {
							//如果登录凭证过期则显示模态框，让用户回去重新登录
							if(res.statusCode==401){
								this.reLogin = true;
								return;
							}
							console.log("调用接口成功", res)
							resolve(res.data)
						},
						fail: (error) => {
							console.log("调用接口失败", error)
							reject(error)
						}
					})
				})
			},
			//更新临时图片数组
			updateTempUrls(tempUrl) {
				//加入 临时图片数组 中
				this.tempUrls.push(tempUrl)
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
		}
	}
</script>

<style lang="scss" scoped>
	.body {
		display: flex;
		flex-direction: column;
		height: 100vh;

		.Myheader {
			height: 200rpx;
		}

		.colorBlock {
			background-color: #A9DEE2;
			height: 8%;
		}
	}

	.tabContainer {
		box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.3);
		height: 117.5rpx;
		display: flex;
		justify-content: center;
		align-items: center;
	}



	.swiper-item {
		display: flex;
		justify-content: center;
	}

	.contents {
		height: 880rpx;
	}

	.next {
		height: 100rpx;
		width: 460rpx;
		line-height: 100rpx;
		border-radius: 17.5rpx;
		background-color: #A9DEE2;
		color: #fff;
	}
</style>