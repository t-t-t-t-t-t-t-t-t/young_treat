<template>
	<view>
		<!-- 头部 -->
		<view class="Myheader" :style="{height: h}">
			<myNavigationBar titleName="主页"></myNavigationBar>
		</view>
		<!-- 轮播图 -->
		<view class="uni-margin-wrap">
			<swiper class="swiper" circular indicator-dots="true" autoplay="true">
				<swiper-item v-for="(item,index) in pics" :key="indes">
					<image class="swiper-item" :src="item" mode="aspectFill" />
				</swiper-item>
			</swiper>
		</view>
		<!-- 搜索框 -->
		<view class="search" @tap="goToSearch()">
			<input type="text" disabled confirm-type="search" placeholder="搜索发现更多" />
			<img src="/static/src/search_logo.png" alt="" />
		</view>
		<!-- 分类专辑导航 -->
		<view class="classify_nav">
			<functionButton v-for="(item, index) in classify_list" :key="index" :item="item" @tap="goToPage(item.id)">
			</functionButton>
			<!-- <navigator open-type="switchTab" url="/pages/news_forum/news_forum"  >
				<image :src="item.image" mode="aspectFill"></image>
				<text>{{item.name}}</text>
			</navigator> -->
		</view>
		<!-- 底部主题文化背景 -->
		<homeIntroduction class="introduction"></homeIntroduction>
		<!-- 智能客服 -->
		<view class="ai" @tap="goToChat()">
			<AISever></AISever>
		</view>
	</view>
</template>

<script>
	import {
		getUserTag
	} from '../../util/userApi.js'
	export default {
		data() {
			return {
				classify_list: [{
						id: 1,
						text: "智慧舌诊",
						icon: "icon-icon-shezhen"
					},
					{
						id: 2,
						text: "智能识物",
						icon: "icon-shiwu"
					},
					{
						id: 3,
						text: "养生视频",
						icon: "icon-shipincopy"
					},
					{
						id: 4,
						text: "体质调查",
						icon: "icon-tiaocha"
					},
					{
						id: 5,
						text: "睡眠专辑",
						icon: "icon-shuimian"
					},
					{
						id: 6,
						text: "养生食谱",
						icon: "icon-yangsheng"
					},
					{
						id: 7,
						text: "低卡零食",
						icon: "icon-lingshi"
					},
					{
						id: 8,
						text: "每日打卡",
						icon: "icon-daka"
					},
				],
				// 轮播图
				pics: ["https://img1.baidu.com/it/u=2396131346,2391001064&fm=253&fmt=auto&app=138&f=JPEG?w=889&h=500",
					"https://img1.baidu.com/it/u=3470267237,715811053&fm=253&fmt=auto&app=138&f=JPEG?w=890&h=500",
					"https://img0.baidu.com/it/u=1318947898,1446195524&fm=253&fmt=auto&app=138&f=JPEG?w=923&h=500"
				],
			};
		},
		onLoad() {
			this.getPics();
			// 判断有没有用户标签，是否做问卷
			getUserTag().then(res => {
				console.log("获取用户标签成功", res);
				if (!res.data.marks.length) {
					uni.navigateTo({
						url: "/subPages/questionnaire/questionnaire"
					})
					return;
				}
				console.log("用户有标签不用填问卷")
			}).catch(err => {
				console.log("获取用户标签失败", err);
			})
		},
		methods: {
			//跳转到搜索页面
			goToSearch() {
				uni.navigateTo({
					url: "/pages/searchAll/searchAll"
				})
			},
			//获取轮播图列表
			getPics() {
				uni.request({
					url: getApp().globalData.baseUrl + "/index/carousel",
					success: (res) => {
						this.pics = res.data.data.map(obj => obj.image);
						console.log("获取主页轮播图成功！");
					},
					fail: (err) => {
						console.log("获取主页轮播图失败！");
					}
				})
			},
			//跳转至各个分类
			goToPage(id) {
				let urlList = [
					"/subPages/tongueDiagnosis/tongueDiagnosis",
					 "", 
					 "/subPages/exercise/exercise",
					 "/subPages/questionnaire/questionnaire"
				]
				uni.navigateTo({
					url: urlList[id - 1]
				})

			},
			//跳转至AI对话页面
			goToChat() {
				uni.navigateTo({
					url: "/subPages/AIchat/AIchat"
				})
			},
		}
	}
</script>

<style lang="scss" scoped>
	.Myheader {
		height: 170rpx;
	}

	.uni-margin-wrap {
		.swiper {
			width: 672rpx;
			height: 400rpx;
			margin: 48rpx auto;

			image {
				width: 100%;
				height: 100%;
			}
		}
	}

	.search {
		position: relative;
		width: 672rpx;
		height: 90rpx;
		margin: 48rpx auto;

		input {
			height: 100%;
			padding: 0rpx 120rpx;
			font-family: 思源黑体;
			border-radius: 17.5rpx;
			opacity: 1;
			background: #D8D8D8;
		}

		img {
			position: absolute;
			height: 63rpx;
			width: 63rpx;
			top: 14rpx;
			left: 28rpx;
		}
	}

	.classify_nav {
		display: flex;
		flex-wrap: wrap;
		width: 669rpx;
		margin: 0 auto 30rpx;
		justify-content: space-between;

		navigator {
			width: 48%;
			position: relative;
			margin-bottom: 35rpx;
			overflow: hidden;

			image {
				width: 100%;
				height: 205rpx;
			}

			text {
				position: absolute;
				left: 38rpx;
				top: 103rpx;
				width: 248rpx;
				height: 82rpx;
				opacity: 1;

				font-family: YouSheBiaoTiHei;
				font-size: 63rpx;
				text-shadow: 0 0 4px #333,
					0 0 4px #333,
					0 0 4px #333,
					0 0 4px #333,
					0 0 4px #333;
				color: #fff;
				text-align: center;
			}
		}
	}

	.introduction {}

	.ai {
		position: fixed;
		bottom: 100rpx;
		right: 50rpx;
		width: 120rpx;
		height: 120rpx;
	}
</style>